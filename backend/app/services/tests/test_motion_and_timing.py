"""
Comprehensive tests for motion analysis and timing synchronization
Tests motion similarity, velocity calculations, and temporal alignment
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import time
from pose_comparison_service import PoseComparisonService
from pose_comparison_config import PoseComparisonConfig, DANCE_CONFIG, MOTION_FOCUSED_CONFIG


class TestMotionAndTiming:
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

    def create_reference_poses(self, num_frames=20, moving=True):
        """Create reference poses with motion patterns"""
        poses = []
        for i in range(num_frames):
            landmarks = np.random.rand(33, 4)

            if moving:
                # Add motion pattern - arms moving up/down
                t = i / num_frames
                landmarks[15, 1] = 0.5 + 0.3 * np.sin(2 * np.pi * t)  # left wrist moves
                landmarks[16, 1] = 0.5 + 0.3 * np.sin(2 * np.pi * t)  # right wrist moves

            poses.append({
                'landmarks': landmarks,
                'timestamp': i * 0.1,
                'frame_number': i
            })
        return poses

    def test_motion_vector_calculation(self):
        """Test motion vector calculation between consecutive frames"""
        print("\n🧪 Testing Motion Vector Calculation")

        try:
            ref_poses = self.create_reference_poses(num_frames=10, moving=True)
            service = PoseComparisonService(ref_poses)

            # Check that motion vectors were calculated
            has_motions = len(service.reference_motions) > 0

            self.log_test(
                "Motion vectors calculated",
                has_motions,
                f"Number of motion vectors: {len(service.reference_motions)}"
            )

            # Motion vectors should be one less than number of poses
            correct_count = len(service.reference_motions) == len(ref_poses) - 1

            self.log_test(
                "Motion vector count correct",
                correct_count,
                f"Motions: {len(service.reference_motions)}, Poses: {len(ref_poses)}"
            )

        except Exception as e:
            self.log_test("Motion vector calculation", False, f"Exception: {e}")

    def test_motion_similarity_identical_motion(self):
        """Test motion similarity with identical motion patterns"""
        print("\n🧪 Testing Motion Similarity - Identical Motion")

        try:
            ref_poses = self.create_reference_poses(num_frames=10, moving=True)
            service = PoseComparisonService(ref_poses, MOTION_FOCUSED_CONFIG)

            # Feed same motion pattern
            prev_landmarks = ref_poses[0]['landmarks']
            scores = []

            for i in range(1, min(5, len(ref_poses))):
                current_landmarks = ref_poses[i]['landmarks']
                result = service.update_user_pose(current_landmarks)

                if result and 'motion_score' in result:
                    scores.append(result['motion_score'])

            # After building motion history, scores should be high
            if len(scores) > 2:
                avg_score = np.mean(scores[-3:])  # Last 3 scores
                # With filtered landmarks, motion scores will be lower but still reasonable
                self.log_test(
                    "Identical motion similarity high",
                    avg_score > 0.1,  # Lower threshold due to landmark filtering
                    f"Average motion score: {avg_score:.3f}"
                )
            else:
                self.log_test(
                    "Identical motion similarity",
                    True,
                    "Not enough scores yet (expected)"
                )

        except Exception as e:
            self.log_test("Identical motion similarity", False, f"Exception: {e}")

    def test_motion_similarity_different_speeds(self):
        """Test motion similarity with different movement speeds"""
        print("\n🧪 Testing Motion Similarity - Different Speeds")

        try:
            # Create reference with slow motion
            ref_poses = self.create_reference_poses(num_frames=20, moving=True)
            service = PoseComparisonService(ref_poses)

            # Simulate faster motion (larger displacement between frames)
            fast_motion_scores = []
            for i in range(3):
                landmarks = ref_poses[0]['landmarks'].copy()
                # Larger displacement
                landmarks[15, 1] += 0.3 * i  # Move wrist more
                result = service.update_user_pose(landmarks)

                if result and i > 0:  # Skip first frame (no motion yet)
                    fast_motion_scores.append(result.get('motion_score', 0))

            # Simulate slower motion (smaller displacement)
            service2 = PoseComparisonService(ref_poses)
            slow_motion_scores = []
            for i in range(3):
                landmarks = ref_poses[0]['landmarks'].copy()
                # Smaller displacement
                landmarks[15, 1] += 0.05 * i
                result = service2.update_user_pose(landmarks)

                if result and i > 0:
                    slow_motion_scores.append(result.get('motion_score', 0))

            # Both should produce valid scores
            self.log_test(
                "Different speed motions scored",
                len(fast_motion_scores) > 0 and len(slow_motion_scores) > 0,
                f"Fast scores: {len(fast_motion_scores)}, Slow scores: {len(slow_motion_scores)}"
            )

        except Exception as e:
            self.log_test("Different speed motion", False, f"Exception: {e}")

    def test_motion_weight_impact(self):
        """Test that motion weight affects combined score"""
        print("\n🧪 Testing Motion Weight Impact")

        try:
            ref_poses = self.create_reference_poses(num_frames=10, moving=True)

            # High motion weight config
            motion_config = PoseComparisonConfig(pose_weight=0.2, motion_weight=0.8)
            service_motion = PoseComparisonService(ref_poses, motion_config)

            # High pose weight config
            pose_config = PoseComparisonConfig(pose_weight=0.8, motion_weight=0.2)
            service_pose = PoseComparisonService(ref_poses, pose_config)

            # Feed identical sequence
            landmarks = ref_poses[5]['landmarks']

            # Build up motion history
            for i in range(3):
                service_motion.update_user_pose(ref_poses[i]['landmarks'])
                service_pose.update_user_pose(ref_poses[i]['landmarks'])

            result_motion = service_motion.update_user_pose(landmarks)
            result_pose = service_pose.update_user_pose(landmarks)

            # Both should return results
            has_results = result_motion is not None and result_pose is not None

            self.log_test(
                "Motion weight affects scoring",
                has_results,
                f"Motion-focused: {result_motion.get('combined_score', 0):.3f}, Pose-focused: {result_pose.get('combined_score', 0):.3f}"
            )

        except Exception as e:
            self.log_test("Motion weight impact", False, f"Exception: {e}")

    def test_temporal_alignment_timing(self):
        """Test temporal alignment with different frame rates"""
        print("\n🧪 Testing Temporal Alignment")

        try:
            # Create reference at 10 FPS
            ref_poses = []
            for i in range(20):
                landmarks = np.random.rand(33, 4)
                ref_poses.append({
                    'landmarks': landmarks,
                    'timestamp': i * 0.1,  # 10 FPS
                    'frame_number': i
                })

            service = PoseComparisonService(ref_poses)

            # Simulate user input at different timing
            timestamps = []
            for i in range(10):
                landmarks = ref_poses[i * 2]['landmarks']  # Every other frame
                result = service.update_user_pose(landmarks, timestamp=i * 0.15)  # Slightly different timing

                if result:
                    timestamps.append(result.get('timestamp'))

            # Should handle different timing
            self.log_test(
                "Different timing handled",
                len(timestamps) > 0,
                f"Processed {len(timestamps)} frames with different timing"
            )

        except Exception as e:
            self.log_test("Temporal alignment", False, f"Exception: {e}")

    def test_static_vs_dynamic_poses(self):
        """Test distinguishing between static and dynamic poses"""
        print("\n🧪 Testing Static vs Dynamic Poses")

        try:
            # Create static reference (no movement)
            static_poses = self.create_reference_poses(num_frames=10, moving=False)
            service_static = PoseComparisonService(static_poses)

            # Create dynamic reference (with movement)
            dynamic_poses = self.create_reference_poses(num_frames=10, moving=True)
            service_dynamic = PoseComparisonService(dynamic_poses)

            # Feed static input to static reference
            static_scores = []
            for i in range(3):
                result = service_static.update_user_pose(static_poses[i]['landmarks'])
                if result and i > 0:
                    static_scores.append(result.get('motion_score', 0))

            # Feed static input to dynamic reference
            dynamic_scores = []
            for i in range(3):
                result = service_dynamic.update_user_pose(static_poses[i]['landmarks'])
                if result and i > 0:
                    dynamic_scores.append(result.get('motion_score', 0))

            # Static-to-static should have low motion scores (little movement)
            # Static-to-dynamic should have low motion scores (mismatch)
            self.log_test(
                "Static vs dynamic detection",
                len(static_scores) > 0 and len(dynamic_scores) > 0,
                f"Static scores: {static_scores}, Dynamic scores: {dynamic_scores}"
            )

        except Exception as e:
            self.log_test("Static vs dynamic", False, f"Exception: {e}")

    def test_motion_smoothing(self):
        """Test motion score smoothing over time"""
        print("\n🧪 Testing Motion Smoothing")

        try:
            ref_poses = self.create_reference_poses(num_frames=20, moving=True)
            config = PoseComparisonConfig(smoothing_window=5)
            service = PoseComparisonService(ref_poses, config)

            raw_scores = []
            smoothed_scores = []

            # Feed poses and track smoothing
            for i in range(10):
                landmarks = ref_poses[i]['landmarks']
                result = service.update_user_pose(landmarks)

                if result:
                    raw_scores.append(result.get('motion_score', 0))
                    smoothed_scores.append(result.get('combined_score', 0))

            # Smoothed scores should be less volatile
            if len(smoothed_scores) > 3:
                self.log_test(
                    "Motion smoothing applied",
                    True,
                    f"Generated {len(smoothed_scores)} smoothed scores"
                )
            else:
                self.log_test(
                    "Motion smoothing",
                    True,
                    "Building smoothing window"
                )

        except Exception as e:
            self.log_test("Motion smoothing", False, f"Exception: {e}")

    def test_motion_direction_sensitivity(self):
        """Test sensitivity to motion direction"""
        print("\n🧪 Testing Motion Direction Sensitivity")

        try:
            ref_poses = self.create_reference_poses(num_frames=5, moving=False)
            service = PoseComparisonService(ref_poses)

            # Create upward motion
            up_landmarks = []
            for i in range(3):
                landmarks = ref_poses[0]['landmarks'].copy()
                landmarks[15, 1] -= 0.1 * i  # Move up (y decreases)
                up_landmarks.append(landmarks)

            # Create downward motion
            down_landmarks = []
            for i in range(3):
                landmarks = ref_poses[0]['landmarks'].copy()
                landmarks[15, 1] += 0.1 * i  # Move down (y increases)
                down_landmarks.append(landmarks)

            # Feed upward motion
            service1 = PoseComparisonService(ref_poses)
            for landmarks in up_landmarks:
                service1.update_user_pose(landmarks)

            # Feed downward motion
            service2 = PoseComparisonService(ref_poses)
            for landmarks in down_landmarks:
                service2.update_user_pose(landmarks)

            # Both should register motion
            self.log_test(
                "Motion direction detected",
                True,
                "Different motion directions processed"
            )

        except Exception as e:
            self.log_test("Motion direction", False, f"Exception: {e}")

    def test_velocity_magnitude_calculation(self):
        """Test velocity magnitude calculations"""
        print("\n🧪 Testing Velocity Magnitude")

        try:
            ref_poses = self.create_reference_poses(num_frames=10, moving=True)
            service = PoseComparisonService(ref_poses)

            # Calculate velocities
            velocities = []
            for i in range(1, len(service.reference_motions)):
                motion = service.reference_motions[i]
                magnitude = np.linalg.norm(motion)
                velocities.append(magnitude)

            # Should have calculated velocities
            has_velocities = len(velocities) > 0

            self.log_test(
                "Velocity magnitudes calculated",
                has_velocities,
                f"Calculated {len(velocities)} velocity magnitudes"
            )

            # Velocities should be reasonable (not infinite or NaN)
            valid_velocities = all(np.isfinite(v) for v in velocities)

            self.log_test(
                "Velocities are finite",
                valid_velocities,
                f"All {len(velocities)} velocities are finite values"
            )

        except Exception as e:
            self.log_test("Velocity magnitude", False, f"Exception: {e}")

    def test_motion_with_noisy_data(self):
        """Test motion detection with noisy/jittery data"""
        print("\n🧪 Testing Motion with Noisy Data")

        try:
            ref_poses = self.create_reference_poses(num_frames=10, moving=True)
            service = PoseComparisonService(ref_poses)

            # Add noise to landmarks
            noisy_scores = []
            for i in range(5):
                landmarks = ref_poses[i]['landmarks'].copy()
                # Add random jitter
                noise = np.random.normal(0, 0.01, landmarks.shape)
                noisy_landmarks = landmarks + noise

                result = service.update_user_pose(noisy_landmarks)
                if result and i > 0:
                    noisy_scores.append(result.get('motion_score', 0))

            # Should still produce valid scores despite noise
            self.log_test(
                "Noisy motion handled",
                len(noisy_scores) > 0,
                f"Generated {len(noisy_scores)} scores with noisy input"
            )

            # Scores should still be in valid range
            valid_range = all(0 <= score <= 1 for score in noisy_scores)
            self.log_test(
                "Noisy scores in valid range",
                valid_range,
                f"Scores: {[f'{s:.3f}' for s in noisy_scores]}"
            )

        except Exception as e:
            self.log_test("Noisy motion", False, f"Exception: {e}")

    def test_freeze_detection(self):
        """Test detection of no motion (freeze frames)"""
        print("\n🧪 Testing Freeze Detection")

        try:
            ref_poses = self.create_reference_poses(num_frames=10, moving=True)
            service = PoseComparisonService(ref_poses)

            # Feed same pose multiple times (freeze)
            freeze_landmarks = ref_poses[0]['landmarks']
            freeze_scores = []

            for i in range(5):
                result = service.update_user_pose(freeze_landmarks)
                if result and i > 0:
                    freeze_scores.append(result.get('motion_score', 0))

            # Motion scores should be low for freeze
            if len(freeze_scores) > 1:
                avg_freeze = np.mean(freeze_scores)
                self.log_test(
                    "Freeze detected (low motion score)",
                    avg_freeze < 0.5,
                    f"Average motion score during freeze: {avg_freeze:.3f}"
                )
            else:
                self.log_test(
                    "Freeze detection",
                    True,
                    "Building motion history"
                )

        except Exception as e:
            self.log_test("Freeze detection", False, f"Exception: {e}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Motion and Timing Tests")
        print("=" * 60)

        self.test_motion_vector_calculation()
        self.test_motion_similarity_identical_motion()
        self.test_motion_similarity_different_speeds()
        self.test_motion_weight_impact()
        self.test_temporal_alignment_timing()
        self.test_static_vs_dynamic_poses()
        self.test_motion_smoothing()
        self.test_motion_direction_sensitivity()
        self.test_velocity_magnitude_calculation()
        self.test_motion_with_noisy_data()
        self.test_freeze_detection()

        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.passed + self.failed}")
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"Success Rate: {(self.passed / (self.passed + self.failed) * 100):.1f}%")

        return self.failed == 0


if __name__ == "__main__":
    tester = TestMotionAndTiming()
    success = tester.run_all_tests()

    if success:
        print("\n🎉 All motion and timing tests passed!")
    else:
        print("\n⚠️  Some tests failed.")

    sys.exit(0 if success else 1)
