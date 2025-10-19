# Testing Guide - Live Feedback Service

## Quick Start

### 1. Install Testing Dependencies

```bash
pip install pytest pytest-cov
```

### 2. Run the Test Template

```bash
# From the backend directory
pytest tests/test_live_feedback_template.py -v
```

You'll see output like:
```
tests/test_live_feedback_template.py::TestSnapshotData::test_create_basic_snapshot PASSED
tests/test_live_feedback_template.py::TestFeedbackContext::test_context_starts_empty PASSED
...
```

---

## Testing Files Overview

| File | Purpose |
|------|---------|
| `test_live_feedback_template.py` | Template with TODO comments for you to fill in |
| `test_scoring.py` | Tests for ScoringService (create this next) |
| `test_integration.py` | End-to-end integration tests (optional) |

---

## How to Write Your First Test

### Step 1: Open the Template

Open `tests/test_live_feedback_template.py`

### Step 2: Find a TODO Test

Look for a test with `# TODO: Write your test here`:

```python
def test_context_starts_empty(self):
    """
    TODO: Test that a new FeedbackContext initializes with empty state.
    """
    # TODO: Write your test here
    pass
```

### Step 3: Follow the Instructions

Each test has detailed instructions in the docstring. For example:

```python
def test_context_starts_empty(self):
    """
    TODO: Test that a new FeedbackContext initializes with empty state.

    Instructions:
    1. Create a new FeedbackContext()
    2. Assert that recent_snapshots is empty (length 0)
    3. Assert that recent_feedback is empty
    4. Assert that performance_trend is "stable" (default)
    5. Assert that persistent_issues is empty
    """
    # Your implementation:
    context = FeedbackContext()

    assert len(context.recent_snapshots) == 0
    assert len(context.recent_feedback) == 0
    assert context.performance_trend == "stable"
    assert len(context.persistent_issues) == 0
```

### Step 4: Run Your Test

```bash
pytest tests/test_live_feedback_template.py::TestFeedbackContext::test_context_starts_empty -v
```

If it passes, you'll see:
```
PASSED ✓
```

---

## Testing Without Calling OpenAI API

**IMPORTANT**: Never make real API calls in tests!

### Why?
- ❌ Costs money
- ❌ Slow (1-2 seconds per call)
- ❌ Requires internet connection
- ❌ Can hit rate limits
- ❌ Non-deterministic (LLM responses vary)

### Solution: Mock the API

Use `monkeypatch` to replace the real API with a fake one:

```python
def test_generate_feedback(self, service, poor_snapshot, monkeypatch):
    # Create a fake OpenAI response
    def mock_openai_response(*args, **kwargs):
        class MockResponse:
            class MockChoice:
                class MockMessage:
                    content = "Great job dancing!"  # Fake LLM response
                message = MockMessage()
            choices = [MockChoice()]
        return MockResponse()

    # Replace real API with fake
    monkeypatch.setattr(
        service.client.chat.completions,
        "create",
        mock_openai_response
    )

    # Now when service calls OpenAI, it gets our fake response
    feedback = service.process_snapshot(poor_snapshot)

    assert feedback is not None
    assert "Great job dancing!" in feedback["feedback_text"]
```

---

## Simple Integration Test Example

Create a new file `tests/test_simple_integration.py`:

```python
"""
Simple integration test - tests the full flow without mocking.

NOTE: This test does NOT call the real OpenAI API.
We still mock it, but we test the entire flow from snapshot → feedback.
"""
import pytest
from app.services.live_feedback_service import LiveFeedbackService, SnapshotData


def test_full_feedback_flow(monkeypatch):
    """
    Test the complete flow from snapshot input to feedback output.

    This is an "integration test" - it tests multiple components working together.
    """
    # Setup: Mock API key and OpenAI client
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    def mock_openai(*args, **kwargs):
        class MockResponse:
            class MockChoice:
                class MockMessage:
                    content = "Your left arm needs to extend more. Keep your elbow straight!"
                message = MockMessage()
            choices = [MockChoice()]
        return MockResponse()

    service = LiveFeedbackService()
    monkeypatch.setattr(service.client.chat.completions, "create", mock_openai)

    # Create a realistic snapshot with poor performance
    snapshot = SnapshotData(
        timestamp=5.5,
        frame_base64="fake_image_data",
        pose_similarity=0.58,
        motion_similarity=0.62,
        combined_score=0.60,
        errors=[
            {
                "body_part": "left_elbow",
                "expected_angle": 145,
                "actual_angle": 95,
                "difference": 50
            }
        ],
        best_match_idx=55,
        reference_timestamp=5.6,
        timing_offset=-0.1
    )

    # Act: Process the snapshot
    feedback = service.process_snapshot(snapshot)

    # Assert: Verify complete feedback structure
    assert feedback is not None
    assert feedback["timestamp"] == 5.5
    assert "left arm" in feedback["feedback_text"].lower()
    assert feedback["severity"] in ["high", "medium", "low"]
    assert "left_elbow" in feedback["focus_areas"]
    assert "average_score" in feedback["context"]

    # Verify statistics were tracked
    stats = service.get_statistics()
    assert stats["total_snapshots_processed"] == 1
    assert stats["total_feedback_generated"] == 1
    assert stats["total_llm_calls"] == 1
    assert stats["total_llm_errors"] == 0
```

Run it:
```bash
pytest tests/test_simple_integration.py -v -s
```

---

## Common Testing Patterns

### Pattern 1: Test Setup (Arrange)

```python
# Create test data
snapshot = SnapshotData(
    timestamp=1.0,
    frame_base64="test",
    pose_similarity=0.6,
    motion_similarity=0.6,
    combined_score=0.6
)
```

### Pattern 2: Test Action (Act)

```python
# Call the method you're testing
result = service.process_snapshot(snapshot)
```

### Pattern 3: Test Verification (Assert)

```python
# Verify the result
assert result is not None
assert result["timestamp"] == 1.0
assert result["severity"] == "medium"
```

---

## Testing Checklist

When testing LiveFeedbackService, make sure you test:

- [ ] Service initialization
- [ ] Good performance (no feedback needed)
- [ ] Poor performance (feedback generated)
- [ ] Fallback when LLM fails
- [ ] Severity calculation (high/medium/low)
- [ ] Context tracking (rolling window)
- [ ] Trend detection (improving/degrading/stable)
- [ ] Persistent issue detection
- [ ] Force feedback parameter
- [ ] Reset functionality
- [ ] Statistics tracking
- [ ] Prompt building (includes score, errors, timing)

---

## Running Tests

### Run All Tests
```bash
pytest tests/ -v
```

### Run Specific Test File
```bash
pytest tests/test_live_feedback_template.py -v
```

### Run Specific Test Class
```bash
pytest tests/test_live_feedback_template.py::TestLiveFeedbackService -v
```

### Run Specific Test Method
```bash
pytest tests/test_live_feedback_template.py::TestLiveFeedbackService::test_service_initialization -v
```

### Run with Coverage Report
```bash
pytest tests/ --cov=app.services.live_feedback_service --cov-report=html
```

Then open `htmlcov/index.html` to see which lines of code are tested.

### Run with Print Statements Visible
```bash
pytest tests/ -v -s
```

---

## Debugging Failed Tests

### 1. Read the Error Message

Pytest shows you exactly what failed:

```
AssertionError: assert 'high' == 'medium'
  + high
  - medium
```

### 2. Add Print Statements

```python
def test_severity(self, service):
    snapshot = SnapshotData(...)
    severity = service._calculate_severity(snapshot)

    print(f"Snapshot score: {snapshot.combined_score}")
    print(f"Calculated severity: {severity}")

    assert severity == "medium"
```

Run with `-s` to see prints:
```bash
pytest tests/test_live_feedback_template.py::test_severity -v -s
```

### 3. Use Debugger

```bash
pytest tests/test_live_feedback_template.py --pdb
```

When a test fails, you'll drop into an interactive debugger where you can:
- Inspect variables
- Step through code
- Try different values

---

## What to Test Next

After completing the live feedback tests, create tests for:

### 1. ScoringService (`test_scoring.py`)

```python
def test_add_score():
    """Test that scores are recorded correctly."""
    service = ScoringService()
    service.add_score(timestamp=1.0, combined_score=0.8)
    assert len(service.score_records) == 1

def test_get_timeline():
    """Test timeline generation."""
    service = ScoringService()
    # Add scores...
    timeline = service.get_timeline()
    assert len(timeline) > 0

def test_identify_problem_areas():
    """Test problem area detection."""
    service = ScoringService()
    # Add low scores...
    problems = service.identify_problem_areas(threshold=0.65)
    assert len(problems) > 0
```

### 2. Integration Tests (`test_integration.py`)

Test multiple services working together:

```python
def test_live_feedback_with_scoring():
    """Test that live feedback and scoring work together."""
    live_service = LiveFeedbackService()
    scoring_service = ScoringService()

    # Process snapshot
    feedback = live_service.process_snapshot(snapshot)

    # Record score
    scoring_service.add_score(...)

    # Verify both worked
    assert feedback is not None
    assert len(scoring_service.score_records) > 0
```

---

## Resources

- **Pytest Documentation**: https://docs.pytest.org/
- **Python Mock/Patch Guide**: https://docs.python.org/3/library/unittest.mock.html
- **Test-Driven Development (TDD)**: Write tests before code!

---

## Tips for Success

1. **Start Simple**: Begin with easy tests (initialization, basic data)
2. **One Test at a Time**: Don't try to write all tests at once
3. **Run Frequently**: Run tests after each change to catch errors early
4. **Read Error Messages**: Pytest gives great error messages - read them carefully
5. **Use Fixtures**: Reuse common test data with fixtures
6. **Mock External Calls**: Always mock OpenAI API, file I/O, network requests
7. **Test Edge Cases**: Empty data, extreme values, missing fields
8. **Keep Tests Fast**: Tests should run in milliseconds, not seconds

---

## Example Test Session

```bash
# 1. Write a test
# Edit test_live_feedback_template.py, fill in test_context_starts_empty

# 2. Run the test
pytest tests/test_live_feedback_template.py::TestFeedbackContext::test_context_starts_empty -v

# 3. If it fails, read the error and fix it

# 4. If it passes, move to the next test

# 5. Repeat until all tests pass!
```

Good luck testing! 🧪✨
