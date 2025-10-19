# Pose Comparison Test Suite

Comprehensive test coverage for the pose comparison and dance analysis system.

## Test Files

### 1. `test_angle_calculator.py`
Tests for the AngleCalculator service:
- ✅ Basic angle calculations (90°, 180°, etc.)
- ✅ Arm angle validation with array length checks
- ✅ Leg angle validation with array length checks
- ✅ Body posture angles (shoulder tilt, hip tilt, body lean)
- ✅ Hand angle calculations
- ✅ Complete pose angle integration
- ✅ Key landmark extraction
- ✅ Angle summary generation
- ✅ Edge cases (NaN values, zero-length vectors, large coordinates)

**Run**: `python test_angle_calculator.py`

### 2. `test_motion_and_timing.py`
Tests for motion analysis and temporal synchronization:
- ✅ Motion vector calculation between frames
- ✅ Motion similarity with identical patterns
- ✅ Different movement speeds detection
- ✅ Motion weight impact on scoring
- ✅ Temporal alignment with different frame rates
- ✅ Static vs dynamic pose detection
- ✅ Motion smoothing over time
- ✅ Motion direction sensitivity
- ✅ Velocity magnitude calculations
- ✅ Noisy data handling
- ✅ Freeze frame detection

**Run**: `python test_motion_and_timing.py`

### 3. `test_integration_api.py`
Tests for API integration and data flow:
- ✅ Image base64 encoding/decoding
- ✅ Request payload structures (ImageSnapshotRequest, LoadReferenceRequest, etc.)
- ✅ Response payload structures (ProcessSnapshotResponse)
- ✅ Session lifecycle management
- ✅ Feedback generation logic
- ✅ Error response handling
- ✅ Configuration update validation
- ✅ Preset configurations
- ✅ Session summary calculations
- ✅ Landmark data format consistency
- ✅ Health check responses

**Run**: `python test_integration_api.py`

### 4. `test_pose_comparison.py`
Comprehensive tests for pose comparison and DTW:
- ✅ DTW basic functionality (identical/different sequences)
- ✅ DTW with different data types (float32, float64, int)
- ✅ DTW edge cases (empty sequences, single elements, large sequences)
- ✅ PoseComparisonService initialization
- ✅ Pose normalization and scale invariance
- ✅ Pose similarity calculations
- ✅ DTW integration in service
- ✅ Motion similarity calculations
- ✅ Pose sequence management
- ✅ Performance benchmarks
- ✅ Error handling

**Run**: `python test_pose_comparison.py`

### 5. `test_exact_reference_comparison.py`
Tests comparing exact reference video to itself:
- ✅ Exact reference comparison with multiple configs
- ✅ Configuration updates at runtime
- ✅ Timestamp presence in results
- ✅ Score validation for identical poses

**Run**: `python test_exact_reference_comparison.py`

## Running All Tests

### Quick Run
```bash
python run_all_tests.py
```

### Run Individual Test Suites
```bash
# Angle calculator tests
python test_angle_calculator.py

# Motion and timing tests
python test_motion_and_timing.py

# API integration tests
python test_integration_api.py

# Pose comparison tests
python test_pose_comparison.py

# Exact reference tests
python test_exact_reference_comparison.py
```

## Test Coverage

### Core Functionality
- ✅ Pose landmark processing
- ✅ Angle calculations for all body parts
- ✅ Motion vector analysis
- ✅ Pose similarity metrics
- ✅ Motion similarity metrics
- ✅ Dynamic Time Warping (DTW)

### Data Validation
- ✅ Input array size validation
- ✅ Landmark format consistency
- ✅ Configuration parameter validation
- ✅ Request/response structure validation

### Edge Cases
- ✅ Empty/null inputs
- ✅ Malformed data
- ✅ Extreme values (NaN, infinity, very large)
- ✅ Different array lengths
- ✅ Noisy data
- ✅ Zero-length vectors

### Performance
- ✅ Processing speed benchmarks
- ✅ DTW performance with large sequences
- ✅ Memory management (deque limits)
- ✅ Smoothing window efficiency

### Integration
- ✅ End-to-end data flow
- ✅ Session management
- ✅ Configuration updates
- ✅ Error handling and recovery

## Expected Results

All tests should pass with:
- **Success Rate**: > 95%
- **Total Tests**: ~100+ individual test cases
- **Duration**: < 30 seconds for all tests

## Troubleshooting

### Common Issues

**Import Errors**
```bash
# Make sure you're in the correct directory
cd /Users/kadenwu/Workspace/dubhacks25/backend/app/services/tests

# Install required dependencies
pip install numpy mediapipe dtaidistance pillow
```

**File Not Found Errors**
```bash
# Ensure test data exists
ls ../data/processed_poses/test_poses.npy

# If missing, process a test video first
cd ..
python process_video_pose.py
```

**DTW Library Issues**
```bash
# Reinstall dtaidistance
pip uninstall dtaidistance
pip install dtaidistance
```

## Test Output Format

Each test outputs:
- ✅ **PASS** - Test succeeded
- ❌ **FAIL** - Test failed with details

Final summary includes:
- Total tests run
- Pass/fail counts
- Success rate percentage
- Failed test details

## Adding New Tests

To add new test cases:

1. Create a new test file or add to existing file
2. Follow the test class pattern:
   ```python
   class TestYourFeature:
       def __init__(self):
           self.passed = 0
           self.failed = 0

       def log_test(self, name, passed, details=""):
           # Log test results
           ...

       def test_your_feature(self):
           # Your test logic
           ...

       def run_all_tests(self):
           # Run all test methods
           ...
   ```
3. Add to `run_all_tests.py` if creating a new file

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    cd backend/app/services/tests
    python run_all_tests.py
```

## Coverage Goals

- **Angle Calculator**: 100% method coverage
- **Motion Analysis**: 95%+ coverage
- **Pose Comparison**: 95%+ coverage
- **API Integration**: 90%+ coverage
- **DTW**: 100% edge case coverage
