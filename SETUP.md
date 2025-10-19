# Setup Instructions

## Prerequisites
- Python 3.9+ installed
- Node.js 18+ and npm installed
- Git installed

## Initial Setup

### 1. Clone and navigate to project
```bash
git clone <your-repo-url>
cd Dubhacks25
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# IMPORTANT: Edit .env and add your OpenAI API key
# Get API key from: https://platform.openai.com/api-keys
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# The default values should work for local development
```

## Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
.\venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:5173

## Environment Variables

### Backend (.env)
**REQUIRED:**
- `OPENAI_API_KEY` - Your OpenAI API key for feedback generation

**OPTIONAL (defaults provided):**
- `PORT` - Backend server port (default: 8000)
- `CORS_ORIGINS` - Allowed frontend origins
- `MEDIAPIPE_MODEL_COMPLEXITY` - 0-2, higher = more accurate (default: 1)
- `LLM_MODEL` - OpenAI model to use (default: gpt-4o-mini)

### Frontend (.env)
**OPTIONAL (defaults provided):**
- `VITE_API_URL` - Backend API URL (default: http://localhost:8000)
- `VITE_WS_URL` - Backend WebSocket URL (default: ws://localhost:8000)

## Troubleshooting

### Backend won't start
- Make sure virtual environment is activated
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check .env file exists and has valid OPENAI_API_KEY

### Frontend won't start
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### CORS errors
- Verify `CORS_ORIGINS` in backend/.env includes your frontend URL
- Default includes both Vite (5173) and Create React App (3000) ports

### Camera not working
- Ensure you're accessing via http://localhost (not 127.0.0.1)
- Browser needs permission to access camera
- HTTPS required for camera access in production

## Security Reminders

**NEVER commit these files:**
- `backend/.env` - Contains API keys
- `frontend/.env` - May contain sensitive config
- Any files with API keys or credentials

**Safe to commit:**
- `.env.example` files (templates only)
- All code files
- Configuration files
