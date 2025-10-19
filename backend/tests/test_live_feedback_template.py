"""
Live Feedback Service - Test Template

This file provides a template for testing the LiveFeedbackService.
Follow the examples and TODO comments to write your own tests.

HOW TO RUN TESTS:
-----------------
1. Install pytest if you haven't:
   pip install pytest

2. Run all tests in this file:
   pytest tests/test_live_feedback_template.py -v

3. Run a specific test:
   pytest tests/test_live_feedback_template.py::TestLiveFeedbackService::test_service_initialization -v

4. Run with print statements visible:
   pytest tests/test_live_feedback_template.py -v -s

TESTING STRATEGY:
-----------------
When testing the LiveFeedbackService, you want to avoid:
- Actually calling the OpenAI API (costs money, slow, requires internet)
- Using real video frames (too large, unnecessary)

Instead, you should:
- Mock the OpenAI API calls (simulate responses)
- Use fake/minimal snapshot data
- Test the logic and data flow, not the LLM responses

MOCKING THE OPENAI API:
-----------------------
We use pytest's monkeypatch to replace the real OpenAI client with a fake one.
This lets us control what the "LLM" returns without making real API calls.

Example:
    def mock_openai_response(*args, **kwargs):
        # Create a fake response object
        class MockResponse:
            class MockChoice:
                class MockMessage:
                    content = "Great dancing!"  # The fake LLM response
                message = MockMessage()
            choices = [MockChoice()]
        return MockResponse()

    # Replace the real API call with our mock
    monkeypatch.setattr(service.client.chat.completions, "create", mock_openai_response)
"""

import pytest
from app.services.live_feedback_service import (
    LiveFeedbackService,
    SnapshotData,
    FeedbackContext
)


# =============================================================================
# SECTION 1: Testing Data Models (SnapshotData, FeedbackContext)
# =============================================================================

class TestSnapshotData:
    """
    Test the SnapshotData dataclass.

    This is a simple data container, so we just verify it stores data correctly.
    """

    def test_create_basic_snapshot(self):
        """
        TODO: Test creating a SnapshotData with minimal required fields.

        Instructions:
        1. Create a SnapshotData with only required fields (timestamp, frame_base64, scores)
        2. Use assert to verify the values were stored correctly

        Example:
            snapshot = SnapshotData(timestamp=1.0, frame_base64="test", ...)
            assert snapshot.timestamp == 1.0
        """
        # TODO: Write your test here
        pass

    def test_create_snapshot_with_errors(self):
        """
        TODO: Test creating a SnapshotData with error data.

        Instructions:
        1. Create a SnapshotData with errors list containing body_part, expected, actual
        2. Verify the errors list is stored correctly
        3. Verify you can access error fields like errors[0]["body_part"]
        """
        # TODO: Write your test here
        pass


class TestFeedbackContext:
    """
    Test the FeedbackContext class.

    This class manages the rolling window of recent snapshots and tracks trends.
    """

    def test_context_starts_empty(self):
        """
        TODO: Test that a new FeedbackContext initializes with empty state.

        Instructions:
        1. Create a new FeedbackContext()
        2. Assert that recent_snapshots is empty (length 0)
        3. Assert that recent_feedback is empty
        4. Assert that performance_trend is "stable" (default)
        5. Assert that persistent_issues is empty

        Hint: Use len() to check list/deque sizes
        """
        # TODO: Write your test here
        pass

    def test_add_single_snapshot(self):
        """
        TODO: Test adding one snapshot to the context.

        Instructions:
        1. Create a FeedbackContext
        2. Create a simple SnapshotData (use minimal fields)
        3. Call context.add_snapshot(snapshot)
        4. Assert that recent_snapshots now has length 1
        5. Assert that the stored snapshot has the correct timestamp
        """
        # TODO: Write your test here
        pass

    def test_context_window_limit(self):
        """
        TODO: Test that context only keeps the last N snapshots.

        Instructions:
        1. Look at FeedbackContext definition - what's the maxlen for recent_snapshots? (hint: 6)
        2. Create a context and add MORE than 6 snapshots (e.g., 10)
        3. Assert that context.recent_snapshots only has 6 items
        4. Assert that it kept the LAST 6 (check timestamps of oldest and newest)

        Hint: You can create snapshots in a loop:
            for i in range(10):
                snapshot = SnapshotData(timestamp=i*0.5, ...)
                context.add_snapshot(snapshot)
        """
        # TODO: Write your test here
        pass

    def test_trend_detection_improving(self):
        """
        TODO: Test that improving scores are detected as "improving" trend.

        Instructions:
        1. Create a context
        2. Add 6+ snapshots with gradually INCREASING combined_score
           Example: 0.5, 0.55, 0.6, 0.65, 0.7, 0.75
        3. After adding snapshots, check context.performance_trend
        4. Assert that it equals "improving"

        Hint: The trend detection looks at first half vs second half of scores
        """
        # TODO: Write your test here
        pass

    def test_trend_detection_degrading(self):
        """
        TODO: Test that degrading scores are detected as "degrading" trend.

        Instructions:
        1. Create a context
        2. Add 6+ snapshots with gradually DECREASING combined_score
           Example: 0.9, 0.85, 0.8, 0.75, 0.7, 0.65
        3. Assert that context.performance_trend == "degrading"
        """
        # TODO: Write your test here
        pass

    def test_persistent_issue_detection(self):
        """
        TODO: Test that repeated errors are detected as persistent issues.

        Instructions:
        1. Create a context
        2. Add 6+ snapshots, each with the SAME error (e.g., "left_elbow" in every snapshot)
        3. Check context.persistent_issues list
        4. Assert that "left_elbow" is in the persistent_issues list

        Hint: An error appears in snapshot.errors like:
            errors=[{"body_part": "left_elbow", "difference": 50}]

        The persistent_issues detection looks for body_parts that appear in
        50%+ of recent snapshots.
        """
        # TODO: Write your test here
        pass


# =============================================================================
# SECTION 2: Testing LiveFeedbackService
# =============================================================================

class TestLiveFeedbackService:
    """
    Test the main LiveFeedbackService class.

    This is where the core logic lives. We'll test:
    - Initialization
    - Processing snapshots
    - Generating feedback
    - Fallback behavior
    """

    @pytest.fixture
    def service(self, monkeypatch):
        """
        Pytest fixture that creates a LiveFeedbackService for testing.

        A fixture is a reusable setup function. Any test method that includes
        'service' as a parameter will automatically get a LiveFeedbackService instance.

        The monkeypatch parameter lets us mock environment variables and functions.
        We use it here to set a fake OPENAI_API_KEY so the service initializes.

        Usage in your tests:
            def test_something(self, service):  # <- 'service' is auto-injected
                result = service.process_snapshot(...)
        """
        # Set a fake API key (required for service to initialize)
        monkeypatch.setenv("OPENAI_API_KEY", "test-fake-key-12345")

        # Create and return the service
        return LiveFeedbackService()

    @pytest.fixture
    def good_snapshot(self):
        """
        Fixture that provides a "good performance" snapshot.

        High scores (>0.8), no errors.
        This should NOT trigger feedback generation.

        Usage:
            def test_something(self, good_snapshot):
                feedback = service.process_snapshot(good_snapshot)
                assert feedback is None  # No feedback for good performance
        """
        return SnapshotData(
            timestamp=1.0,
            frame_base64="fake_image_data_here",
            pose_similarity=0.85,
            motion_similarity=0.82,
            combined_score=0.84,
            errors=[],  # No errors
            best_match_idx=10,
            reference_timestamp=1.0,
            timing_offset=0.0
        )

    @pytest.fixture
    def poor_snapshot(self):
        """
        Fixture that provides a "poor performance" snapshot.

        Low scores (<0.6), multiple errors.
        This SHOULD trigger feedback generation.

        Usage:
            def test_something(self, poor_snapshot):
                feedback = service.process_snapshot(poor_snapshot)
                assert feedback is not None  # Should generate feedback
        """
        return SnapshotData(
            timestamp=2.0,
            frame_base64="fake_image_data_here",
            pose_similarity=0.55,
            motion_similarity=0.50,
            combined_score=0.53,
            errors=[
                {
                    "body_part": "left_elbow",
                    "expected_angle": 145,
                    "actual_angle": 95,
                    "difference": 50
                },
                {
                    "body_part": "right_knee",
                    "expected_angle": 110,
                    "actual_angle": 160,
                    "difference": 50
                }
            ],
            best_match_idx=20,
            reference_timestamp=2.0,
            timing_offset=-0.2  # User is 0.2s behind
        )

    # -------------------------------------------------------------------------
    # Basic Functionality Tests
    # -------------------------------------------------------------------------

    def test_service_initialization(self, service):
        """
        TODO: Test that the service initializes with correct default values.

        Instructions:
        1. Check that service.model is set correctly (what model is used? check live_feedback_service.py)
        2. Check that service.min_score_for_feedback has a reasonable default
        3. Check that statistics start at 0 (total_snapshots_processed, total_feedback_generated)
        4. Check that context exists and is a FeedbackContext instance
        """
        # TODO: Write your test here
        # Hint: assert service.model == "gpt-4o-mini"
        pass

    def test_good_performance_no_feedback(self, service, good_snapshot):
        """
        TODO: Test that good performance (high score, no errors) doesn't generate feedback.

        Instructions:
        1. Call service.process_snapshot(good_snapshot)
        2. Assert that the returned feedback is None (no feedback needed)
        3. Assert that total_snapshots_processed increased by 1
        4. Assert that total_feedback_generated is still 0 (no feedback was generated)

        This tests the "should_generate" logic in the service.
        """
        # TODO: Write your test here
        pass

    def test_poor_performance_triggers_feedback(self, service, poor_snapshot, monkeypatch):
        """
        TODO: Test that poor performance triggers feedback generation.

        Instructions:
        1. Mock the OpenAI API call so we don't make a real API request
        2. Call service.process_snapshot(poor_snapshot)
        3. Assert that feedback is NOT None
        4. Assert that feedback has expected fields: timestamp, feedback_text, severity, focus_areas
        5. Assert that total_feedback_generated increased

        IMPORTANT: You MUST mock the OpenAI API, otherwise this test will:
        - Fail if you don't have a real API key
        - Cost you money if you do
        - Be slow (API calls take 1-2 seconds)

        Example of mocking (copy this pattern):

            def mock_openai_response(*args, **kwargs):
                class MockResponse:
                    class MockChoice:
                        class MockMessage:
                            content = "Try extending your left arm more!"
                        message = MockMessage()
                    choices = [MockChoice()]
                return MockResponse()

            monkeypatch.setattr(service.client.chat.completions, "create", mock_openai_response)
        """
        # TODO: Write your test here
        pass

    # -------------------------------------------------------------------------
    # Error Handling Tests
    # -------------------------------------------------------------------------

    def test_fallback_when_llm_fails(self, service, poor_snapshot, monkeypatch):
        """
        TODO: Test that fallback feedback is generated when the LLM API fails.

        Instructions:
        1. Mock the OpenAI API to raise an Exception (simulate API failure)
        2. Call service.process_snapshot(poor_snapshot)
        3. Assert that feedback is still returned (fallback worked)
        4. Assert that total_llm_errors increased by 1

        This tests the error handling and ensures the service is resilient.

        Example mock that raises an error:

            def mock_openai_error(*args, **kwargs):
                raise Exception("API connection failed!")

            monkeypatch.setattr(service.client.chat.completions, "create", mock_openai_error)
        """
        # TODO: Write your test here
        pass

    # -------------------------------------------------------------------------
    # Severity Calculation Tests
    # -------------------------------------------------------------------------

    def test_severity_high(self, service):
        """
        TODO: Test that very low scores result in "high" severity.

        Instructions:
        1. Look at the _calculate_severity method in live_feedback_service.py
        2. Find what score threshold triggers "high" severity (hint: score < 0.5)
        3. Create a snapshot with combined_score below that threshold
        4. Call service._calculate_severity(snapshot)
        5. Assert the result equals "high"
        """
        # TODO: Write your test here
        pass

    def test_severity_medium(self, service):
        """
        TODO: Test medium severity calculation.

        Instructions:
        1. Find the score range for "medium" severity (hint: 0.5 <= score < 0.7)
        2. Create a snapshot with a score in that range
        3. Assert that _calculate_severity returns "medium"
        """
        # TODO: Write your test here
        pass

    def test_severity_low(self, service):
        """
        TODO: Test low severity calculation.

        Instructions:
        1. Find the threshold for "low" severity (hint: score >= 0.7)
        2. Create a snapshot with score above that threshold
        3. Assert that _calculate_severity returns "low"
        """
        # TODO: Write your test here
        pass

    # -------------------------------------------------------------------------
    # Advanced Feature Tests
    # -------------------------------------------------------------------------

    def test_force_feedback_parameter(self, service, good_snapshot, monkeypatch):
        """
        TODO: Test that force_feedback=True generates feedback even for good performance.

        Instructions:
        1. Mock the OpenAI API
        2. Call service.process_snapshot(good_snapshot, force_feedback=True)
        3. Assert that feedback is NOT None (even though performance is good)
        4. Verify that total_feedback_generated increased

        This tests the force_feedback parameter which bypasses the "should_generate" check.
        Useful for debugging or getting feedback on-demand.
        """
        # TODO: Write your test here
        pass

    def test_reset_clears_context(self, service, poor_snapshot):
        """
        TODO: Test that calling reset() clears the context but preserves statistics.

        Instructions:
        1. Add some snapshots to the service's context
        2. Verify context has snapshots (len > 0)
        3. Call service.reset()
        4. Verify context is now empty (recent_snapshots length == 0)
        5. Verify that total_snapshots_processed is NOT reset (statistics preserved)

        The reset() method is called when starting a new dance section.
        It should clear the rolling context window but keep overall session stats.
        """
        # TODO: Write your test here
        pass

    def test_get_statistics(self, service, poor_snapshot, monkeypatch):
        """
        TODO: Test the get_statistics() method.

        Instructions:
        1. Mock the OpenAI API
        2. Process a few snapshots
        3. Call service.get_statistics()
        4. Assert the returned dict has expected keys:
           - total_snapshots_processed
           - total_feedback_generated
           - total_llm_calls
           - feedback_generation_rate
           - current_context
        5. Verify the values make sense (e.g., snapshots > 0)
        """
        # TODO: Write your test here
        pass


# =============================================================================
# SECTION 3: Prompt Building Tests (Advanced)
# =============================================================================

class TestPromptBuilding:
    """
    Test the prompt building logic.

    These tests verify that the prompts sent to the LLM contain the right information.
    We're testing the _build_live_prompt method which is internal but important.
    """

    @pytest.fixture
    def service(self, monkeypatch):
        """Fixture to create service for prompt testing."""
        monkeypatch.setenv("OPENAI_API_KEY", "test-key")
        return LiveFeedbackService()

    def test_prompt_contains_score(self, service):
        """
        TODO: Test that the prompt includes the performance score.

        Instructions:
        1. Create a snapshot with a specific combined_score (e.g., 0.73)
        2. Call service._build_live_prompt(snapshot)
        3. Assert that the returned prompt string contains the score
           (could be "73%" or "0.73" - check the actual implementation)

        Hint: Use 'in' operator to check if substring exists in string
            assert "73%" in prompt
        """
        # TODO: Write your test here
        pass

    def test_prompt_contains_errors(self, service):
        """
        TODO: Test that detected errors are included in the prompt.

        Instructions:
        1. Create a snapshot with specific errors (e.g., left_elbow issue)
        2. Build the prompt
        3. Assert that "left_elbow" appears in the prompt
        4. Assert that error details (like difference) appear in prompt
        """
        # TODO: Write your test here
        pass

    def test_prompt_includes_timing_when_off(self, service):
        """
        TODO: Test that timing offset is mentioned in prompt when user is off-beat.

        Instructions:
        1. Create a snapshot with timing_offset > 0.2 (user ahead) or < -0.2 (behind)
        2. Build the prompt
        3. Assert that "ahead" or "behind" appears in the prompt

        Note: Check live_feedback_service.py to see when timing is included
        (hint: only when abs(timing_offset) > 0.2)
        """
        # TODO: Write your test here
        pass


# =============================================================================
# RUNNING TESTS
# =============================================================================

if __name__ == "__main__":
    """
    This allows you to run the tests directly:
        python tests/test_live_feedback_template.py

    But it's better to use pytest command:
        pytest tests/test_live_feedback_template.py -v
    """
    print("=" * 70)
    print("Live Feedback Service - Test Template")
    print("=" * 70)
    print()
    print("To run these tests, use pytest:")
    print("  pytest tests/test_live_feedback_template.py -v")
    print()
    print("To run a specific test:")
    print("  pytest tests/test_live_feedback_template.py::TestLiveFeedbackService::test_service_initialization -v")
    print()
    print("To see print statements during tests:")
    print("  pytest tests/test_live_feedback_template.py -v -s")
    print()
    print("=" * 70)

    # Run pytest
    pytest.main([__file__, "-v"])


"""
ADDITIONAL TESTING TIPS:
========================

1. ARRANGE-ACT-ASSERT Pattern
   Each test should follow this structure:

   def test_something(self):
       # ARRANGE: Set up test data
       snapshot = SnapshotData(...)

       # ACT: Perform the action you're testing
       result = service.process_snapshot(snapshot)

       # ASSERT: Verify the result
       assert result is not None

2. Test One Thing at a Time
   Each test should verify ONE specific behavior.
   Don't try to test everything in one test.

3. Use Descriptive Names
   Test names should describe what they're testing:
   ✅ test_poor_performance_triggers_feedback
   ❌ test_feedback

4. Mock External Dependencies
   Always mock:
   - OpenAI API calls
   - File I/O
   - Network requests
   - Time-dependent code

   This makes tests:
   - Fast (no waiting for API)
   - Reliable (no network issues)
   - Free (no API costs)

5. Test Edge Cases
   Think about:
   - Empty data
   - Very high/low scores
   - Missing fields
   - Extreme timing offsets

6. Use Fixtures for Common Setup
   If multiple tests need the same data, create a fixture.
   Fixtures are reusable and keep tests DRY (Don't Repeat Yourself).

7. Check Both Happy and Sad Paths
   - Happy path: Everything works as expected
   - Sad path: Errors, failures, invalid input

EXAMPLE COMPLETED TEST:
=======================

def test_example_complete(self, service, poor_snapshot, monkeypatch):
    # ARRANGE: Mock the OpenAI API
    def mock_llm(*args, **kwargs):
        class MockResponse:
            class MockChoice:
                class MockMessage:
                    content = "Fix your left elbow!"
                message = MockMessage()
            choices = [MockChoice()]
        return MockResponse()

    monkeypatch.setattr(service.client.chat.completions, "create", mock_llm)

    # ACT: Process the snapshot
    feedback = service.process_snapshot(poor_snapshot)

    # ASSERT: Verify feedback was generated
    assert feedback is not None
    assert feedback["timestamp"] == 2.0
    assert "Fix your left elbow!" in feedback["feedback_text"]
    assert feedback["severity"] in ["high", "medium", "low"]
    assert "left_elbow" in feedback["focus_areas"]

DEBUGGING FAILED TESTS:
=======================

If a test fails, pytest will show you:
1. Which assertion failed
2. The expected vs actual values
3. A traceback showing where the failure occurred

To get more info:
- Use print() statements (run with pytest -s to see them)
- Use pytest --pdb to drop into debugger on failure
- Add -vv for extra verbose output

Good luck testing! 🧪
"""
