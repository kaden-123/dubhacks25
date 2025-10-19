# K-Pop Dance Trainer - Backend

FastAPI backend for real-time pose detection and dance feedback.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
```
for us -> *conda create --name myenv python=3.10*

2. Activate virtual environment:
```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

for us -> *conda activate myenv*

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

5. Run the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Architecture

```
backend/
├── app/
│   ├── api/          # FastAPI routes
│   ├── services/     # Business logic
│   ├── utils/        # Helper functions
│   └── models/       # Pydantic models
└── tests/            # Unit tests
```
