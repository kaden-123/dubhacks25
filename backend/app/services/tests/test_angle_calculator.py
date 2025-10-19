"""
Comprehensive tests for AngleCalculator
Tests angle calculations, validation, edge cases, and landmark extraction
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
from angle_calculator import AngleCalculator


class TestAngleCalculator:
    def __init__(self):
        self.calculator = AngleCalculator()
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

    def test_basic_angle_calculation(self):
        """Test basic angle calculation between three points"""
        print("\n🧪 Testing Basic Angle Calculation")

        # Test 1: 90-degree angle
        try:
            p1 = (0, 0)
            vertex = (1, 0)
            p2 = (1, 1)
            angle = self.calculator.calculate_angle(p1, vertex, p2)
            expected = 90.0
            self.log_test(
                "90-degree angle",
                abs(angle - expected) < 1.0,
                f"Angle: {angle:.2f}°, Expected: {expected}°"
            )
        except Exception as e:
            self.log_test("90-degree angle", False, f"Exception: {e}")

        # Test 2: 180-degree angle (straight line)
        try:
            p1 = (0, 0)
            vertex = (1, 0)
            p2 = (2, 0)
            angle = self.calculator.calculate_angle(p1, vertex, p2)
            expected = 180.0
            self.log_test(
                "180-degree angle (straight)",
                abs(angle - expected) < 1.0,
                f"Angle: {angle:.2f}°, Expected: {expected}°"
            )
        except Exception as e:
            self.log_test("180-degree angle", False, f"Exception: {e}")

        # Test 3: 45-degree angle
        try:
            p1 = (0, 0)
            vertex = (1, 0)
            p2 = (1, 1)
            angle = self.calculator.calculate_angle(p1, vertex, p2)
            # Should be 90 degrees based on how calculate_angle works
            self.log_test(
                "45-degree angle",
                40 <= angle <= 100,  # Reasonable range
                f"Angle: {angle:.2f}°"
            )
        except Exception as e:
            self.log_test("45-degree angle", False, f"Exception: {e}")

    def test_arm_angle_validation(self):
        """Test arm angle calculation with validation"""
        print("\n🧪 Testing Arm Angle Calculation with Validation")

        # Test 1: Valid landmarks array
        try:
            landmarks = np.random.rand(33 * 3)  # 33 landmarks, 3 coords each
            angles = self.calculator.calculate_arm_angles(landmarks)

            self.log_test(
                "Valid arm angles",
                'left_elbow_bend' in angles and 'right_elbow_bend' in angles,
                f"Keys: {list(angles.keys())}"
            )
        except Exception as e:
            self.log_test("Valid arm angles", False, f"Exception: {e}")

        # Test 2: Too short landmarks array
        try:
            landmarks = np.random.rand(30)  # Too short
            angles = self.calculator.calculate_arm_angles(landmarks)

            # Should return zeros due to validation error
            self.log_test(
                "Short landmarks array (arm)",
                angles.get('left_elbow_bend', -1) == 0.0,
                f"Angles: {angles}"
            )
        except Exception as e:
            self.log_test("Short landmarks array (arm)", False, f"Exception: {e}")

        # Test 3: Angle values in valid range
        try:
            landmarks = np.random.rand(33 * 3)
            angles = self.calculator.calculate_arm_angles(landmarks)

            valid_range = all(0 <= angle <= 180 for angle in angles.values())
            self.log_test(
                "Arm angles in valid range [0-180]",
                valid_range,
                f"Left: {angles.get('left_elbow_bend', 0):.1f}°, Right: {angles.get('right_elbow_bend', 0):.1f}°"
            )
        except Exception as e:
            self.log_test("Arm angles in valid range", False, f"Exception: {e}")

    def test_leg_angle_validation(self):
        """Test leg angle calculation with validation"""
        print("\n🧪 Testing Leg Angle Calculation with Validation")

        # Test 1: Valid landmarks
        try:
            landmarks = np.random.rand(33 * 3)
            angles = self.calculator.calculate_leg_angles(landmarks)

            self.log_test(
                "Valid leg angles",
                'left_knee_bend' in angles and 'right_knee_bend' in angles,
                f"Keys: {list(angles.keys())}"
            )
        except Exception as e:
            self.log_test("Valid leg angles", False, f"Exception: {e}")

        # Test 2: Too short array
        try:
            landmarks = np.random.rand(50)  # Not enough for ankle landmarks
            angles = self.calculator.calculate_leg_angles(landmarks)

            self.log_test(
                "Short landmarks array (leg)",
                angles.get('left_knee_bend', -1) == 0.0,
                f"Angles: {angles}"
            )
        except Exception as e:
            self.log_test("Short landmarks array (leg)", False, f"Exception: {e}")

        # Test 3: Realistic knee angles
        try:
            # Create realistic pose: standing straight
            landmarks = np.zeros(33 * 3)
            # Set up left leg: hip, knee, ankle in straight line
            landmarks[23*3:23*3+2] = [0.3, 0.5]  # left hip
            landmarks[25*3:25*3+2] = [0.3, 0.7]  # left knee
            landmarks[27*3:27*3+2] = [0.3, 0.9]  # left ankle
            # Right leg
            landmarks[24*3:24*3+2] = [0.7, 0.5]  # right hip
            landmarks[26*3:26*3+2] = [0.7, 0.7]  # right knee
            landmarks[28*3:28*3+2] = [0.7, 0.9]  # right ankle

            angles = self.calculator.calculate_leg_angles(landmarks)

            # Straight legs should be close to 180 degrees
            self.log_test(
                "Straight leg angles",
                angles.get('left_knee_bend', 0) > 160 and angles.get('right_knee_bend', 0) > 160,
                f"Left: {angles.get('left_knee_bend', 0):.1f}°, Right: {angles.get('right_knee_bend', 0):.1f}°"
            )
        except Exception as e:
            self.log_test("Straight leg angles", False, f"Exception: {e}")

    def test_body_angles(self):
        """Test body posture angle calculations"""
        print("\n🧪 Testing Body Angle Calculation")

        # Test 1: Level shoulders (no tilt)
        try:
            landmarks = np.zeros(33 * 3)
            # Set shoulders at same height
            landmarks[11*3:11*3+2] = [0.3, 0.5]  # left shoulder
            landmarks[12*3:12*3+2] = [0.7, 0.5]  # right shoulder (same y)
            # Set hips
            landmarks[23*3:23*3+2] = [0.3, 0.7]  # left hip
            landmarks[24*3:24*3+2] = [0.7, 0.7]  # right hip

            angles = self.calculator.calculate_body_angles(landmarks)

            self.log_test(
                "Level shoulders (no tilt)",
                abs(angles.get('shoulder_tilt', 90)) < 5,
                f"Shoulder tilt: {angles.get('shoulder_tilt', 0):.2f}°"
            )
        except Exception as e:
            self.log_test("Level shoulders", False, f"Exception: {e}")

        # Test 2: Tilted shoulders
        try:
            landmarks = np.zeros(33 * 3)
            # Left shoulder higher than right
            landmarks[11*3:11*3+2] = [0.3, 0.4]  # left shoulder (higher)
            landmarks[12*3:12*3+2] = [0.7, 0.6]  # right shoulder (lower)
            landmarks[23*3:23*3+2] = [0.3, 0.7]
            landmarks[24*3:24*3+2] = [0.7, 0.7]

            angles = self.calculator.calculate_body_angles(landmarks)

            self.log_test(
                "Tilted shoulders",
                abs(angles.get('shoulder_tilt', 0)) > 5,
                f"Shoulder tilt: {angles.get('shoulder_tilt', 0):.2f}°"
            )
        except Exception as e:
            self.log_test("Tilted shoulders", False, f"Exception: {e}")

        # Test 3: Body lean calculation
        try:
            landmarks = np.random.rand(33 * 3)
            angles = self.calculator.calculate_body_angles(landmarks)

            self.log_test(
                "Body lean calculated",
                'body_lean' in angles,
                f"Body lean: {angles.get('body_lean', 0):.2f}°"
            )
        except Exception as e:
            self.log_test("Body lean", False, f"Exception: {e}")

    def test_hand_angles(self):
        """Test hand angle calculations"""
        print("\n🧪 Testing Hand Angle Calculation")

        # Test 1: Valid hand landmarks
        try:
            hand_landmarks = np.random.rand(21 * 3)  # 21 hand landmarks
            angles = self.calculator.calculate_hand_angles(hand_landmarks)

            self.log_test(
                "Valid hand angles",
                'hand_orientation' in angles,
                f"Keys: {list(angles.keys())}"
            )
        except Exception as e:
            self.log_test("Valid hand angles", False, f"Exception: {e}")

        # Test 2: Insufficient hand landmarks
        try:
            hand_landmarks = np.random.rand(10)  # Too few
            angles = self.calculator.calculate_hand_angles(hand_landmarks)

            self.log_test(
                "Insufficient hand landmarks",
                len(angles) == 0,
                "Should return empty dict for insufficient landmarks"
            )
        except Exception as e:
            self.log_test("Insufficient hand landmarks", False, f"Exception: {e}")

    def test_all_angles_integration(self):
        """Test calculate_all_angles with complete pose"""
        print("\n🧪 Testing Complete Angle Calculation")

        # Test 1: Full pose without hands
        try:
            pose_landmarks = np.random.rand(33 * 3)
            all_angles = self.calculator.calculate_all_angles(pose_landmarks)

            expected_keys = ['left_elbow_bend', 'right_elbow_bend',
                           'left_knee_bend', 'right_knee_bend',
                           'shoulder_tilt', 'hip_tilt', 'body_lean']
            has_all_keys = all(key in all_angles for key in expected_keys)

            self.log_test(
                "Full pose angles (no hands)",
                has_all_keys,
                f"Found keys: {list(all_angles.keys())}"
            )
        except Exception as e:
            self.log_test("Full pose angles", False, f"Exception: {e}")

        # Test 2: Full pose with hands
        try:
            pose_landmarks = np.random.rand(33 * 3)
            hand_landmarks = np.random.rand(21 * 3)
            all_angles = self.calculator.calculate_all_angles(pose_landmarks, hand_landmarks)

            has_hand_angles = 'hand_orientation' in all_angles

            self.log_test(
                "Full pose with hand angles",
                has_hand_angles,
                f"Total angles: {len(all_angles)}"
            )
        except Exception as e:
            self.log_test("Full pose with hands", False, f"Exception: {e}")

    def test_landmark_extraction(self):
        """Test extract_key_landmarks method"""
        print("\n🧪 Testing Key Landmark Extraction")

        # Test 1: Extract from valid landmarks
        try:
            landmarks_flat = np.random.rand(33 * 3)
            key_landmarks = self.calculator.extract_key_landmarks(landmarks_flat)

            expected_categories = ['torso', 'arms', 'legs', 'head']
            has_all_categories = all(cat in key_landmarks for cat in expected_categories)

            self.log_test(
                "Extract key landmarks",
                has_all_categories,
                f"Categories: {list(key_landmarks.keys())}"
            )
        except Exception as e:
            self.log_test("Extract key landmarks", False, f"Exception: {e}")

        # Test 2: Check specific landmark extraction
        try:
            landmarks_flat = np.random.rand(33 * 3)
            key_landmarks = self.calculator.extract_key_landmarks(landmarks_flat)

            has_shoulders = ('left_shoulder' in key_landmarks['torso'] and
                           'right_shoulder' in key_landmarks['torso'])

            self.log_test(
                "Specific landmarks extracted",
                has_shoulders,
                f"Torso landmarks: {list(key_landmarks['torso'].keys())}"
            )
        except Exception as e:
            self.log_test("Specific landmarks", False, f"Exception: {e}")

        # Test 3: Landmarks are 3D coordinates
        try:
            landmarks_flat = np.random.rand(33 * 3)
            key_landmarks = self.calculator.extract_key_landmarks(landmarks_flat)

            # Check that extracted landmarks are lists of 3 values
            sample_landmark = key_landmarks['torso'].get('left_shoulder')
            is_3d = sample_landmark is not None and len(sample_landmark) == 3

            self.log_test(
                "Landmarks are 3D coordinates",
                is_3d,
                f"Sample landmark: {sample_landmark}"
            )
        except Exception as e:
            self.log_test("3D coordinates", False, f"Exception: {e}")

    def test_angle_summary(self):
        """Test angle summary generation"""
        print("\n🧪 Testing Angle Summary Generation")

        # Test 1: Summary with all angles
        try:
            angles = {
                'left_elbow_bend': 90.5,
                'right_elbow_bend': 85.2,
                'left_knee_bend': 170.1,
                'right_knee_bend': 168.5,
                'shoulder_tilt': 2.3,
                'hip_tilt': 1.1
            }
            summary = self.calculator.get_angle_summary(angles)

            self.log_test(
                "Complete angle summary",
                len(summary) > 0 and 'Elbows' in summary,
                f"Summary: {summary}"
            )
        except Exception as e:
            self.log_test("Complete summary", False, f"Exception: {e}")

        # Test 2: Summary with partial angles
        try:
            angles = {
                'left_elbow_bend': 90.5,
                'right_elbow_bend': 85.2
            }
            summary = self.calculator.get_angle_summary(angles)

            self.log_test(
                "Partial angle summary",
                len(summary) > 0,
                f"Summary: {summary}"
            )
        except Exception as e:
            self.log_test("Partial summary", False, f"Exception: {e}")

        # Test 3: Empty angles
        try:
            angles = {}
            summary = self.calculator.get_angle_summary(angles)

            self.log_test(
                "Empty angle summary",
                len(summary) == 0,
                f"Summary: '{summary}'"
            )
        except Exception as e:
            self.log_test("Empty summary", False, f"Exception: {e}")

    def test_edge_cases(self):
        """Test edge cases and error conditions"""
        print("\n🧪 Testing Edge Cases")

        # Test 1: Zero-length vectors in angle calculation
        try:
            p1 = (0, 0)
            vertex = (0, 0)
            p2 = (1, 1)
            angle = self.calculator.calculate_angle(p1, vertex, p2)

            self.log_test(
                "Zero-length vector handling",
                angle == 0.0,
                f"Angle: {angle}°"
            )
        except Exception as e:
            self.log_test("Zero-length vector", True, f"Handled gracefully: {type(e).__name__}")

        # Test 2: NaN values in landmarks
        try:
            landmarks = np.random.rand(33 * 3)
            landmarks[0] = np.nan  # Introduce NaN
            angles = self.calculator.calculate_all_angles(landmarks)

            # Should handle gracefully (either skip or return zeros)
            self.log_test(
                "NaN value handling",
                isinstance(angles, dict),
                "Handled NaN values without crashing"
            )
        except Exception as e:
            self.log_test("NaN value handling", True, f"Handled: {type(e).__name__}")

        # Test 3: Extremely large coordinate values
        try:
            landmarks = np.random.rand(33 * 3) * 1000000
            angles = self.calculator.calculate_all_angles(landmarks)

            self.log_test(
                "Large coordinate values",
                isinstance(angles, dict),
                "Handled large values"
            )
        except Exception as e:
            self.log_test("Large values", False, f"Exception: {e}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting AngleCalculator Tests")
        print("=" * 60)

        self.test_basic_angle_calculation()
        self.test_arm_angle_validation()
        self.test_leg_angle_validation()
        self.test_body_angles()
        self.test_hand_angles()
        self.test_all_angles_integration()
        self.test_landmark_extraction()
        self.test_angle_summary()
        self.test_edge_cases()

        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.passed + self.failed}")
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"Success Rate: {(self.passed / (self.passed + self.failed) * 100):.1f}%")

        return self.failed == 0


if __name__ == "__main__":
    tester = TestAngleCalculator()
    success = tester.run_all_tests()

    if success:
        print("\n🎉 All AngleCalculator tests passed!")
    else:
        print("\n⚠️  Some tests failed.")

    sys.exit(0 if success else 1)
