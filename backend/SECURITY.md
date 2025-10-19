# 🔒 SECURITY REQUIREMENTS - K-Pop Dance Trainer Backend

## ⚠️ CRITICAL: OpenAI API Security

### **ABSOLUTE REQUIREMENT: OpenAI MUST REMAIN INTERNAL TO BACKEND**

The OpenAI API client and all LLM interactions **MUST NEVER** be exposed to the frontend, API responses, or any external system.

---

## 🚫 WHAT IS FORBIDDEN

### ❌ **NEVER EXPOSE:**

1. **OpenAI API Key**
   - Never send to frontend
   - Never include in API responses
   - Never log to console/files in production
   - Never commit to git (use `.env` only)

2. **OpenAI Client Instance**
   - Never return `openai.Client` object in API responses
   - Never serialize client state
   - Never expose client methods to API

3. **Raw LLM Prompts**
   - Never send prompt templates to frontend
   - Never include system prompts in responses
   - Never expose prompt engineering logic

4. **Raw LLM Responses**
   - Never return full OpenAI API response objects
   - Only return **processed feedback text**
   - Strip all metadata, tokens, model info

5. **LLM Configuration**
   - Never expose model names in API responses
   - Never expose temperature, max_tokens, or other settings
   - Keep all LLM config internal to backend

---

## ✅ CORRECT ARCHITECTURE

### **Three-Layer Security Model:**

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  - Receives ONLY processed feedback text                   │
│  - No knowledge of OpenAI                                   │
│  - No access to API keys or prompts                         │
└─────────────────────┬───────────────────────────────────────┘
                      │ Clean API responses
                      │ (feedback text only)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER (main.py)                     │
│  - Receives user requests                                   │
│  - Calls internal services                                  │
│  - Returns ONLY processed results                           │
│  - ❌ NEVER exposes service internals                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ Service calls
                      │ (internal only)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              INTERNAL SERVICES LAYER                        │
│  ┌────────────────────────────────────────────┐            │
│  │  LiveFeedbackService                       │            │
│  │  - Creates OpenAI client internally        │            │
│  │  - Builds prompts internally               │            │
│  │  - Calls OpenAI API                        │            │
│  │  - Returns ONLY feedback text              │            │
│  └────────────────────────────────────────────┘            │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │  FeedbackGenerationService                 │            │
│  │  - Creates OpenAI client internally        │            │
│  │  - Builds prompts internally               │            │
│  │  - Calls OpenAI API                        │            │
│  │  - Returns ONLY feedback text              │            │
│  └────────────────────────────────────────────┘            │
│                                                              │
│  🔒 OpenAI Client: PRIVATE to these services               │
│  🔒 API Key: Loaded from .env, NEVER exposed              │
└─────────────────────┬───────────────────────────────────────┘
                      │ API calls
                      │ (authenticated)
                      ▼
            ┌──────────────────┐
            │   OpenAI API     │
            │   (External)     │
            └──────────────────┘
```

---

## 📋 IMPLEMENTATION CHECKLIST

### ✅ Service Layer (INTERNAL)

**LiveFeedbackService (`live_feedback_service.py`)**
- [x] OpenAI client created in `__init__`
- [x] API key loaded from `settings.openai_api_key`
- [x] Client is instance variable (not exposed)
- [x] Returns ONLY feedback dictionaries
- [x] No OpenAI objects in return values

**FeedbackGenerationService (`feedback_generation.py`)**
- [x] OpenAI client created in `__init__`
- [x] API key loaded from `settings.openai_api_key`
- [x] Client is instance variable (not exposed)
- [x] Returns ONLY feedback dictionaries
- [x] No OpenAI objects in return values

### ✅ API Layer (main.py)

**Session Endpoints**
- [x] `POST /api/sessions/snapshot` - Returns processed feedback text only
- [x] `POST /api/sessions/end` - Returns session summary (no OpenAI metadata)
- [x] `GET /api/sessions/summary` - Returns processed summaries only

**What API Returns:**
```python
# ✅ CORRECT - Only processed feedback
{
    "feedback_text": "Extend your left arm more!",
    "severity": "medium",
    "focus_areas": ["left_elbow"]
}

# ❌ WRONG - Never return this
{
    "feedback_text": "...",
    "openai_response": {...},  # ❌ FORBIDDEN
    "model": "gpt-4o-mini",     # ❌ FORBIDDEN
    "prompt": "...",            # ❌ FORBIDDEN
    "api_key": "sk-..."         # ❌ FORBIDDEN!!!
}
```

### ✅ Configuration Layer

**Settings (`app/data/config.py`)**
- [x] API key in environment variable only
- [x] Never returned in API responses
- [x] Never logged in production

**Environment File (`.env`)**
- [x] Contains `OPENAI_API_KEY=sk-...`
- [x] In `.gitignore` (never committed)
- [x] Access restricted to backend only

---

## 🛡️ SECURITY BEST PRACTICES

### 1. **Principle of Least Exposure**
Only return the **minimum necessary information** to the frontend:
- Feedback text
- Severity level
- Focus areas
- Timestamps

### 2. **No Service Serialization**
Never serialize service objects:
```python
# ❌ WRONG
return {"service": live_feedback_service}  # NEVER DO THIS

# ✅ CORRECT
return {"feedback_text": feedback_result["feedback_text"]}
```

### 3. **Error Handling**
Never expose OpenAI errors to frontend:
```python
try:
    feedback = live_feedback_service.process_snapshot(snapshot)
except OpenAIError as e:
    # ❌ WRONG: return {"error": str(e)}

    # ✅ CORRECT: Generic fallback
    return {"feedback_text": "Keep practicing!"}
```

### 4. **Logging Security**
In production, never log:
- API keys
- Full prompts
- Raw OpenAI responses
- Model parameters

```python
# ❌ WRONG
logger.info(f"OpenAI prompt: {full_prompt}")

# ✅ CORRECT
logger.info(f"Generated feedback for timestamp {timestamp}")
```

---

## 🔍 SECURITY AUDIT CHECKLIST

Before deploying, verify:

- [ ] No `openai` imports in `main.py` (API layer)
- [ ] No OpenAI client instantiation outside service classes
- [ ] API responses contain ONLY processed feedback
- [ ] `.env` file in `.gitignore`
- [ ] No hardcoded API keys anywhere
- [ ] Error messages don't leak internal details
- [ ] Logs don't contain sensitive information
- [ ] Frontend has no knowledge of OpenAI usage
- [ ] API documentation doesn't mention OpenAI internals

---

## 🚨 VIOLATION EXAMPLES - NEVER DO THIS

### ❌ Example 1: Exposing Client in API
```python
# FORBIDDEN - Never expose OpenAI client
@app.get("/api/llm-client")  # ❌ NEVER CREATE THIS ENDPOINT
async def get_llm_client():
    return {"client": live_feedback_service.client}  # ❌❌❌
```

### ❌ Example 2: Returning Raw Prompts
```python
# FORBIDDEN - Never return prompts
@app.post("/api/sessions/snapshot")
async def process_snapshot(request):
    prompt = build_prompt(...)
    return {"prompt": prompt}  # ❌❌❌
```

### ❌ Example 3: Exposing API Key
```python
# FORBIDDEN - Never expose API key
@app.get("/api/config")
async def get_config():
    return {
        "openai_api_key": settings.openai_api_key  # ❌❌❌
    }
```

### ❌ Example 4: Frontend Calling OpenAI
```javascript
// FORBIDDEN - Frontend should NEVER call OpenAI
// Frontend should only call YOUR backend API
fetch('https://api.openai.com/v1/...', {  // ❌❌❌
    headers: { 'Authorization': 'Bearer sk-...' }
})
```

---

## ✅ CORRECT IMPLEMENTATION EXAMPLES

### ✅ Example 1: API Endpoint (Correct)
```python
@app.post("/api/sessions/snapshot")
async def process_snapshot(request: ImageSnapshotRequest):
    # Process internally
    result = process_image_snapshot(request.image)

    # Return ONLY processed feedback (no OpenAI metadata)
    return ProcessSnapshotResponse(
        timestamp=result['timestamp'],
        feedback_text=result['live_feedback'],  # ✅ Processed text only
        severity=result.get('severity', 'medium'),
        focus_areas=result.get('focus_areas', [])
    )
```

### ✅ Example 2: Service Call (Correct)
```python
def generate_llm_feedback(image_data: str, comparison_result: Dict) -> str:
    # Create snapshot data
    snapshot_data = SnapshotData(...)

    # Call internal service
    feedback_result = live_feedback_service.process_snapshot(snapshot_data)

    if feedback_result:
        # Return ONLY the text
        return feedback_result.get('feedback_text', 'Keep practicing!')
    else:
        # Fallback
        return "Keep practicing!"
```

---

## 📚 DOCUMENTATION REQUIREMENTS

When documenting the API:

### ✅ **DO Document:**
- API endpoint URLs
- Request/response formats
- Feedback text structure
- Severity levels
- Focus areas

### ❌ **DO NOT Document:**
- OpenAI integration
- LLM model names
- Prompt engineering
- Token limits
- API key location

---

## 🎯 SUMMARY

### **The Golden Rule:**

> **FRONTEND SHOULD HAVE ZERO KNOWLEDGE THAT OPENAI EXISTS**

The frontend only knows:
1. It sends snapshots to `/api/sessions/snapshot`
2. It receives feedback text back
3. The feedback is helpful

The frontend **NEVER** knows:
- That OpenAI is being used
- What prompts are sent
- What models are used
- How the feedback is generated

---

## ⚠️ ENFORCEMENT

**This is a CRITICAL security requirement.**

- Code reviews MUST check for OpenAI exposure
- Any API response containing OpenAI metadata is a **BLOCKER**
- Any frontend code accessing OpenAI is **FORBIDDEN**
- Any logged API keys is a **CRITICAL SECURITY VULNERABILITY**

---

## 📞 Questions?

If you're unsure whether something violates these rules:

**Ask yourself:**
1. "Would the frontend see this?"
2. "Does this reveal OpenAI internals?"
3. "Could this expose the API key?"

If **ANY** answer is "yes" → **DON'T DO IT**

---

**Last Updated:** 2025-01-18
**Severity:** 🔴 CRITICAL
**Non-Negotiable:** YES
