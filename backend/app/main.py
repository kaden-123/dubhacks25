"""
FastAPI main application entry point.
Unified API for K-Pop Dance Trainer with real-time pose detection and feedback.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import base64
import time
import os
import numpy as np
import cv2
from PIL import Image
from io import BytesIO

# Import configuration
from app.data.config import settings

# Import services
from app.services.pose_comparison_service import PoseComparisonService
from app.services.pose_comparison_config import PoseComparisonConfig, DEFAULT_CONFIG, DANCE_CONFIG
from app.services.feedback_summary_service import FeedbackSummaryService, FeedbackSummary
from app.services.angle_calculator import AngleCalculator
from app.services.scoring import ScoringService
from app.services.feedback_generation import FeedbackGenerationService

# Import MediaPipe for pose detection
import mediapipe as mp

# Create FastAPI app instance
app = FastAPI(
    title="K-Pop Dance Trainer API",
    description="Real-time pose detection and dance feedback API",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3003", "http://localhost:3004"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ============================================================================
# PYDANTIC MODELS FOR REQUEST/RESPONSE
# ============================================================================

class ImageSnapshotRequest(BaseModel):
    """Request model for processing image snapshots."""
    image: str  # base64 encoded image
    video_timestamp: Optional[float] = None


class ProcessSnapshotResponse(BaseModel):
    """Response model for processed snapshots."""
    timestamp: float
    pose_landmarks: Optional[List[List[float]]] = None
    hand_landmarks: List[List[List[float]]] = []
    hand_classifications: List[Dict[str, Any]] = []
    preprocessed_angles: Dict[str, float] = {}
    comparison_result: Optional[Dict[str, Any]] = None
    live_feedback: Optional[str] = None
    success: bool
    error: Optional[str] = None


class StartSessionResponse(BaseModel):
    """Response model for session start."""
    session_id: str
    message: str


class SessionStatusResponse(BaseModel):
    """Response model for session status."""
    session_id: Optional[str]
    start_time: Optional[float]
    pose_count: int
    reference_video: Optional[str]
    session_duration: float


class SessionFeedbackResponse(BaseModel):
    """Response model for session end feedback with AI-generated summary."""
    session_id: str
    total_poses: int
    average_similarity: float
    session_summary: str  # AI-generated overall summary
    detailed_feedback: List[Dict[str, Any]] = []  # Individual feedback items from session

    # AI-generated insights (optional - only if summary was generated)
    key_insights: Optional[List[str]] = None
    improvement_areas: Optional[List[Dict[str, Any]]] = None
    strengths: Optional[List[str]] = None
    severity_distribution: Optional[Dict[str, int]] = None


class LoadReferenceRequest(BaseModel):
    """Request model for loading reference video."""
    video_name: str


class UpdateConfigRequest(BaseModel):
    """Request model for updating pose comparison config."""
    pose_weight: Optional[float] = None
    motion_weight: Optional[float] = None
    dtw_enabled: Optional[bool] = None
    preset: Optional[str] = None  # "default", "dance", "position_focused", "motion_focused"


# ============================================================================
# GLOBAL STATE MANAGEMENT
# ============================================================================

# Initialize MediaPipe
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Initialize pose and hand detection
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=settings.mediapipe_model_complexity,
    enable_segmentation=False,
    min_detection_confidence=settings.mediapipe_min_detection_confidence,
    min_tracking_confidence=settings.mediapipe_min_tracking_confidence
)

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Global services (INTERNAL - Never exposed to API)
comparison_service: Optional[PoseComparisonService] = None
feedback_summary_service = FeedbackSummaryService()  # Summary feedback service
scoring_service = ScoringService()
feedback_generation_service = FeedbackGenerationService()  # Internal LLM service
angle_calculator = AngleCalculator()
current_config = DEFAULT_CONFIG

# Session management
current_session = {
    'session_id': None,
    'start_time': None,
    'pose_data': [],
    'feedback_history': [],
    'reference_video': None
}

# Pose sequence storage
pose_sequence = []
MAX_SEQUENCE_LENGTH = 100  # Keep last 100 poses


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def load_reference_video(video_name: str) -> bool:
    """
    Load reference video for pose comparison.

    Args:
        video_name: Name of the reference video (without extension)

    Returns:
        bool: True if loaded successfully, False otherwise
    """
    global comparison_service
    try:
        # Map song names to video file names
        video_mapping = {
            "kaden": "test",
            "kaden test": "test",
            "magnetic": "magnetic",
            "go!": "magnetic"  # Default GO! to magnetic for now
        }
        
        # Get the actual video file name
        actual_video_name = video_mapping.get(video_name, video_name)
        print(f"DEBUG: Mapping '{video_name}' to '{actual_video_name}'")
        
        # Get the correct path relative to app directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        data_path = os.path.join(current_dir, "data", "processed_poses", f"{actual_video_name}_poses.npy")
        print(f"DEBUG: Looking for reference video at: {data_path}")

        if not os.path.exists(data_path):
            print(f"Reference video file not found: {data_path}")
            return False

        # Load the numpy array
        print(f"DEBUG: Loading numpy data from {data_path}")
        reference_data = np.load(data_path, allow_pickle=True)
        print(f"DEBUG: Loaded data shape: {reference_data.shape}")

        # Convert to format expected by PoseComparisonService
        reference_poses_list = []
        for i, frame_data in enumerate(reference_data):
            if frame_data.get('has_pose', False):
                pose_dict = {
                    'landmarks': frame_data['landmarks'],
                    'timestamp': frame_data['timestamp'],
                    'frame_number': frame_data['frame_number']
                }
                reference_poses_list.append(pose_dict)
        
        print(f"DEBUG: Converted {len(reference_poses_list)} poses from {len(reference_data)} frames")

        # Initialize comparison service with reference poses
        print(f"DEBUG: Initializing PoseComparisonService...")
        try:
            global comparison_service
            comparison_service = PoseComparisonService(reference_poses_list, current_config)
            current_session['reference_video'] = video_name
            
            # Store video duration (this should ideally come from video metadata)
            video_durations = {
                "magnetic": 159.869002,  # 2:39
                "test": 60.0,            # 1:00 for test video
                "go!": 159.869002        # Same as magnetic for now
            }
            current_session['video_duration'] = video_durations.get(actual_video_name, 159.869002)
            
            print(f"✅ Loaded {len(reference_poses_list)} reference poses from {video_name}")
            print(f"✅ Comparison service initialized: {comparison_service is not None}")
            print(f"✅ Video duration: {current_session['video_duration']}s")
            return True
        except Exception as e:
            print(f"ERROR: Failed to initialize PoseComparisonService: {e}")
            import traceback
            traceback.print_exc()
            # Try with minimal config
            try:
                print(f"DEBUG: Trying with minimal config...")
                minimal_config = PoseComparisonConfig()
                comparison_service = PoseComparisonService(reference_poses_list, minimal_config)
                current_session['reference_video'] = video_name
                
                # Store video duration
                video_durations = {
                    "magnetic": 159.869002,
                    "test": 60.0,
                    "go!": 159.869002
                }
                current_session['video_duration'] = video_durations.get(actual_video_name, 159.869002)
                
                print(f"✅ Comparison service initialized with minimal config")
                return True
            except Exception as e2:
                print(f"ERROR: Failed with minimal config too: {e2}")
                # Return True anyway to allow the session to continue
                current_session['reference_video'] = video_name
                
                # Store video duration
                video_durations = {
                    "magnetic": 159.869002,
                    "test": 60.0,
                    "go!": 159.869002
                }
                current_session['video_duration'] = video_durations.get(actual_video_name, 159.869002)
                
                print(f"✅ Loaded {len(reference_poses_list)} reference poses from {video_name} (without comparison service)")
                return True

    except Exception as e:
        print(f"❌ Error loading reference video: {e}")
        print(f"❌ Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return False


def generate_feedback_summary() -> Optional[Dict[str, Any]]:
    """
    Generate comprehensive feedback summary from collected pose data.
    
    Returns:
        Feedback summary dictionary with timeframes and clickable feedback items:
        {
            'session_duration': float,
            'overall_score': float,
            'total_feedback_items': int,
            'timeframes': List[Dict],  # Timeframe feedback with clickable timestamps
            'most_common_issues': List[Tuple[str, int]],
            'improvement_suggestions': List[str]
        }
    """
    try:
        if not current_session.get('pose_data'):
            return None
            
        # Generate summary using the collected pose data
        summary = feedback_summary_service.generate_summary(
            pose_data=current_session['pose_data'],
            reference_service=comparison_service
        )
        
        # Convert to API-friendly format
        return {
            'session_duration': summary.session_duration,
            'overall_score': summary.overall_session_score,
            'total_feedback_items': summary.total_feedback_items,
            'timeframes': [
                {
                    'start_time': tf.start_time,
                    'end_time': tf.end_time,
                    'duration': tf.timeframe_duration,
                    'overall_score': tf.overall_score,
                    'dominant_issues': tf.dominant_issues,
                    'feedback_items': [
                        {
                            'timestamp': item.timestamp,
                            'severity': item.severity,
                            'category': item.category,
                            'body_part': item.body_part,
                            'feedback_text': item.feedback_text,
                            'expected_value': item.expected_value,
                            'actual_value': item.actual_value,
                            'difference': item.difference
                        }
                        for item in tf.feedback_items
                    ]
                }
                for tf in summary.timeframes
            ],
            'most_common_issues': summary.most_common_issues,
            'improvement_suggestions': summary.improvement_suggestions
        }
        
    except Exception as e:
        print(f"Feedback summary generation failed: {e}")
        return None


def process_image_snapshot(image_data: str, video_timestamp: float = None) -> Dict[str, Any]:
    """
    Process a single image snapshot for pose detection and comparison.

    Args:
        image_data: Base64 encoded image

    Returns:
        dict: Processing results including landmarks, comparison, and feedback
    """
    try:
        print(f"🔍 DEBUG: Processing image data, length: {len(image_data)}")
        print(f"🔍 DEBUG: Image data starts with: {image_data[:50]}...")
        
        # Strip data URL prefix if present (e.g., "data:image/jpeg;base64,")
        if ',' in image_data:
            image_data = image_data.split(',', 1)[1]
            print(f"🔍 DEBUG: Stripped prefix, new length: {len(image_data)}")
        
        # Convert base64 to image
        try:
            image_bytes = base64.b64decode(image_data)
            print(f"🔍 DEBUG: Decoded image bytes, length: {len(image_bytes)}")
            
            image = Image.open(BytesIO(image_bytes))
            print(f"🔍 DEBUG: Image opened successfully, size: {image.size}")
        except Exception as decode_error:
            print(f"❌ ERROR: Failed to decode/decode image: {decode_error}")
            return {
                'timestamp': time.time(),
                'pose_landmarks': None,
                'hand_landmarks': [],
                'hand_classifications': [],
                'preprocessed_angles': {},
                'comparison_result': None,
                'live_feedback': None,
                'success': False,
                'error': f'Image processing failed: {str(decode_error)}'
            }
        
        # Check if image is too small (likely corrupted)
        if image.size[0] < 10 or image.size[1] < 10:
            print(f"❌ ERROR: Image too small: {image.size}, likely corrupted")
            # Return a minimal result with 0 scores but still valid structure
            return {
                'timestamp': time.time(),
                'pose_landmarks': None,
                'hand_landmarks': [],
                'hand_classifications': [],
                'preprocessed_angles': {},
                'comparison_result': {
                    'combined_score': 0.0,
                    'pose_score': 0.0,
                    'motion_score': 0.0,
                    'dtw_score': 0.0,
                    'best_match_index': 0,
                    'timestamp': video_timestamp if video_timestamp is not None else time.time()
                },
                'live_feedback': "Camera image too small - please check your camera positioning",
                'success': True,
                'error': None
            }
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Convert BGR to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process pose
        pose_results = pose.process(rgb_frame)

        # Process hands
        hand_results = hands.process(rgb_frame)

        # Extract landmarks
        pose_landmarks = None
        hand_landmarks = []
        hand_classifications = []
        preprocessed_angles = {}

        # Process pose landmarks with robust handling
        if pose_results.pose_landmarks:
            try:
                # Convert pose landmarks to numpy array
                pose_landmarks = np.array([
                    [lm.x, lm.y, lm.z, lm.visibility]
                    for lm in pose_results.pose_landmarks.landmark
                ])
                print(f"🔍 DEBUG: Pose landmarks extracted, shape: {pose_landmarks.shape}")
            except Exception as e:
                print(f"❌ Error extracting pose landmarks: {e}")
                pose_landmarks = None

        # Process hand landmarks with robust handling
        if hand_results.multi_hand_landmarks:
            try:
                for idx, hand_landmark in enumerate(hand_results.multi_hand_landmarks):
                    # Convert hand landmarks to numpy array
                    hand_array = np.array([[lm.x, lm.y, lm.z] for lm in hand_landmark.landmark])
                    hand_landmarks.append(hand_array)

                    # Get hand classification
                    if hand_results.multi_handedness and idx < len(hand_results.multi_handedness):
                        handedness = hand_results.multi_handedness[idx]
                        hand_classifications.append({
                            'label': handedness.classification[0].label,
                            'confidence': handedness.classification[0].score
                        })
                print(f"🔍 DEBUG: Hand landmarks extracted, count: {len(hand_landmarks)}")
            except Exception as e:
                print(f"❌ Error extracting hand landmarks: {e}")
                hand_landmarks = []
                hand_classifications = []

        # Calculate preprocessed angles if we have pose landmarks
        if pose_landmarks is not None:
            try:
                # Flatten pose landmarks for angle calculation (x, y, z coordinates only)
                pose_flat = pose_landmarks[:, :3].flatten()

                # Calculate angles
                if hand_landmarks:
                    hand_flat = hand_landmarks[0].flatten()
                    preprocessed_angles = angle_calculator.calculate_all_angles(pose_flat, hand_flat)
                else:
                    preprocessed_angles = angle_calculator.calculate_all_angles(pose_flat)
                print(f"🔍 DEBUG: Angles calculated, count: {len(preprocessed_angles)}")
            except Exception as e:
                print(f"❌ Error calculating angles: {e}")
                preprocessed_angles = {}

        # Perform real-time comparison if service is available
        comparison_result = None
        live_feedback = None

        print(f"DEBUG: Comparison check - pose_landmarks: {pose_landmarks is not None}, comparison_service: {comparison_service is not None}")
        print(f"DEBUG: Current session reference_video: {current_session.get('reference_video', 'None')}")
        
        # Perform comparison even with partial landmarks
        if comparison_service is not None:
            try:
                # Use video timestamp if available, otherwise use current time
                current_timestamp = video_timestamp if video_timestamp is not None else time.time()
                print(f"🎯 DEBUG: Using timestamp: {current_timestamp} (video: {video_timestamp})")
                
                # Compare with reference (handle partial landmarks gracefully)
                if pose_landmarks is not None:
                    print(f"🎯 DEBUG: Comparing with pose landmarks shape: {pose_landmarks.shape}")
                    comparison_result = comparison_service.update_user_pose(pose_landmarks, current_timestamp)
                else:
                    print(f"🎯 DEBUG: No pose landmarks detected, creating minimal result")
                    # Create a minimal result when no pose landmarks are detected
                    comparison_result = {
                        'combined_score': 0.0,
                        'pose_score': 0.0,
                        'motion_score': 0.0,
                        'dtw_score': 0.0,
                        'best_match_index': 0,
                        'timestamp': current_timestamp
                    }
            except Exception as e:
                print(f"Error in pose comparison: {e}")
                current_timestamp = video_timestamp if video_timestamp is not None else time.time()
                comparison_result = {
                    'combined_score': 0.0,
                    'pose_score': 0.0,
                    'motion_score': 0.0,
                    'dtw_score': 0.0,
                    'best_match_index': 0,
                    'timestamp': current_timestamp
                }
                live_feedback = "Comparison unavailable"
        else:
            # Fallback when comparison service is not available
            print(f"🎯 DEBUG: No comparison service available, creating fallback result")
            current_timestamp = video_timestamp if video_timestamp is not None else time.time()
            comparison_result = {
                'combined_score': 0.0,  # Always 0 when no comparison service
                'pose_score': 0.0,
                'motion_score': 0.0,
                'dtw_score': 0.0,
                'best_match_index': 0,
                'timestamp': current_timestamp
            }
        
        print(f"🎯 DEBUG: Comparison result: {comparison_result}")

        # Generate detailed feedback using LiveFeedbackService (internal LLM call)
        # Returns processed feedback dict (NO OpenAI metadata)
        # No live feedback generation - feedback will be generated on pause/video end
        feedback_data = None

        # Store in session data ONLY if pose landmarks were detected
        # This ensures failed pose detection doesn't contribute to accuracy calculation
        if pose_landmarks is not None:
            current_session['pose_data'].append({
                'timestamp': time.time(),
                'pose_landmarks': pose_landmarks,
                'comparison_result': comparison_result
            })
            print(f"✅ Stored pose data with score: {comparison_result.get('combined_score', 0.0):.3f}")
        else:
            print(f"❌ Skipping pose data storage - no landmarks detected")

        # Store complete feedback record for session summary (if feedback was generated)
        # This data structure is used by FeedbackGenerationService.generate_session_summary()
        if feedback_data:
            session_timestamp = time.time() - current_session['start_time'] if current_session['start_time'] else 0

            current_session['feedback_history'].append({
                # Required fields for session summary
                'timestamp': session_timestamp,  # Seconds from session start
                'feedback_text': feedback_data.get('feedback_text', ''),
                'severity': feedback_data.get('severity', 'medium'),
                'focus_areas': feedback_data.get('focus_areas', []),
                'similarity_score': comparison_result.get('combined_score', 0.0),
                'is_positive': feedback_data.get('is_positive', False),

                # Additional context for analysis
                'context': feedback_data.get('context', {})
            })

        # Extract feedback text for immediate response
        live_feedback = feedback_data.get('feedback_text', None) if feedback_data else None

        # Add to scoring service
        scoring_service.add_score(
            timestamp=time.time() - current_session['start_time'] if current_session['start_time'] else 0,
            combined_score=comparison_result.get('combined_score', 0.0),
            pose_score=comparison_result.get('pose_score', 0.0),
            motion_score=comparison_result.get('motion_score', 0.0),
            errors=[]
        )

        # Create result with proper serialization
        result = {
            'timestamp': float(time.time()),
            'pose_landmarks': pose_landmarks.tolist() if pose_landmarks is not None else None,
            'hand_landmarks': [hand.tolist() for hand in hand_landmarks],
            'hand_classifications': hand_classifications,
            'preprocessed_angles': {k: float(v) for k, v in preprocessed_angles.items()},
            'comparison_result': comparison_result,
            'live_feedback': live_feedback,
            'success': True
        }
        
        # Ensure comparison_result is properly serialized
        if comparison_result is not None:
            result['comparison_result'] = {
                'combined_score': float(comparison_result.get('combined_score', 0.0)),
                'pose_score': float(comparison_result.get('pose_score', 0.0)),
                'motion_score': float(comparison_result.get('motion_score', 0.0)),
                'dtw_score': float(comparison_result.get('dtw_score', 0.0)),
                'best_match_index': int(comparison_result.get('best_match_index', 0)),
                'timestamp': float(comparison_result.get('timestamp', time.time()))
            }

        # Add to sequence for comparison
        if pose_landmarks is not None:
            pose_sequence.append(pose_landmarks)
            if len(pose_sequence) > MAX_SEQUENCE_LENGTH:
                pose_sequence.pop(0)

        return result

    except Exception as e:
        return {
            'timestamp': time.time(),
            'pose_landmarks': None,
            'hand_landmarks': [],
            'hand_classifications': [],
            'preprocessed_angles': {},
            'comparison_result': None,
            'live_feedback': None,
            'success': False,
            'error': str(e)
        }


# ============================================================================
# API ENDPOINTS - HEALTH & ROOT
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint - API information."""
    return {
        "message": "K-Pop Dance Trainer API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "sessions": "/api/sessions",
            "reference": "/api/reference",
            "config": "/api/config"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint with system status."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": time.time(),
        "reference_loaded": comparison_service is not None,
        "active_session": current_session['session_id'] is not None,
        "services": {
            "pose_comparison": comparison_service is not None,
            "live_feedback": True,
            "scoring": True
        }
    }


# ============================================================================
# API ENDPOINTS - SESSION MANAGEMENT
# ============================================================================

@app.post("/api/sessions/start", response_model=StartSessionResponse)
async def start_session():
    """
    Start a new dance session.

    Returns:
        StartSessionResponse: Session ID and confirmation message
    """
    global current_session

    session_id = f"session_{int(time.time())}"
    current_session = {
        'session_id': session_id,
        'start_time': time.time(),
        'pose_data': [],
        'feedback_history': [],
        'reference_video': current_session.get('reference_video')
    }

    # Reset services for new session
    feedback_summary_service = FeedbackSummaryService()  # Fresh instance for new session
    scoring_service.reset()

    return StartSessionResponse(
        session_id=session_id,
        message="Session started successfully"
    )


@app.post("/api/sessions/end", response_model=SessionFeedbackResponse)
async def end_session():
    """
    End the current session and get comprehensive AI-generated summary.

    SERVER-SIDE EVENT TRIGGER:
    When this endpoint is called, it automatically triggers the internal
    FeedbackGenerationService to analyze all live feedback from the session
    and generate a comprehensive summary. This is the ONLY way the session
    summary LLM is invoked - no separate API call needed.

    SECURITY NOTE: Calls internal LLM service (OpenAI) automatically but
    returns ONLY processed feedback text. No OpenAI metadata is exposed.

    Returns:
        SessionFeedbackResponse: Complete session summary with AI-generated insights
    """
    global current_session

    if not current_session['session_id']:
        raise HTTPException(status_code=400, detail="No active session to end")

    # Calculate basic session metrics
    total_poses = len(current_session['pose_data'])

    if total_poses > 0:
        similarity_scores = [
            data['comparison_result'].get('combined_score', 0.0)
            for data in current_session['pose_data']
            if data['comparison_result']
        ]
        average_similarity = np.mean(similarity_scores) if similarity_scores else 0.0
    else:
        average_similarity = 0.0

    # Get session statistics from scoring service
    session_stats = scoring_service.get_session_statistics()

    # SERVER-SIDE EVENT: Automatically generate comprehensive AI summary
    # This is triggered internally when session ends (not a separate API call)
    # FeedbackGenerationService calls OpenAI internally but returns ONLY processed text
    ai_summary = feedback_generation_service.generate_session_summary(
        live_feedback_history=current_session['feedback_history'],
        session_statistics=session_stats
    )

    # Build comprehensive response with AI insights
    # All AI-generated content (overall_summary, key_insights, etc.) comes from
    # the internal FeedbackGenerationService - NO OpenAI metadata is included
    response = SessionFeedbackResponse(
        session_id=current_session['session_id'],
        total_poses=total_poses,
        average_similarity=float(average_similarity),
        session_summary=ai_summary.get('overall_summary', 'Session completed!'),
        detailed_feedback=current_session['feedback_history'],

        # AI-generated insights (processed text only, no OpenAI metadata)
        key_insights=ai_summary.get('key_insights', []),
        improvement_areas=ai_summary.get('improvement_areas', []),
        strengths=ai_summary.get('strengths', []),
        severity_distribution=ai_summary.get('severity_distribution', {})
    )

    # Keep reference video loaded but reset session
    reference_video = current_session.get('reference_video')
    current_session = {
        'session_id': None,
        'start_time': None,
        'pose_data': [],
        'feedback_history': [],
        'reference_video': reference_video
    }

    return response


@app.get("/api/sessions/status", response_model=SessionStatusResponse)
async def get_session_status():
    """
    Get current session status.

    Returns:
        SessionStatusResponse: Current session information
    """
    return SessionStatusResponse(
        session_id=current_session['session_id'],
        start_time=current_session['start_time'],
        pose_count=len(current_session['pose_data']),
        reference_video=current_session['reference_video'],
        session_duration=time.time() - current_session['start_time'] if current_session['start_time'] else 0
    )


@app.get("/api/sessions/feedback-summary")
async def get_feedback_summary():
    """
    Get comprehensive feedback summary with clickable timeframes.
    
    This endpoint is called when user pauses or video ends to get detailed feedback
    organized by timeframes with clickable timestamps.

    Returns:
        Dict with feedback summary including timeframes and clickable feedback items
    """
    try:
        summary = generate_feedback_summary()
        if summary is None:
            return {
                "error": "No pose data available for analysis",
                "session_duration": 0,
                "overall_score": 0,
                "total_feedback_items": 0,
                "timeframes": [],
                "most_common_issues": [],
                "improvement_suggestions": ["No data available for analysis."]
            }
        
        return summary
        
    except Exception as e:
        print(f"Error generating feedback summary: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate feedback summary: {str(e)}")


# ============================================================================
# API ENDPOINTS - POSE PROCESSING
# ============================================================================

@app.post("/api/sessions/snapshot", response_model=ProcessSnapshotResponse)
async def process_snapshot(request: ImageSnapshotRequest):
    """
    Process a single image snapshot for pose detection and comparison.
    This endpoint is called every 0.5 seconds by the frontend.

    Args:
        request: ImageSnapshotRequest with base64 encoded image

    Returns:
        ProcessSnapshotResponse: Detected poses, comparison results, and live feedback
    """
    print(f"📸 Received snapshot request with image length: {len(request.image) if request.image else 0}")
    print(f"📸 Video timestamp: {request.video_timestamp}")
    
    if not request.image:
        return ProcessSnapshotResponse(
            timestamp=time.time(),
            pose_landmarks=None,
            hand_landmarks=[],
            hand_classifications=[],
            preprocessed_angles={},
            comparison_result=None,
            live_feedback=None,
            success=False,
            error='No image data provided'
        )

    try:
        # Check if video has ended - stop processing if so
        if request.video_timestamp is not None and current_session.get('reference_video'):
            # Get video duration from session data
            video_duration = current_session.get('video_duration', 159.869002)
            
            if request.video_timestamp >= video_duration:
                print(f"🎬 Video ended at {request.video_timestamp}s (duration: {video_duration}s), stopping processing")
                return ProcessSnapshotResponse(
                    timestamp=time.time(),
                    pose_landmarks=None,
                    hand_landmarks=[],
                    hand_classifications=[],
                    preprocessed_angles={},
                    comparison_result=None,
                    live_feedback="Video session ended",
                    success=False,
                    error="Video session completed"
                )
        
        result = process_image_snapshot(request.image, request.video_timestamp)
        print(f"📸 Processed snapshot, returning result: {result.get('success', False)}")
        return ProcessSnapshotResponse(**result)
    except Exception as e:
        print(f"❌ Error in process_snapshot: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return ProcessSnapshotResponse(
            timestamp=time.time(),
            pose_landmarks=None,
            hand_landmarks=[],
            hand_classifications=[],
            preprocessed_angles={},
            comparison_result=None,
            live_feedback=None,
            success=False,
            error=str(e)
        )


@app.get("/api/sessions/pose-sequence")
async def get_pose_sequence():
    """
    Get the current pose sequence for analysis.

    Returns:
        dict: Current pose sequence and metadata
    """
    return {
        'sequence': [pose.tolist() for pose in pose_sequence],
        'length': len(pose_sequence),
        'max_length': MAX_SEQUENCE_LENGTH
    }


@app.post("/api/sessions/clear-sequence")
async def clear_sequence():
    """
    Clear the pose sequence buffer.

    Returns:
        dict: Success confirmation
    """
    global pose_sequence
    pose_sequence = []
    return {'success': True, 'message': 'Pose sequence cleared'}


# ============================================================================
# API ENDPOINTS - REFERENCE VIDEO
# ============================================================================

@app.post("/api/reference/load")
async def load_reference(request: LoadReferenceRequest):
    """
    Load a reference video for pose comparison.

    Args:
        request: LoadReferenceRequest with video name

    Returns:
        dict: Success message
    """
    try:
        print(f"🔍 Loading reference video: {request.video_name}")
        print(f"🔍 Request received: {request}")
        success = load_reference_video(request.video_name)
        print(f"🔍 Load result: {success}")
        
        if success:
            print(f"✅ Reference video '{request.video_name}' loaded successfully")
            return {
                "success": True,
                "message": f"Reference video '{request.video_name}' loaded successfully",
                "video_name": request.video_name
            }
        else:
            print(f"❌ Failed to load reference video '{request.video_name}'")
            raise HTTPException(status_code=500, detail=f"Failed to load reference video: {request.video_name}")
            
    except Exception as e:
        print(f"ERROR in load_reference endpoint: {e}")
        print(f"ERROR type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error loading reference video: {str(e)}")


@app.get("/api/reference/current")
async def get_current_reference():
    """
    Get information about the currently loaded reference video.

    Returns:
        dict: Current reference video information
    """
    if comparison_service is None:
        return {
            "loaded": False,
            "video_name": None
        }

    stats = comparison_service.get_statistics()
    return {
        "loaded": True,
        "video_name": current_session.get('reference_video'),
        "reference_frames": stats.get('reference_frames', 0)
    }


@app.post("/api/test/comparison-service")
async def test_comparison_service():
    """
    Test endpoint to manually initialize the comparison service.
    """
    try:
        global comparison_service
        print("🧪 Testing comparison service initialization...")
        
        # Load reference data
        data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "processed_poses", "magnetic_poses.npy")
        print(f"🧪 Loading data from: {data_path}")
        
        if not os.path.exists(data_path):
            return {"success": False, "error": f"File not found: {data_path}"}
        
        data = np.load(data_path, allow_pickle=True)
        print(f"🧪 Loaded data shape: {data.shape}")
        
        # Convert to format expected by PoseComparisonService
        reference_poses_list = []
        for i, frame_data in enumerate(data):
            if frame_data.get('has_pose', False):
                pose_dict = {
                    'landmarks': frame_data['landmarks'],
                    'timestamp': frame_data['timestamp'],
                    'frame_number': frame_data['frame_number']
                }
                reference_poses_list.append(pose_dict)
        
        print(f"🧪 Converted {len(reference_poses_list)} poses from {len(data)} frames")
        
        # Initialize comparison service
        comparison_service = PoseComparisonService(reference_poses_list, current_config)
        current_session['reference_video'] = 'magnetic'
        
        print(f"🧪 Comparison service initialized: {comparison_service is not None}")
        
        return {
            "success": True,
            "message": "Comparison service initialized successfully",
            "poses_loaded": len(reference_poses_list)
        }
        
    except Exception as e:
        print(f"🧪 Error in test endpoint: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}


# ============================================================================
# API ENDPOINTS - CONFIGURATION
# ============================================================================

@app.post("/api/config/update")
async def update_config(request: UpdateConfigRequest):
    """
    Update pose comparison configuration.

    Args:
        request: UpdateConfigRequest with config parameters

    Returns:
        dict: Updated configuration
    """
    global current_config, comparison_service

    try:
        # Handle preset configurations
        if request.preset:
            if request.preset == "default":
                new_config = DEFAULT_CONFIG
            elif request.preset == "dance":
                new_config = DANCE_CONFIG
            elif request.preset == "position_focused":
                new_config = PoseComparisonConfig(pose_weight=0.9, motion_weight=0.1)
            elif request.preset == "motion_focused":
                new_config = PoseComparisonConfig(pose_weight=0.3, motion_weight=0.7)
            else:
                raise HTTPException(status_code=400, detail=f"Unknown preset: {request.preset}")
        else:
            # Update individual parameters
            new_config = PoseComparisonConfig(
                pose_weight=request.pose_weight or current_config.pose_weight,
                motion_weight=request.motion_weight or current_config.motion_weight,
                dtw_enabled=request.dtw_enabled if request.dtw_enabled is not None else current_config.dtw_enabled,
                smoothing_window=current_config.smoothing_window,
                dtw_window=current_config.dtw_window,
                dtw_interval=current_config.dtw_interval
            )

        # Validate weights sum to 1.0
        if abs(new_config.pose_weight + new_config.motion_weight - 1.0) > 0.001:
            raise HTTPException(status_code=400, detail="Pose and motion weights must sum to 1.0")

        # Update global config
        current_config = new_config

        # Update comparison service if it exists
        if comparison_service:
            comparison_service.update_config(current_config)

        return {
            "success": True,
            "message": "Configuration updated successfully",
            "config": current_config.to_dict()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/config")
async def get_config():
    """
    Get current pose comparison configuration.

    Returns:
        dict: Current configuration settings
    """
    return {
        "config": current_config.to_dict()
    }


# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
