"""
Feedback Generation Service

Converts technical pose comparison data into human-readable feedback using OpenAI LLM.
This service is called AFTER dance sections complete (batch processing, not real-time).
"""
from typing import List, Dict, Any, Optional
from openai import OpenAI
from app.data.config import settings


class FeedbackGenerationService:
    """
    Service for generating AI-powered dance feedback.

    Takes technical error data (angles, positions) and converts them into
    friendly, actionable feedback using OpenAI's GPT models.

    This is an INTERNAL backend service - NOT exposed to the API directly.
    API functions call this service after dance sections complete.
    """

    def __init__(self):
        """Initialize the OpenAI client with settings from config."""
        if not settings.openai_api_key:
            raise ValueError(
                "OpenAI API key not found. Please set OPENAI_API_KEY in your .env file"
            )

        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = settings.llm_model
        self.max_tokens = settings.llm_max_tokens
        self.temperature = settings.llm_temperature

    def generate_feedback(
        self,
        problem_segments: List[Dict[str, Any]],
        max_items: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Generate feedback for detected problem segments.

        Args:
            problem_segments: List of problem segments with technical error data.
                Each segment should have:
                - timestamp_start: float
                - timestamp_end: float
                - errors: List of error dictionaries with body_part, expected, actual, difference
                - accuracy: float (0-1)
            max_items: Maximum number of feedback items to generate (uses config default if None)

        Returns:
            List of feedback dictionaries with:
            - timestamp: float (midpoint of segment)
            - title: str (brief description)
            - feedback: str (actionable advice)
            - severity: str ("high", "medium", "low")
            - body_parts: List[str]
        """
        max_items = max_items or settings.max_feedback_items_per_section

        # Limit to most significant problems
        sorted_segments = sorted(
            problem_segments,
            key=lambda x: x.get('accuracy', 1.0)  # Lower accuracy = bigger problem
        )[:max_items]

        feedback_items = []

        for segment in sorted_segments:
            try:
                feedback_item = self._generate_single_feedback(segment)
                feedback_items.append(feedback_item)
            except Exception as e:
                # Fallback to template-based feedback if LLM fails
                feedback_items.append(self._generate_fallback_feedback(segment))
                print(f"LLM feedback generation failed: {e}. Using fallback.")

        return feedback_items

    def _generate_single_feedback(self, segment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate feedback for a single problem segment using OpenAI LLM.

        Args:
            segment: Problem segment data with errors and timing

        Returns:
            Feedback dictionary
        """
        # Construct the prompt with structured error data
        prompt = self._build_prompt(segment)

        # Call OpenAI API
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a friendly and encouraging K-pop dance instructor. "
                        "Your job is to help students improve their dance technique by "
                        "providing specific, actionable feedback based on technical error data. "
                        "Keep feedback conversational, positive, and under 100 words."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=self.max_tokens,
            temperature=self.temperature
        )

        feedback_text = response.choices[0].message.content.strip()

        # Extract body parts and determine severity
        body_parts = list(set(
            error.get('body_part', 'unknown')
            for error in segment.get('errors', [])
        ))

        severity = self._calculate_severity(segment)

        # Calculate midpoint timestamp for the feedback
        timestamp = (
            segment.get('timestamp_start', 0) + segment.get('timestamp_end', 0)
        ) / 2

        return {
            "timestamp": timestamp,
            "title": self._generate_title(segment),
            "feedback": feedback_text,
            "severity": severity,
            "body_parts": body_parts
        }

    def _build_prompt(self, segment: Dict[str, Any]) -> str:
        """
        Build the LLM prompt from technical error data.

        Args:
            segment: Problem segment with error data

        Returns:
            Formatted prompt string
        """
        timestamp_start = segment.get('timestamp_start', 0)
        timestamp_end = segment.get('timestamp_end', 0)
        errors = segment.get('errors', [])
        accuracy = segment.get('accuracy', 0.0)

        prompt = f"""A student just attempted a K-pop dance move from {timestamp_start:.1f}s to {timestamp_end:.1f}s.
Their overall accuracy for this segment was {accuracy*100:.1f}%.

Technical errors detected:
"""

        for error in errors:
            body_part = error.get('body_part', 'unknown')
            expected = error.get('expected', 'N/A')
            actual = error.get('actual', 'N/A')
            difference = error.get('difference', 'N/A')

            prompt += f"- {body_part}: expected {expected}, got {actual} (difference: {difference})\n"

        prompt += """
Generate friendly, actionable feedback:
1. What went wrong (in plain English, not technical terms)
2. Why it matters for the choreography
3. Specific correction steps
4. Brief encouragement

Keep it conversational and under 100 words."""

        return prompt

    def _generate_fallback_feedback(self, segment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate template-based feedback if LLM fails.

        Args:
            segment: Problem segment data

        Returns:
            Feedback dictionary using templates
        """
        errors = segment.get('errors', [])
        timestamp = (
            segment.get('timestamp_start', 0) + segment.get('timestamp_end', 0)
        ) / 2

        # Simple template-based feedback
        if errors:
            primary_error = errors[0]
            body_part = primary_error.get('body_part', 'body position')
            difference = primary_error.get('difference', 'off')

            feedback_text = (
                f"Your {body_part} needs adjustment. "
                f"Try to match the reference position more closely. "
                f"The difference was {difference}. Keep practicing!"
            )
        else:
            feedback_text = "Keep working on matching the reference pose more closely."

        body_parts = list(set(
            error.get('body_part', 'unknown')
            for error in errors
        ))

        return {
            "timestamp": timestamp,
            "title": self._generate_title(segment),
            "feedback": feedback_text,
            "severity": self._calculate_severity(segment),
            "body_parts": body_parts
        }

    def _generate_title(self, segment: Dict[str, Any]) -> str:
        """
        Generate a brief title for the feedback item.

        Args:
            segment: Problem segment data

        Returns:
            Title string
        """
        timestamp_start = segment.get('timestamp_start', 0)
        errors = segment.get('errors', [])

        if errors:
            primary_body_part = errors[0].get('body_part', 'Position').replace('_', ' ').title()
            return f"{primary_body_part} at {timestamp_start:.1f}s"

        return f"Movement at {timestamp_start:.1f}s"

    def _calculate_severity(self, segment: Dict[str, Any]) -> str:
        """
        Calculate severity level based on accuracy and error magnitude.

        Args:
            segment: Problem segment data

        Returns:
            Severity level: "high", "medium", or "low"
        """
        accuracy = segment.get('accuracy', 1.0)

        if accuracy < 0.5:
            return "high"
        elif accuracy < 0.7:
            return "medium"
        else:
            return "low"

    def generate_session_summary(
        self,
        live_feedback_history: List[Dict[str, Any]],
        session_statistics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate a comprehensive session summary from live feedback history.

        This method takes all the live feedback generated during a session and
        creates an overall summary with key insights, patterns, and recommendations.

        Args:
            live_feedback_history: List of live feedback records from the session.
                Each record should contain:
                - timestamp: float (seconds from session start)
                - feedback_text: str (the live feedback given)
                - severity: str ("high", "medium", "low")
                - focus_areas: List[str] (body parts that needed attention)
                - similarity_score: float (0.0-1.0)
                - is_positive: bool (whether feedback was encouragement)
                - context: Dict (performance trends, persistent issues, etc.)
            session_statistics: Session stats from ScoringService containing:
                - total_duration: float
                - average_score: float
                - best_moment: Dict
                - worst_moment: Dict
                - total_frames: int
                - problem_segments_count: int
                - score_distribution: Dict

        Returns:
            Dict containing:
            - overall_summary: str (LLM-generated narrative summary)
            - key_insights: List[str] (main takeaways)
            - improvement_areas: List[Dict] (areas needing work with recommendations)
            - strengths: List[str] (things done well)
            - session_statistics: Dict (passed through)
            - feedback_count: int (total feedback items)
        """
        if not live_feedback_history:
            return {
                "overall_summary": "No feedback data available for this session.",
                "key_insights": [],
                "improvement_areas": [],
                "strengths": [],
                "session_statistics": session_statistics,
                "feedback_count": 0
            }

        # Analyze the feedback history
        total_feedback = len(live_feedback_history)
        negative_feedback = [f for f in live_feedback_history if not f.get('is_positive', False)]
        positive_feedback = [f for f in live_feedback_history if f.get('is_positive', False)]

        # Extract common problem areas
        focus_area_counts = {}
        for feedback in live_feedback_history:
            for area in feedback.get('focus_areas', []):
                focus_area_counts[area] = focus_area_counts.get(area, 0) + 1

        # Sort to find most frequent problem areas
        common_problems = sorted(
            focus_area_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]  # Top 5 problem areas

        # Group feedback by severity
        high_severity = [f for f in live_feedback_history if f.get('severity') == 'high']
        medium_severity = [f for f in live_feedback_history if f.get('severity') == 'medium']
        low_severity = [f for f in live_feedback_history if f.get('severity') == 'low']

        # Build prompt for LLM summary
        prompt = self._build_session_summary_prompt(
            live_feedback_history=live_feedback_history,
            session_statistics=session_statistics,
            common_problems=common_problems,
            severity_distribution={
                'high': len(high_severity),
                'medium': len(medium_severity),
                'low': len(low_severity)
            }
        )

        # Generate LLM summary
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an experienced K-pop dance instructor providing a session summary. "
                            "Be encouraging but honest. Focus on patterns, progress, and actionable advice. "
                            "Keep the summary concise (200-300 words) and organized."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=400,
                temperature=0.7
            )

            overall_summary = response.choices[0].message.content.strip()

        except Exception as e:
            print(f"LLM session summary generation failed: {e}. Using fallback.")
            # Fallback summary
            avg_score = session_statistics.get('average_score', 0.0)
            overall_summary = self._generate_fallback_session_summary(
                avg_score, total_feedback, common_problems
            )

        # Extract key insights
        key_insights = self._extract_key_insights(
            live_feedback_history, session_statistics, common_problems
        )

        # Generate improvement areas with recommendations
        improvement_areas = self._generate_improvement_areas(common_problems, live_feedback_history)

        # Extract strengths
        strengths = self._extract_strengths(session_statistics, positive_feedback)

        return {
            "overall_summary": overall_summary,
            "key_insights": key_insights,
            "improvement_areas": improvement_areas,
            "strengths": strengths,
            "session_statistics": session_statistics,
            "feedback_count": total_feedback,
            "severity_distribution": {
                'high': len(high_severity),
                'medium': len(medium_severity),
                'low': len(low_severity)
            }
        }

    def _build_session_summary_prompt(
        self,
        live_feedback_history: List[Dict[str, Any]],
        session_statistics: Dict[str, Any],
        common_problems: List[tuple],
        severity_distribution: Dict[str, int]
    ) -> str:
        """Build prompt for session summary generation."""
        avg_score = session_statistics.get('average_score', 0.0)
        total_duration = session_statistics.get('total_duration', 0.0)
        total_frames = session_statistics.get('total_frames', 0)

        prompt = f"""Dance Session Summary Request:

Session Duration: {total_duration:.1f} seconds
Total Poses Analyzed: {total_frames}
Average Similarity Score: {avg_score:.1%}

Feedback Distribution:
- High Severity Issues: {severity_distribution.get('high', 0)}
- Medium Severity Issues: {severity_distribution.get('medium', 0)}
- Low Severity Issues: {severity_distribution.get('low', 0)}

Most Common Problem Areas:
"""
        for area, count in common_problems[:5]:
            prompt += f"- {area.replace('_', ' ').title()}: {count} times\n"

        prompt += f"""
Sample Feedback Given During Session:
"""
        # Include a sample of feedback (first 5 and last 5)
        sample_feedback = (
            live_feedback_history[:3] +
            live_feedback_history[-2:] if len(live_feedback_history) > 5
            else live_feedback_history
        )

        for i, feedback in enumerate(sample_feedback[:5], 1):
            timestamp = feedback.get('timestamp', 0)
            text = feedback.get('feedback_text', '')
            prompt += f"{i}. [{timestamp:.1f}s] {text}\n"

        prompt += """
Please provide:
1. Overall performance assessment
2. Main patterns observed (good and bad)
3. Top 3 specific recommendations for improvement
4. Encouragement and next steps

Keep it conversational, specific, and actionable."""

        return prompt

    def _generate_fallback_session_summary(
        self,
        avg_score: float,
        total_feedback: int,
        common_problems: List[tuple]
    ) -> str:
        """Generate a template-based session summary if LLM fails."""
        if avg_score >= 0.8:
            performance = "Excellent work"
        elif avg_score >= 0.6:
            performance = "Good effort"
        else:
            performance = "Keep practicing"

        summary = f"{performance}! Your average similarity score was {avg_score:.1%}. "
        summary += f"You received {total_feedback} pieces of feedback during this session. "

        if common_problems:
            top_problem = common_problems[0][0].replace('_', ' ')
            summary += f"Focus on improving your {top_problem} for better results. "

        summary += "Keep practicing to see improvement!"
        return summary

    def _extract_key_insights(
        self,
        live_feedback_history: List[Dict[str, Any]],
        session_statistics: Dict[str, Any],
        common_problems: List[tuple]
    ) -> List[str]:
        """Extract key insights from the session."""
        insights = []

        # Performance insight
        avg_score = session_statistics.get('average_score', 0.0)
        if avg_score >= 0.8:
            insights.append(f"Strong overall performance with {avg_score:.1%} average accuracy")
        elif avg_score >= 0.6:
            insights.append(f"Moderate performance with room for improvement ({avg_score:.1%} accuracy)")
        else:
            insights.append(f"Developing skills - current accuracy at {avg_score:.1%}")

        # Problem pattern insight
        if common_problems:
            top_issue = common_problems[0][0].replace('_', ' ')
            count = common_problems[0][1]
            insights.append(f"Most frequent issue: {top_issue} (appeared {count} times)")

        # Trend insight
        if len(live_feedback_history) >= 4:
            early_scores = [f.get('similarity_score', 0) for f in live_feedback_history[:len(live_feedback_history)//2]]
            late_scores = [f.get('similarity_score', 0) for f in live_feedback_history[len(live_feedback_history)//2:]]

            if late_scores and early_scores:
                import numpy as np
                early_avg = np.mean(early_scores)
                late_avg = np.mean(late_scores)

                if late_avg > early_avg + 0.05:
                    insights.append("Performance improved as the session progressed")
                elif late_avg < early_avg - 0.05:
                    insights.append("Performance declined - possibly due to fatigue")

        return insights

    def _generate_improvement_areas(
        self,
        common_problems: List[tuple],
        live_feedback_history: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Generate improvement areas with specific recommendations."""
        improvement_areas = []

        for area, count in common_problems[:3]:  # Top 3 problem areas
            # Find sample feedback for this area
            relevant_feedback = [
                f for f in live_feedback_history
                if area in f.get('focus_areas', [])
            ]

            if relevant_feedback:
                sample = relevant_feedback[0].get('feedback_text', '')
            else:
                sample = f"Focus on your {area.replace('_', ' ')} positioning"

            improvement_areas.append({
                'body_part': area.replace('_', ' ').title(),
                'frequency': count,
                'recommendation': sample,
                'priority': 'high' if count >= 5 else 'medium' if count >= 3 else 'low'
            })

        return improvement_areas

    def _extract_strengths(
        self,
        session_statistics: Dict[str, Any],
        positive_feedback: List[Dict[str, Any]]
    ) -> List[str]:
        """Extract strengths from the session."""
        strengths = []

        # Check score distribution for strengths
        score_dist = session_statistics.get('score_distribution', {})
        excellent_count = score_dist.get('excellent', 0)
        good_count = score_dist.get('good', 0)

        if excellent_count > 0:
            strengths.append(f"Achieved excellent form {excellent_count} times")

        if good_count > excellent_count:
            strengths.append(f"Maintained good form consistently ({good_count} instances)")

        # Extract from positive feedback
        if positive_feedback:
            strengths.append(f"Received {len(positive_feedback)} positive feedback moments")

        # Best moment
        best_moment = session_statistics.get('best_moment')
        if best_moment and best_moment.get('score', 0) >= 0.9:
            strengths.append(f"Peak performance of {best_moment['score']:.1%} at {best_moment['timestamp']:.1f}s")

        return strengths if strengths else ["Completed the session and collected valuable feedback"]


# Factory function to get service instance
def get_feedback_service() -> FeedbackGenerationService:
    """
    Get or create the feedback generation service.

    Returns:
        FeedbackGenerationService instance
    """
    return FeedbackGenerationService()
