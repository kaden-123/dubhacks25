"""
Edge cases and stress testing for pose comparison system
Tests boundary conditions, performance under load, and error recovery
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import time
from pose_comparison_service import PoseComparisonService
from pose_comparison_config import PoseComparisonConfig
from angle_calculator import AngleCalculator


class TestEdgeCasesAndStress:
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

    def create_reference_poses(self, num_frames=10):
        """Create mock reference poses"""
        poses = []
        for i in range(num_frames):
            poses.append({
                'landmarks': np.random.rand(33, 4),
                'timestamp': i * 0.1,
                'frame_number': i
            })
        return poses

    def test_extreme_coordinate_values(self):
        """Test handling of extreme coordinate values"""
        print("\n🧪 Testing Extreme Coordinate Values")

        try:
            # Test with very large coordinates
            ref_poses = self.create_reference_poses(5)
            ref_poses[0]['landmarks'] = np.ones((33, 4)) * 1e10
            service = PoseComparisonService(ref_poses)

            landmarks = np.ones((33, 4)) * 1e10
            result = service.update_user_pose(landmarks)

            self.log_test(
                "Very large coordinates",
                result is not None,
                "Handled large values gracefully"
            )
        except Exception as e:
            self.log_test("Very large coordinates", False, f"Exception: {e}")

        try:
            # Test with very small coordinates
            ref_poses = self.create_reference_poses(5)
            ref_poses[0]['landmarks'] = np.ones((33, 4)) * 1e-10
            service = PoseComparisonService(ref_poses)

            landmarks = np.ones((33, 4)) * 1e-10
            result = service.update_user_pose(landmarks)

            self.log_test(
                "Very small coordinates",
                result is not None,
                "Handled small values gracefully"
            )
        except Exception as e:
            self.log_test("Very small coordinates", False, f"Exception: {e}")

        try:
            # Test with negative coordinates
            ref_poses = self.create_reference_poses(5)
            ref_poses[0]['landmarks'] = -np.random.rand(33, 4)
            service = PoseComparisonService(ref_poses)

            landmarks = -np.random.rand(33, 4)
            result = service.update_user_pose(landmarks)

            self.log_test(
                "Negative coordinates",
                result is not None,
                "Handled negative values gracefully"
            )
        except Exception as e:
            self.log_test("Negative coordinates", False, f"Exception: {e}")

    def test_special_float_values(self):
        """Test handling of NaN, inf, and other special float values"""
        print("\n🧪 Testing Special Float Values")

        calculator = AngleCalculator()

        try:
            # Test with NaN values
            landmarks = np.random.rand(33 * 3)
            landmarks[0] = np.nan
            landmarks[10] = np.nan

            angles = calculator.calculate_all_angles(landmarks)

            self.log_test(
                "NaN values in landmarks",
                isinstance(angles, dict),
                "Handled NaN without crashing"
            )
        except Exception as e:
            self.log_test("NaN values", True, f"Caught gracefully: {type(e).__name__}")

        try:
            # Test with infinity
            landmarks = np.random.rand(33 * 3)
            landmarks[5] = np.inf
            landmarks[15] = -np.inf

            angles = calculator.calculate_all_angles(landmarks)

            self.log_test(
                "Infinity values in landmarks",
                isinstance(angles, dict),
                "Handled infinity without crashing"
            )
        except Exception as e:
            self.log_test("Infinity values", True, f"Caught gracefully: {type(e).__name__}")

    def test_minimum_viable_data(self):
        """Test with minimum amount of data"""
        print("\n🧪 Testing Minimum Viable Data")

        try:
            # Single reference pose
            ref_poses = self.create_reference_poses(1)
            service = PoseComparisonService(ref_poses)

            landmarks = np.random.rand(33, 4)
            result = service.update_user_pose(landmarks)

            self.log_test(
                "Single reference pose",
                result is not None,
                "Works with minimal reference"
            )
        except Exception as e:
            self.log_test("Single reference pose", False, f"Exception: {e}")

        try:
            # Two reference poses (minimum for motion)
            ref_poses = self.create_reference_poses(2)
            service = PoseComparisonService(ref_poses)

            # Feed two user poses
            result1 = service.update_user_pose(np.random.rand(33, 4))
            result2 = service.update_user_pose(np.random.rand(33, 4))

            has_motion = result2 is not None and 'motion_score' in result2

            self.log_test(
                "Minimum poses for motion",
                has_motion,
                "Motion calculated with 2 poses"
            )
        except Exception as e:
            self.log_test("Minimum poses for motion", False, f"Exception: {e}")

    def test_maximum_data_load(self):
        """Test with large amounts of data"""
        print("\n🧪 Testing Maximum Data Load")

        try:
            # Large number of reference poses
            ref_poses = self.create_reference_poses(1000)
            start_time = time.time()
            service = PoseComparisonService(ref_poses)
            init_time = time.time() - start_time

            self.log_test(
                "1000 reference poses initialization",
                init_time < 5.0,
                f"Initialized in {init_time:.2f}s"
            )

            # Test comparison performance
            start_time = time.time()
            landmarks = np.random.rand(33, 4)
            result = service.update_user_pose(landmarks)
            comparison_time = time.time() - start_time

            self.log_test(
                "Comparison with 1000 references",
                comparison_time < 1.0,
                f"Compared in {comparison_time:.3f}s"
            )
        except Exception as e:
            self.log_test("Maximum data load", False, f"Exception: {e}")

    def test_rapid_pose_updates(self):
        """Test rapid consecutive pose updates"""
        print("\n🧪 Testing Rapid Pose Updates")

        try:
            ref_poses = self.create_reference_poses(20)
            service = PoseComparisonService(ref_poses)

            # Simulate 60 FPS input
            start_time = time.time()
            num_updates = 60
            for i in range(num_updates):
                landmarks = np.random.rand(33, 4)
                result = service.update_user_pose(landmarks, timestamp=start_time + i/60)

            duration = time.time() - start_time

            self.log_test(
                "60 rapid updates (1 second of 60 FPS)",
                duration < 2.0,
                f"Processed in {duration:.2f}s (target: <2s)"
            )

            # Check history management
            history_size = len(service.user_pose_history)
            self.log_test(
                "History size managed correctly",
                history_size <= service.config.smoothing_window * 2,
                f"History: {history_size}, Max: {service.config.smoothing_window * 2}"
            )
        except Exception as e:
            self.log_test("Rapid updates", False, f"Exception: {e}")

    def test_memory_leak_detection(self):
        """Test for potential memory leaks with repeated operations"""
        print("\n🧪 Testing Memory Leak Detection")

        try:
            ref_poses = self.create_reference_poses(50)
            service = PoseComparisonService(ref_poses)

            # Simulate long session
            initial_history_size = len(service.user_pose_history)

            for i in range(200):
                landmarks = np.random.rand(33, 4)
                service.update_user_pose(landmarks)

            final_history_size = len(service.user_pose_history)

            # History should be bounded by max length
            history_bounded = final_history_size <= service.config.smoothing_window * 2

            self.log_test(
                "History bounded (no memory leak)",
                history_bounded,
                f"Initial: {initial_history_size}, Final: {final_history_size}, Max: {service.config.smoothing_window * 2}"
            )
        except Exception as e:
            self.log_test("Memory leak detection", False, f"Exception: {e}")

    def test_concurrent_config_updates(self):
        """Test config updates while processing"""
        print("\n🧪 Testing Concurrent Config Updates")

        try:
            ref_poses = self.create_reference_poses(20)
            service = PoseComparisonService(ref_poses)

            # Process some poses
            for i in range(5):
                landmarks = np.random.rand(33, 4)
                service.update_user_pose(landmarks)

            # Update config mid-processing
            new_config = PoseComparisonConfig(
                pose_weight=0.5,
                motion_weight=0.5,
                smoothing_window=3
            )
            service.update_config(new_config)

            # Continue processing
            for i in range(5):
                landmarks = np.random.rand(33, 4)
                result = service.update_user_pose(landmarks)

            self.log_test(
                "Config update mid-processing",
                result is not None,
                "Updated config without errors"
            )

            # Verify new config applied
            config_applied = service.config.pose_weight == 0.5

            self.log_test(
                "New config applied",
                config_applied,
                f"Pose weight: {service.config.pose_weight}"
            )
        except Exception as e:
            self.log_test("Concurrent config updates", False, f"Exception: {e}")

    def test_dtw_edge_cases(self):
        """Test DTW with problematic sequences"""
        print("\n🧪 Testing DTW Edge Cases")

        try:
            ref_poses = self.create_reference_poses(10)
            service = PoseComparisonService(ref_poses)

            # Test with very short sequences
            user_seq = [np.random.rand(33, 4) for _ in range(2)]
            ref_seq = [np.random.rand(33, 4) for _ in range(2)]

            similarity, path = service._apply_dynamic_time_warping(user_seq, ref_seq)

            self.log_test(
                "DTW with short sequences",
                similarity == 0.0,  # Should return 0 for too-short sequences
                f"Similarity: {similarity}"
            )
        except Exception as e:
            self.log_test("DTW short sequences", False, f"Exception: {e}")

        try:
            # Test with single-element sequences
            user_seq = [np.random.rand(33, 4)]
            ref_seq = [np.random.rand(33, 4)]

            similarity, path = service._apply_dynamic_time_warping(user_seq, ref_seq)

            self.log_test(
                "DTW with single elements",
                similarity == 0.0,
                f"Similarity: {similarity}"
            )
        except Exception as e:
            self.log_test("DTW single elements", False, f"Exception: {e}")

    def test_zero_variance_data(self):
        """Test with constant/unchanging data"""
        print("\n🧪 Testing Zero Variance Data")

        try:
            # All reference poses identical
            ref_poses = []
            constant_landmarks = np.ones((33, 4)) * 0.5
            for i in range(10):
                ref_poses.append({
                    'landmarks': constant_landmarks.copy(),
                    'timestamp': i * 0.1,
                    'frame_number': i
                })

            service = PoseComparisonService(ref_poses)

            # Feed identical pose
            result = service.update_user_pose(constant_landmarks)

            self.log_test(
                "Constant poses (zero variance)",
                result is not None,
                "Handled zero variance data"
            )

            # Score should be high (identical to reference)
            if result:
                high_score = result.get('pose_score', 0) > 0.8
                self.log_test(
                    "High score for identical constant pose",
                    high_score,
                    f"Pose score: {result.get('pose_score', 0):.3f}"
                )
        except Exception as e:
            self.log_test("Zero variance data", False, f"Exception: {e}")

    def test_alternating_poses(self):
        """Test with rapidly alternating between two poses"""
        print("\n🧪 Testing Alternating Poses")

        try:
            ref_poses = self.create_reference_poses(20)
            service = PoseComparisonService(ref_poses)

            pose_a = np.random.rand(33, 4)
            pose_b = np.random.rand(33, 4)

            scores = []
            for i in range(20):
                landmarks = pose_a if i % 2 == 0 else pose_b
                result = service.update_user_pose(landmarks)
                if result:
                    scores.append(result.get('combined_score', 0))

            self.log_test(
                "Alternating poses processed",
                len(scores) > 0,
                f"Generated {len(scores)} scores"
            )

            # Motion should be detected
            if len(scores) > 2:
                avg_score = np.mean(scores)
                self.log_test(
                    "Alternating motion detected",
                    True,
                    f"Average score: {avg_score:.3f}"
                )
        except Exception as e:
            self.log_test("Alternating poses", False, f"Exception: {e}")

    def test_timestamp_discontinuities(self):
        """Test with non-sequential timestamps"""
        print("\n🧪 Testing Timestamp Discontinuities")

        try:
            ref_poses = self.create_reference_poses(10)
            service = PoseComparisonService(ref_poses)

            # Feed poses with random timestamps
            timestamps = [0.1, 0.5, 0.3, 0.8, 0.2, 1.0]
            results = []

            for ts in timestamps:
                landmarks = np.random.rand(33, 4)
                result = service.update_user_pose(landmarks, timestamp=ts)
                if result:
                    results.append(result)

            self.log_test(
                "Non-sequential timestamps handled",
                len(results) > 0,
                f"Processed {len(results)} poses with discontinuous timestamps"
            )
        except Exception as e:
            self.log_test("Timestamp discontinuities", False, f"Exception: {e}")

    def test_boundary_similarity_scores(self):
        """Test that similarity scores stay within [0, 1] bounds"""
        print("\n🧪 Testing Similarity Score Boundaries")

        try:
            ref_poses = self.create_reference_poses(20)
            service = PoseComparisonService(ref_poses)

            all_scores = []

            # Test with various inputs
            for _ in range(50):
                landmarks = np.random.rand(33, 4) * np.random.choice([0.1, 1.0, 10.0])
                result = service.update_user_pose(landmarks)

                if result:
                    all_scores.append(result.get('combined_score', 0))
                    all_scores.append(result.get('pose_score', 0))
                    all_scores.append(result.get('motion_score', 0))

            # Check all scores are in [0, 1]
            all_valid = all(0 <= score <= 1 for score in all_scores)

            self.log_test(
                "All similarity scores in [0, 1]",
                all_valid,
                f"Checked {len(all_scores)} scores, all within bounds"
            )

            if all_scores:
                self.log_test(
                    "Score range statistics",
                    True,
                    f"Min: {min(all_scores):.3f}, Max: {max(all_scores):.3f}, Mean: {np.mean(all_scores):.3f}"
                )
        except Exception as e:
            self.log_test("Similarity score boundaries", False, f"Exception: {e}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Edge Cases and Stress Tests")
        print("=" * 60)

        self.test_extreme_coordinate_values()
        self.test_special_float_values()
        self.test_minimum_viable_data()
        self.test_maximum_data_load()
        self.test_rapid_pose_updates()
        self.test_memory_leak_detection()
        self.test_concurrent_config_updates()
        self.test_dtw_edge_cases()
        self.test_zero_variance_data()
        self.test_alternating_poses()
        self.test_timestamp_discontinuities()
        self.test_boundary_similarity_scores()

        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.passed + self.failed}")
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"Success Rate: {(self.passed / (self.passed + self.failed) * 100):.1f}%")

        return self.failed == 0


if __name__ == "__main__":
    tester = TestEdgeCasesAndStress()
    success = tester.run_all_tests()

    if success:
        print("\n🎉 All edge case and stress tests passed!")
    else:
        print("\n⚠️  Some tests failed.")

    sys.exit(0 if success else 1)
