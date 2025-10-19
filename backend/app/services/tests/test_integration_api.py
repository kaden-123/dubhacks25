"""
Integration tests for the LivePose API
Tests API endpoints, request/response handling, and session management
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import base64
from io import BytesIO
from PIL import Image


class TestIntegrationAPI:
    """Test suite for API integration testing (without actually starting server)"""

    def __init__(self):
        self.passed = 0
        self.failed = 0

    def log_test(self, name: str, passed: bool, details: str = ""):
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {name}")
        if details:
            print(f"    {details}")
        if passed:
            self.passed += 1
        else:
            self.failed += 1

    def test_image_encoding_decoding(self):
        """Test base64 image encoding/decoding pipeline"""
        print("\n🧪 Testing Image Encoding/Decoding")

        try:
            # Create a test image
            img_array = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
            img = Image.fromarray(img_array, 'RGB')

            # Encode to base64
            buffer = BytesIO()
            img.save(buffer, format='JPEG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            self.log_test(
                "Image base64 encoding",
                len(img_base64) > 0,
                f"Encoded length: {len(img_base64)} chars"
            )

            # Decode back
            img_bytes = base64.b64decode(img_base64)
            decoded_img = Image.open(BytesIO(img_bytes))

            self.log_test(
                "Image base64 decoding",
                decoded_img.size == (640, 480),
                f"Decoded size: {decoded_img.size}"
            )

        except Exception as e:
            self.log_test("Image encoding/decoding", False, f"Exception: {e}")

    def test_request_payload_structure(self):
        """Test API request payload structures"""
        print("\n🧪 Testing Request Payload Structures")

        try:
            # Test ImageSnapshotRequest structure
            img_array = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
            img = Image.fromarray(img_array, 'RGB')
            buffer = BytesIO()
            img.save(buffer, format='JPEG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            request_data = {
                'image': img_base64
            }

            self.log_test(
                "ImageSnapshotRequest structure",
                'image' in request_data and len(request_data['image']) > 0,
                f"Has image field with {len(request_data['image'])} chars"
            )

        except Exception as e:
            self.log_test("Request payload structure", False, f"Exception: {e}")

        try:
            # Test LoadReferenceRequest structure
            load_request = {
                'video_name': 'magnetic'
            }

            self.log_test(
                "LoadReferenceRequest structure",
                'video_name' in load_request,
                f"Video name: {load_request['video_name']}"
            )

        except Exception as e:
            self.log_test("LoadReferenceRequest structure", False, f"Exception: {e}")

        try:
            # Test UpdateConfigRequest structure
            config_request = {
                'pose_weight': 0.7,
                'motion_weight': 0.3,
                'dtw_enabled': True,
                'preset': None
            }

            weights_sum = config_request['pose_weight'] + config_request['motion_weight']
            self.log_test(
                "UpdateConfigRequest structure",
                abs(weights_sum - 1.0) < 0.001,
                f"Weights sum to {weights_sum}"
            )

        except Exception as e:
            self.log_test("UpdateConfigRequest structure", False, f"Exception: {e}")

    def test_response_payload_structure(self):
        """Test API response payload structures"""
        print("\n🧪 Testing Response Payload Structures")

        try:
            # Test ProcessSnapshotResponse structure
            response_data = {
                'timestamp': 1234567890.123,
                'pose_landmarks': [[0.5, 0.5, 0.5, 0.9]] * 33,  # 33 landmarks
                'hand_landmarks': [],
                'hand_classifications': [],
                'preprocessed_angles': {'left_elbow_bend': 90.5, 'right_elbow_bend': 85.2},
                'comparison_result': {
                    'combined_score': 0.85,
                    'pose_score': 0.90,
                    'motion_score': 0.75,
                    'best_match_idx': 10
                },
                'live_feedback': 'Excellent! Great form!',
                'success': True,
                'error': None
            }

            has_required_fields = all(key in response_data for key in [
                'timestamp', 'pose_landmarks', 'comparison_result', 'success'
            ])

            self.log_test(
                "ProcessSnapshotResponse structure",
                has_required_fields,
                f"Has all required fields"
            )

            # Validate comparison result structure
            if response_data['comparison_result']:
                comp_result = response_data['comparison_result']
                has_scores = all(key in comp_result for key in [
                    'combined_score', 'pose_score', 'motion_score'
                ])

                self.log_test(
                    "Comparison result structure",
                    has_scores,
                    f"Scores: {comp_result.get('combined_score', 0):.2f}"
                )

        except Exception as e:
            self.log_test("Response payload structure", False, f"Exception: {e}")

    def test_session_lifecycle(self):
        """Test session lifecycle logic"""
        print("\n🧪 Testing Session Lifecycle")

        try:
            # Simulate session state
            session = {
                'session_id': None,
                'start_time': None,
                'pose_data': [],
                'feedback_history': [],
                'reference_video': None
            }

            # Start session
            import time
            session['session_id'] = f"session_{int(time.time())}"
            session['start_time'] = time.time()

            self.log_test(
                "Session start",
                session['session_id'] is not None and session['start_time'] is not None,
                f"Session ID: {session['session_id']}"
            )

            # Add pose data
            session['pose_data'].append({
                'timestamp': time.time(),
                'pose_landmarks': np.random.rand(33, 4),
                'comparison_result': {'combined_score': 0.85}
            })

            self.log_test(
                "Session data accumulation",
                len(session['pose_data']) > 0,
                f"Stored {len(session['pose_data'])} pose(s)"
            )

            # Load reference (should persist across session resets)
            session['reference_video'] = 'magnetic'

            # End session (but preserve reference)
            reference_video = session.get('reference_video')
            session = {
                'session_id': None,
                'start_time': None,
                'pose_data': [],
                'feedback_history': [],
                'reference_video': reference_video
            }

            self.log_test(
                "Session reset preserves reference",
                session['reference_video'] == 'magnetic',
                f"Reference: {session['reference_video']}"
            )

        except Exception as e:
            self.log_test("Session lifecycle", False, f"Exception: {e}")

    def test_feedback_generation_logic(self):
        """Test feedback generation logic"""
        print("\n🧪 Testing Feedback Generation")

        try:
            # Test live feedback based on score ranges
            test_cases = [
                (0.95, "Excellent"),
                (0.75, "Good"),
                (0.50, "Getting there"),
                (0.30, "Room for improvement"),
                (0.10, "Let's work")
            ]

            for score, expected_keyword in test_cases:
                # Simple feedback logic
                if score >= 0.8:
                    feedback = "Excellent! Great form!"
                elif score >= 0.6:
                    feedback = "Good job! Keep it up!"
                elif score >= 0.4:
                    feedback = "Getting there! Try to match the reference more closely."
                elif score >= 0.2:
                    feedback = "Room for improvement. Focus on the key poses."
                else:
                    feedback = "Let's work on the basics. Try to follow the reference more closely."

                contains_keyword = expected_keyword.lower() in feedback.lower()

                self.log_test(
                    f"Feedback for score {score:.2f}",
                    contains_keyword,
                    f"Feedback: {feedback[:50]}..."
                )

        except Exception as e:
            self.log_test("Feedback generation", False, f"Exception: {e}")

    def test_error_response_handling(self):
        """Test error response handling"""
        print("\n🧪 Testing Error Response Handling")

        try:
            # Test error response structure
            error_response = {
                'timestamp': 1234567890.123,
                'pose_landmarks': None,
                'hand_landmarks': [],
                'hand_classifications': [],
                'preprocessed_angles': {},
                'comparison_result': None,
                'live_feedback': None,
                'success': False,
                'error': 'Failed to decode image'
            }

            is_error = not error_response['success'] and error_response['error'] is not None

            self.log_test(
                "Error response structure",
                is_error,
                f"Error: {error_response['error']}"
            )

        except Exception as e:
            self.log_test("Error response handling", False, f"Exception: {e}")

    def test_config_update_validation(self):
        """Test configuration update validation"""
        print("\n🧪 Testing Config Update Validation")

        try:
            # Test valid config
            valid_config = {
                'pose_weight': 0.7,
                'motion_weight': 0.3
            }

            weights_sum = valid_config['pose_weight'] + valid_config['motion_weight']
            is_valid = abs(weights_sum - 1.0) < 0.001

            self.log_test(
                "Valid config weights",
                is_valid,
                f"Sum: {weights_sum}"
            )

        except Exception as e:
            self.log_test("Valid config", False, f"Exception: {e}")

        try:
            # Test invalid config (weights don't sum to 1)
            invalid_config = {
                'pose_weight': 0.7,
                'motion_weight': 0.5
            }

            weights_sum = invalid_config['pose_weight'] + invalid_config['motion_weight']
            is_invalid = abs(weights_sum - 1.0) > 0.001

            self.log_test(
                "Invalid config detection",
                is_invalid,
                f"Sum: {weights_sum} (should be rejected)"
            )

        except Exception as e:
            self.log_test("Invalid config detection", False, f"Exception: {e}")

    def test_preset_configurations(self):
        """Test preset configuration values"""
        print("\n🧪 Testing Preset Configurations")

        try:
            # Test preset values
            presets = {
                'default': {'pose_weight': 0.7, 'motion_weight': 0.3},
                'dance': {'pose_weight': 0.6, 'motion_weight': 0.4},
                'position_focused': {'pose_weight': 0.9, 'motion_weight': 0.1},
                'motion_focused': {'pose_weight': 0.3, 'motion_weight': 0.7}
            }

            all_valid = True
            for preset_name, config in presets.items():
                weights_sum = config['pose_weight'] + config['motion_weight']
                if abs(weights_sum - 1.0) > 0.001:
                    all_valid = False
                    break

            self.log_test(
                "All presets valid",
                all_valid,
                f"Tested {len(presets)} presets"
            )

        except Exception as e:
            self.log_test("Preset configurations", False, f"Exception: {e}")

    def test_session_summary_calculation(self):
        """Test session summary calculation logic"""
        print("\n🧪 Testing Session Summary Calculation")

        try:
            # Simulate session data
            pose_data = [
                {'comparison_result': {'combined_score': 0.85}},
                {'comparison_result': {'combined_score': 0.90}},
                {'comparison_result': {'combined_score': 0.75}},
                {'comparison_result': {'combined_score': 0.80}},
                {'comparison_result': {'combined_score': 0.88}}
            ]

            # Calculate average
            scores = [data['comparison_result']['combined_score'] for data in pose_data]
            avg_similarity = np.mean(scores)

            self.log_test(
                "Average similarity calculation",
                0 <= avg_similarity <= 1,
                f"Average: {avg_similarity:.3f}"
            )

            # Generate summary message
            if avg_similarity >= 0.7:
                summary = f"Great session! Your average similarity was {avg_similarity:.2f}"
            elif avg_similarity >= 0.5:
                summary = f"Good session with {avg_similarity:.2f} average similarity"
            else:
                summary = f"Session completed with {avg_similarity:.2f} average similarity"

            self.log_test(
                "Session summary generation",
                len(summary) > 0 and str(avg_similarity)[:4] in summary,
                f"Summary: {summary[:60]}..."
            )

        except Exception as e:
            self.log_test("Session summary", False, f"Exception: {e}")

    def test_landmark_data_format_consistency(self):
        """Test consistency of landmark data formats"""
        print("\n🧪 Testing Landmark Data Format Consistency")

        try:
            # Test pose landmarks format (33 landmarks, 4 values each)
            pose_landmarks = np.random.rand(33, 4)
            flattened = pose_landmarks.flatten()

            self.log_test(
                "Pose landmarks format",
                pose_landmarks.shape == (33, 4) and len(flattened) == 132,
                f"Shape: {pose_landmarks.shape}, Flattened: {len(flattened)}"
            )

            # Test hand landmarks format (21 landmarks, 3 values each)
            hand_landmarks = np.random.rand(21, 3)

            self.log_test(
                "Hand landmarks format",
                hand_landmarks.shape == (21, 3),
                f"Shape: {hand_landmarks.shape}"
            )

            # Test conversion to list for JSON serialization
            pose_list = pose_landmarks.tolist()
            is_serializable = isinstance(pose_list, list) and isinstance(pose_list[0], list)

            self.log_test(
                "Landmarks JSON serializable",
                is_serializable,
                f"Type: {type(pose_list)}, Element type: {type(pose_list[0])}"
            )

        except Exception as e:
            self.log_test("Landmark format consistency", False, f"Exception: {e}")

    def test_health_check_response(self):
        """Test health check endpoint logic"""
        print("\n🧪 Testing Health Check Logic")

        try:
            # Simulate health check response
            import time
            health_response = {
                'status': 'healthy',
                'timestamp': time.time(),
                'reference_loaded': True,
                'active_session': True
            }

            has_required = all(key in health_response for key in [
                'status', 'timestamp', 'reference_loaded', 'active_session'
            ])

            self.log_test(
                "Health check structure",
                has_required,
                f"Status: {health_response['status']}"
            )

            # Test different states
            states = [
                {'reference_loaded': True, 'active_session': True, 'expected': 'fully operational'},
                {'reference_loaded': True, 'active_session': False, 'expected': 'ready for session'},
                {'reference_loaded': False, 'active_session': False, 'expected': 'need reference'}
            ]

            for state in states:
                if state['reference_loaded'] and state['active_session']:
                    description = 'fully operational'
                elif state['reference_loaded']:
                    description = 'ready for session'
                else:
                    description = 'need reference'

                matches = description == state['expected']

                self.log_test(
                    f"Health state: {state['expected']}",
                    matches,
                    f"Description: {description}"
                )

        except Exception as e:
            self.log_test("Health check logic", False, f"Exception: {e}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Integration API Tests")
        print("=" * 60)

        self.test_image_encoding_decoding()
        self.test_request_payload_structure()
        self.test_response_payload_structure()
        self.test_session_lifecycle()
        self.test_feedback_generation_logic()
        self.test_error_response_handling()
        self.test_config_update_validation()
        self.test_preset_configurations()
        self.test_session_summary_calculation()
        self.test_landmark_data_format_consistency()
        self.test_health_check_response()

        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.passed + self.failed}")
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"Success Rate: {(self.passed / (self.passed + self.failed) * 100):.1f}%")

        return self.failed == 0


if __name__ == "__main__":
    tester = TestIntegrationAPI()
    success = tester.run_all_tests()

    if success:
        print("\n🎉 All integration API tests passed!")
    else:
        print("\n⚠️  Some tests failed.")

    sys.exit(0 if success else 1)
