#!/bin/bash

echo "🔄 Killing all K-Pop Dance Trainer processes..."

# Kill uvicorn processes
echo "Killing uvicorn processes..."
pkill -f uvicorn

# Kill npm processes
echo "Killing npm processes..."
pkill -f "npm run dev"

# Kill vite processes
echo "Killing vite processes..."
pkill -f vite

# Kill any remaining node processes related to our project
echo "Killing node processes..."
pkill -f "node.*dubhacks25"

echo "✅ All processes killed!"
echo ""
echo "To restart:"
echo "  Backend: cd backend && bash -c \"source ~/miniconda3/etc/profile.d/conda.sh && conda activate hackathon && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000\" &"
echo "  Frontend: cd frontend && npm run dev &"
