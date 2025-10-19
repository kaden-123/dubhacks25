# Quick Test Reference Card

## 🚀 Get Started in 3 Steps

### 1. Install pytest
```bash
pip install pytest
```

### 2. Open the template
```
backend/tests/test_live_feedback_template.py
```

### 3. Fill in a TODO test and run it
```bash
pytest tests/test_live_feedback_template.py -v
```

---

## 📝 Basic Test Structure

```python
def test_something(self, service):
    # ARRANGE: Set up test data
    snapshot = SnapshotData(timestamp=1.0, ...)

    # ACT: Call the method
    result = service.process_snapshot(snapshot)

    # ASSERT: Check the result
    assert result is not None
```

---

## 🎭 Mock OpenAI API (Copy-Paste This!)

```python
def test_with_mock_llm(self, service, monkeypatch):
    # Define the mock response
    def mock_openai_response(*args, **kwargs):
        class MockResponse:
            class MockChoice:
                class MockMessage:
                    content = "Your fake LLM response here!"
                message = MockMessage()
            choices = [MockChoice()]
        return MockResponse()

    # Apply the mock
    monkeypatch.setattr(
        service.client.chat.completions,
        "create",
        mock_openai_response
    )

    # Now call the service - it will use your mock instead of real API
    result = service.process_snapshot(snapshot)
```

---

## 🎯 Common Assertions

```python
# Check equality
assert result == expected

# Check not None
assert result is not None

# Check None
assert result is None

# Check in list/dict
assert "left_elbow" in result["focus_areas"]

# Check length
assert len(result) == 5

# Check greater/less than
assert result > 0.5
assert result < 1.0

# Check type
assert isinstance(result, dict)

# Check contains substring
assert "extend your arm" in result["feedback_text"]
```

---

## 📦 Create Test Data

### Simple Snapshot (Good Performance)
```python
good_snapshot = SnapshotData(
    timestamp=1.0,
    frame_base64="fake_data",
    pose_similarity=0.85,
    motion_similarity=0.80,
    combined_score=0.83,
    errors=[]  # No errors
)
```

### Poor Performance Snapshot
```python
poor_snapshot = SnapshotData(
    timestamp=2.0,
    frame_base64="fake_data",
    pose_similarity=0.55,
    motion_similarity=0.50,
    combined_score=0.53,
    errors=[
        {
            "body_part": "left_elbow",
            "expected_angle": 145,
            "actual_angle": 95,
            "difference": 50
        }
    ]
)
```

---

## 🏃 Run Tests (Command Cheatsheet)

```bash
# All tests
pytest tests/ -v

# Specific file
pytest tests/test_live_feedback_template.py -v

# Specific class
pytest tests/test_live_feedback_template.py::TestLiveFeedbackService -v

# Specific test
pytest tests/test_live_feedback_template.py::TestLiveFeedbackService::test_service_initialization -v

# Show print statements
pytest tests/ -v -s

# Stop on first failure
pytest tests/ -x

# Run only failed tests from last run
pytest --lf

# Show coverage
pytest tests/ --cov=app.services.live_feedback_service
```

---

## 🧩 Pytest Fixtures (Reusable Setup)

### Using a Fixture
```python
@pytest.fixture
def my_service(self):
    """Create a service for testing."""
    return LiveFeedbackService()

def test_something(self, my_service):  # <- Auto-injected!
    result = my_service.process_snapshot(...)
```

### Built-in Fixtures in Template
- `service` - LiveFeedbackService instance
- `good_snapshot` - High-performing snapshot
- `poor_snapshot` - Low-performing snapshot
- `monkeypatch` - For mocking (provided by pytest)

---

## 🐛 Debug Failed Tests

### Read the Output
```
FAILED test_something - AssertionError: assert 'high' == 'medium'
```

### Add Print Statements
```python
def test_something(self):
    result = calculate_severity(snapshot)
    print(f"DEBUG: result = {result}")  # Add this
    assert result == "medium"
```

Run with `-s` to see prints:
```bash
pytest tests/test_something.py -v -s
```

### Use Debugger
```bash
pytest tests/test_something.py --pdb
```

---

## ✅ Test Checklist

Copy this into your test file and check off as you complete:

```python
"""
Testing Checklist:
- [ ] Service initializes correctly
- [ ] Good performance (no feedback)
- [ ] Poor performance (generates feedback)
- [ ] Fallback when LLM fails
- [ ] Severity: high
- [ ] Severity: medium
- [ ] Severity: low
- [ ] Context window limit (keeps last 6)
- [ ] Trend: improving
- [ ] Trend: degrading
- [ ] Persistent issue detection
- [ ] Force feedback parameter
- [ ] Reset clears context
- [ ] Statistics tracking
- [ ] Prompt includes score
- [ ] Prompt includes errors
- [ ] Prompt includes timing
"""
```

---

## 🎓 Example Complete Test

```python
def test_poor_performance_generates_feedback(self, service, monkeypatch):
    """Test that poor performance triggers feedback generation."""

    # ARRANGE: Mock the OpenAI API
    def mock_llm(*args, **kwargs):
        class MockResponse:
            class MockChoice:
                class MockMessage:
                    content = "Extend your left arm more!"
                message = MockMessage()
            choices = [MockChoice()]
        return MockResponse()

    monkeypatch.setattr(service.client.chat.completions, "create", mock_llm)

    # Create a poor-performing snapshot
    snapshot = SnapshotData(
        timestamp=2.0,
        frame_base64="fake_image",
        pose_similarity=0.55,
        motion_similarity=0.50,
        combined_score=0.53,
        errors=[{"body_part": "left_elbow", "difference": 50}]
    )

    # ACT: Process the snapshot
    feedback = service.process_snapshot(snapshot)

    # ASSERT: Verify feedback was generated
    assert feedback is not None
    assert feedback["timestamp"] == 2.0
    assert "Extend your left arm more!" in feedback["feedback_text"]
    assert feedback["severity"] in ["high", "medium", "low"]
    assert "left_elbow" in feedback["focus_areas"]
    assert service.total_feedback_generated == 1
```

---

## 📚 Key Files

| File | What It Is |
|------|------------|
| `test_live_feedback_template.py` | Your main test template (fill in TODOs) |
| `live_feedback_service.py` | The code you're testing |
| `TESTING_GUIDE.md` | Detailed testing guide |
| `QUICK_TEST_REFERENCE.md` | This file! |

---

## 💡 Pro Tips

1. **Write tests as you code** - Don't wait until the end
2. **Test one thing per test** - Keep tests focused
3. **Use descriptive test names** - `test_poor_performance_triggers_feedback` not `test1`
4. **Always mock OpenAI** - Never make real API calls in tests
5. **Run tests frequently** - Catch bugs early
6. **Read pytest output** - Error messages are helpful!
7. **Keep tests fast** - Should run in milliseconds

---

## 🆘 Common Errors & Fixes

### Error: `ModuleNotFoundError: No module named 'app'`
**Fix**: Run pytest from the `backend` directory
```bash
cd backend
pytest tests/
```

### Error: `ValueError: OpenAI API key not found`
**Fix**: You forgot to mock the environment variable
```python
monkeypatch.setenv("OPENAI_API_KEY", "test-key")
```

### Error: Test times out or is very slow
**Fix**: You're calling the real OpenAI API! Add mocking.

### Error: `assert None is not None`
**Fix**: The method returned None. Check your test logic or service code.

---

## 🎯 Your First Test (Step-by-Step)

1. Open `test_live_feedback_template.py`

2. Find `test_context_starts_empty` in the `TestFeedbackContext` class

3. Replace `pass` with:
```python
context = FeedbackContext()
assert len(context.recent_snapshots) == 0
assert len(context.recent_feedback) == 0
assert context.performance_trend == "stable"
assert len(context.persistent_issues) == 0
```

4. Run it:
```bash
pytest tests/test_live_feedback_template.py::TestFeedbackContext::test_context_starts_empty -v
```

5. See it pass! ✅

6. Move to the next TODO test!

---

## 🎉 You're Ready!

Open `test_live_feedback_template.py` and start filling in the TODOs.

Each test has:
- ✅ Clear instructions in the docstring
- ✅ Hints about what to check
- ✅ Examples in the comments

**Happy Testing!** 🧪
