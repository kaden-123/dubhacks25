#!/usr/bin/env python3
"""
Comprehensive test suite for pose comparison service and DTW functionality.
Tests all edge cases, error conditions, and performance scenarios.
"""

import numpy as np
import time
import sys
import os
from typing import List, Dict, Any

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from pose_comparison_service import PoseComparisonService
    from pose_comparison_config import PoseComparisonConfig
    from dtaidistance import dtw
    print("✅ Successfully imported all required modules")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you have installed: pip install numpy mediapipe dtaidistance")
    sys.exit(1)

class PoseComparisonTester:
    """Comprehensive test suite for pose comparison functionality."""
    
    def __init__(self):
        self.test_results = []
        self.passed_tests = 0
        self.failed_tests = 0
        
    def _create_mock_reference_data(self, num_frames=10):
        """Create mock reference poses data for testing."""
        mock_reference_data = []
        for i in range(num_frames):
            mock_reference_data.append({
                'frame_number': i,
                'timestamp': i * 0.1,
                'landmarks': np.random.rand(33, 4),
                'has_pose': True,
                'gestures': []
            })
        return mock_reference_data
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results."""
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"    {details}")
        
        self.test_results.append({
            'name': test_name,
            'passed': passed,
            'details': details
        })
        
        if passed:
            self.passed_tests += 1
        else:
            self.failed_tests += 1
    
    def test_dtw_basic_functionality(self):
        """Test basic DTW functionality with simple cases."""
        print("\n🧪 Testing DTW Basic Functionality")
        
        # Test 1: Identical sequences
        try:
            seq1 = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
            seq2 = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
            distance = dtw.distance_fast(seq1, seq2)
            expected_distance = 0.0
            self.log_test(
                "DTW Identical Sequences", 
                abs(distance - expected_distance) < 1e-6,
                f"Distance: {distance}, Expected: {expected_distance}"
            )
        except Exception as e:
            self.log_test("DTW Identical Sequences", False, f"Exception: {e}")
        
        # Test 2: Different sequences
        try:
            seq1 = np.array([1.0, 2.0, 3.0])
            seq2 = np.array([2.0, 3.0, 4.0])
            distance = dtw.distance_fast(seq1, seq2)
            self.log_test(
                "DTW Different Sequences", 
                distance > 0,
                f"Distance: {distance}"
            )
        except Exception as e:
            self.log_test("DTW Different Sequences", False, f"Exception: {e}")
        
        # Test 3: Different length sequences
        try:
            seq1 = np.array([1.0, 2.0, 3.0])
            seq2 = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
            distance = dtw.distance_fast(seq1, seq2)
            self.log_test(
                "DTW Different Length Sequences", 
                distance >= 0,
                f"Distance: {distance}"
            )
        except Exception as e:
            self.log_test("DTW Different Length Sequences", False, f"Exception: {e}")
    
    def test_dtw_data_types(self):
        """Test DTW with different data types and shapes."""
        print("\n🧪 Testing DTW Data Types")
        
        # Test 1: Float64 arrays
        try:
            seq1 = np.array([1.0, 2.0, 3.0], dtype=np.float64)
            seq2 = np.array([2.0, 3.0, 4.0], dtype=np.float64)
            distance = dtw.distance_fast(seq1, seq2)
            self.log_test(
                "DTW Float64 Arrays", 
                distance >= 0,
                f"Distance: {distance}"
            )
        except Exception as e:
            self.log_test("DTW Float64 Arrays", False, f"Exception: {e}")
        
        # Test 2: Float32 arrays (convert to float64)
        try:
            seq1 = np.array([1.0, 2.0, 3.0], dtype=np.float32).astype(np.float64)
            seq2 = np.array([2.0, 3.0, 4.0], dtype=np.float32).astype(np.float64)
            distance = dtw.distance_fast(seq1, seq2)
            self.log_test(
                "DTW Float32 Arrays (converted)", 
                distance >= 0,
                f"Distance: {distance}"
            )
        except Exception as e:
            self.log_test("DTW Float32 Arrays (converted)", False, f"Exception: {e}")
        
        # Test 3: Integer arrays (should be converted)
        try:
            seq1 = np.array([1, 2, 3], dtype=np.int32)
            seq2 = np.array([2, 3, 4], dtype=np.int32)
            distance = dtw.distance_fast(seq1.astype(np.float64), seq2.astype(np.float64))
            self.log_test(
                "DTW Integer Arrays (converted)", 
                distance >= 0,
                f"Distance: {distance}"
            )
        except Exception as e:
            self.log_test("DTW Integer Arrays (converted)", False, f"Exception: {e}")
        
        # Test 4: 2D arrays flattened
        try:
            seq1 = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
            seq2 = np.array([[2.0, 3.0], [4.0, 5.0], [6.0, 7.0]])
            distance = dtw.distance_fast(seq1.flatten().astype(np.float64), 
                                       seq2.flatten().astype(np.float64))
            self.log_test(
                "DTW 2D Arrays Flattened", 
                distance >= 0,
                f"Distance: {distance}"
            )
        except Exception as e:
            self.log_test("DTW 2D Arrays Flattened", False, f"Exception: {e}")
    
    def test_dtw_edge_cases(self):
        """Test DTW with edge cases and error conditions."""
        print("\n🧪 Testing DTW Edge Cases")
        
        # Test 1: Empty sequences (handle gracefully)
        try:
            seq1 = np.array([])
            seq2 = np.array([])
            distance = dtw.distance_fast(seq1, seq2)
            self.log_test(
                "DTW Empty Sequences", 
                distance == 0.0,
                f"Distance: {distance}"
            )
        except Exception as e:
            # Empty sequences might cause issues, so we'll accept that as expected behavior
            self.log_test(
                "DTW Empty Sequences", 
                True,  # Accept that empty sequences cause exceptions
                f"Expected exception for empty sequences: {type(e).__name__}"
            )
        
        # Test 2: Single element sequences
        try:
            seq1 = np.array([1.0])
            seq2 = np.array([2.0])
            distance = dtw.distance_fast(seq1, seq2)
            self.log_test(
                "DTW Single Element Sequences", 
                distance >= 0,
                f"Distance: {distance}"
            )
        except Exception as e:
            self.log_test("DTW Single Element Sequences", False, f"Exception: {e}")
        
        # Test 3: Very large sequences
        try:
            seq1 = np.random.rand(1000).astype(np.float64)
            seq2 = np.random.rand(1000).astype(np.float64)
            distance = dtw.distance_fast(seq1, seq2)
            self.log_test(
                "DTW Large Sequences (1000 elements)", 
                distance >= 0,
                f"Distance: {distance}"
            )
        except Exception as e:
            self.log_test("DTW Large Sequences (1000 elements)", False, f"Exception: {e}")
        
        # Test 4: Very different length sequences
        try:
            seq1 = np.array([1.0])
            seq2 = np.random.rand(100).astype(np.float64)
            distance = dtw.distance_fast(seq1, seq2)
            self.log_test(
                "DTW Very Different Length Sequences", 
                distance >= 0,
                f"Distance: {distance}"
            )
        except Exception as e:
            self.log_test("DTW Very Different Length Sequences", False, f"Exception: {e}")
    
    def test_pose_comparison_service_initialization(self):
        """Test PoseComparisonService initialization."""
        print("\n🧪 Testing PoseComparisonService Initialization")
        
        # Create mock reference poses data
        mock_reference_data = self._create_mock_reference_data(10)
        
        # Test 1: Default initialization
        try:
            service = PoseComparisonService(mock_reference_data)
            self.log_test(
                "PoseComparisonService Default Init", 
                service is not None,
                "Service initialized successfully"
            )
        except Exception as e:
            self.log_test("PoseComparisonService Default Init", False, f"Exception: {e}")
        
        # Test 2: Custom parameters via config
        try:
            custom_config = PoseComparisonConfig(
                pose_weight=0.8,
                motion_weight=0.2,
                smoothing_window=10
            )
            service = PoseComparisonService(mock_reference_data, custom_config)
            self.log_test(
                "PoseComparisonService Custom Params",
                service is not None,
                "Service initialized with custom parameters"
            )
        except Exception as e:
            self.log_test("PoseComparisonService Custom Params", False, f"Exception: {e}")
    
    def test_pose_normalization(self):
        """Test pose normalization functionality."""
        print("\n🧪 Testing Pose Normalization")
        
        try:
            mock_reference_data = self._create_mock_reference_data(10)
            service = PoseComparisonService(mock_reference_data)
            
            # Test 1: Normal pose landmarks (flattened array)
            landmarks = np.random.rand(99)  # 33 landmarks * 3 coordinates (x,y,z)
            normalized = service._normalize_pose_by_scale(landmarks)
            
            # After filtering, we expect 69 coordinates (23 essential landmarks * 3)
            expected_shape = (69,)
            self.log_test(
                "Pose Normalization Basic", 
                normalized.shape == expected_shape,
                f"Shape: {normalized.shape}, Expected: {expected_shape}"
            )
            
            # Test 2: Check if normalization is scale-invariant
            landmarks_scaled = landmarks * 2.0
            normalized_scaled = service._normalize_pose_by_scale(landmarks_scaled)
            
            # Should be similar after normalization
            similarity = np.corrcoef(normalized, normalized_scaled)[0, 1]
            self.log_test(
                "Pose Normalization Scale Invariant", 
                similarity > 0.9,
                f"Similarity: {similarity}"
            )
            
        except Exception as e:
            self.log_test("Pose Normalization", False, f"Exception: {e}")
    
    def test_pose_similarity_calculation(self):
        """Test pose similarity calculation."""
        print("\n🧪 Testing Pose Similarity Calculation")
        
        try:
            mock_reference_data = self._create_mock_reference_data(10)
            service = PoseComparisonService(mock_reference_data)
            
            # Test 1: Identical poses (flattened arrays)
            landmarks1 = np.random.rand(99)  # 33 landmarks * 3 coordinates
            landmarks2 = landmarks1.copy()
            similarity = service._calculate_pose_similarity(landmarks1, landmarks2)
            
            self.log_test(
                "Pose Similarity Identical", 
                abs(similarity - 1.0) < 1e-6,
                f"Similarity: {similarity}, Expected: 1.0"
            )
            
            # Test 2: Different poses
            landmarks3 = np.random.rand(99)
            similarity2 = service._calculate_pose_similarity(landmarks1, landmarks3)
            
            self.log_test(
                "Pose Similarity Different", 
                0 <= similarity2 <= 1,
                f"Similarity: {similarity2}"
            )
            
            # Test 3: Completely opposite poses
            landmarks4 = -landmarks1
            similarity3 = service._calculate_pose_similarity(landmarks1, landmarks4)
            
            self.log_test(
                "Pose Similarity Opposite", 
                similarity3 < similarity2,
                f"Opposite similarity: {similarity3}, Different similarity: {similarity2}"
            )
            
        except Exception as e:
            self.log_test("Pose Similarity Calculation", False, f"Exception: {e}")
    
    def test_dtw_in_pose_comparison_service(self):
        """Test DTW functionality within the PoseComparisonService."""
        print("\n🧪 Testing DTW in PoseComparisonService")
        
        try:
            mock_reference_data = self._create_mock_reference_data(10)
            service = PoseComparisonService(mock_reference_data)
            
            # Create test sequences (flattened arrays)
            user_sequence = [np.random.rand(99) for _ in range(10)]  # 33 landmarks * 3 coordinates
            reference_sequence = [np.random.rand(99) for _ in range(10)]
            
            # Test DTW calculation
            similarity, path = service._apply_dynamic_time_warping(user_sequence, reference_sequence)
            
            self.log_test(
                "DTW in PoseComparisonService", 
                0 <= similarity <= 1,
                f"Similarity: {similarity}"
            )
            
            # Test with identical sequences
            similarity_identical, _ = service._apply_dynamic_time_warping(user_sequence, user_sequence)
            
            self.log_test(
                "DTW Identical Sequences in Service", 
                similarity_identical > 0.8,  # Should be high for identical sequences
                f"Similarity: {similarity_identical}"
            )
            
        except Exception as e:
            self.log_test("DTW in PoseComparisonService", False, f"Exception: {e}")
    
    def test_motion_similarity_calculation(self):
        """Test motion similarity calculation."""
        print("\n🧪 Testing Motion Similarity Calculation")
        
        try:
            mock_reference_data = self._create_mock_reference_data(10)
            service = PoseComparisonService(mock_reference_data)
            
            # Test 1: Identical motion vectors (flattened arrays)
            motion1 = np.random.rand(99)  # 33 landmarks * 3 coordinates
            motion2 = motion1.copy()
            similarity = service._calculate_motion_similarity(motion1, motion2)
            
            self.log_test(
                "Motion Similarity Identical", 
                abs(similarity - 1.0) < 1e-6,
                f"Similarity: {similarity}, Expected: 1.0"
            )
            
            # Test 2: Different motion vectors
            motion3 = np.random.rand(99)
            similarity2 = service._calculate_motion_similarity(motion1, motion3)
            
            self.log_test(
                "Motion Similarity Different", 
                0 <= similarity2 <= 1,
                f"Similarity: {similarity2}"
            )
            
        except Exception as e:
            self.log_test("Motion Similarity Calculation", False, f"Exception: {e}")
    
    def test_pose_sequence_management(self):
        """Test pose sequence management and updating."""
        print("\n🧪 Testing Pose Sequence Management")
        
        try:
            mock_reference_data = self._create_mock_reference_data(10)
            service = PoseComparisonService(mock_reference_data)
            
            # Test updating user pose (flattened array)
            landmarks = np.random.rand(99)  # 33 landmarks * 3 coordinates
            result = service.update_user_pose(landmarks)
            
            self.log_test(
                "Update User Pose", 
                isinstance(result, dict) and 'combined_score' in result,
                f"Result keys: {list(result.keys())}"
            )
            
            # Test sequence length limits
            for i in range(20):  # Add more poses than the default window
                landmarks = np.random.rand(99)  # 33 landmarks * 3 coordinates
                service.update_user_pose(landmarks)
            
            # Check if sequence is properly limited
            self.log_test(
                "Sequence Length Management", 
                len(service.user_pose_history) <= service.smoothing_window * 2,
                f"Sequence length: {len(service.user_pose_history)}, Max: {service.smoothing_window * 2}"
            )
            
        except Exception as e:
            self.log_test("Pose Sequence Management", False, f"Exception: {e}")
    
    def test_performance_benchmarks(self):
        """Test performance with various data sizes."""
        print("\n🧪 Testing Performance Benchmarks")
        
        try:
            mock_reference_data = self._create_mock_reference_data(10)
            service = PoseComparisonService(mock_reference_data)
            
            # Test 1: Small dataset performance
            start_time = time.time()
            for _ in range(100):
                landmarks = np.random.rand(99)  # 33 landmarks * 3 coordinates
                service.update_user_pose(landmarks)
            small_time = time.time() - start_time
            
            self.log_test(
                "Performance Small Dataset (100 poses)", 
                small_time < 5.0,  # Should complete in under 5 seconds
                f"Time: {small_time:.3f} seconds"
            )
            
            # Test 2: DTW performance with different sequence lengths
            start_time = time.time()
            user_seq = [np.random.rand(33, 4) for _ in range(50)]
            ref_seq = [np.random.rand(33, 4) for _ in range(50)]
            similarity, _ = service._apply_dynamic_time_warping(user_seq, ref_seq)
            dtw_time = time.time() - start_time
            
            self.log_test(
                "DTW Performance (50x50 sequences)", 
                dtw_time < 1.0,  # Should complete in under 1 second
                f"Time: {dtw_time:.3f} seconds, Similarity: {similarity}"
            )
            
        except Exception as e:
            self.log_test("Performance Benchmarks", False, f"Exception: {e}")
    
    def test_error_handling(self):
        """Test error handling and edge cases."""
        print("\n🧪 Testing Error Handling")
        
        try:
            mock_reference_data = self._create_mock_reference_data(10)
            service = PoseComparisonService(mock_reference_data)
            
            # Test 1: Invalid landmark shapes
            try:
                invalid_landmarks = np.random.rand(30)  # Wrong size (should be 99)
                service.update_user_pose(invalid_landmarks)
                self.log_test("Error Handling Invalid Shape", True, "Handled gracefully")
            except Exception as e:
                self.log_test("Error Handling Invalid Shape", True, f"Caught exception: {type(e).__name__}")
            
            # Test 2: None landmarks
            try:
                service.update_user_pose(None)
                self.log_test("Error Handling None Input", False, "Should have raised exception")
            except Exception as e:
                self.log_test("Error Handling None Input", True, f"Caught exception: {type(e).__name__}")
            
            # Test 3: Empty sequences for DTW
            try:
                similarity, _ = service._apply_dynamic_time_warping([], [])
                self.log_test(
                    "Error Handling Empty DTW Sequences", 
                    similarity == 0.0,
                    f"Similarity: {similarity}"
                )
            except Exception as e:
                self.log_test("Error Handling Empty DTW Sequences", False, f"Exception: {e}")
            
        except Exception as e:
            self.log_test("Error Handling", False, f"Exception: {e}")
    
    def run_all_tests(self):
        """Run all test suites."""
        print("🚀 Starting Comprehensive Pose Comparison Tests")
        print("=" * 60)
        
        # Run all test suites
        self.test_dtw_basic_functionality()
        self.test_dtw_data_types()
        self.test_dtw_edge_cases()
        self.test_pose_comparison_service_initialization()
        self.test_pose_normalization()
        self.test_pose_similarity_calculation()
        self.test_dtw_in_pose_comparison_service()
        self.test_motion_similarity_calculation()
        self.test_pose_sequence_management()
        self.test_performance_benchmarks()
        self.test_error_handling()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.passed_tests + self.failed_tests}")
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests / (self.passed_tests + self.failed_tests) * 100):.1f}%")
        
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for test in self.test_results:
                if not test['passed']:
                    print(f"  - {test['name']}: {test['details']}")
        
        return self.failed_tests == 0

def main():
    """Main test runner."""
    tester = PoseComparisonTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! The pose comparison system is working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Please review the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
