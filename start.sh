#!/bin/bash

# 🎵 K-Pop Dance Trainer Startup Script
# ======================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo -e "${CYAN}🎵 Starting K-Pop Dance Trainer...${NC}"
echo "=================================="

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Check if directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    print_error "Backend directory not found: $BACKEND_DIR"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    print_error "Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

# Detect conda installation
if command -v conda &> /dev/null; then
    print_info "Conda detected"
    
    # List available environments
    print_info "Available conda environments:"
    conda env list | grep -E "^[a-zA-Z]" | awk '{print "  - " $1}' || true
    
    # Auto-detect hackathon environment
    if conda env list | grep -q "hackathon"; then
        CONDA_ENV="hackathon"
        print_success "Using conda environment: $CONDA_ENV"
    else
        # Try other common environment names
        if conda env list | grep -q "dubhacks"; then
            CONDA_ENV="dubhacks"
            print_success "Using conda environment: $CONDA_ENV"
        else
            print_warning "No suitable conda environment found. Using base."
            CONDA_ENV="base"
        fi
    fi
else
    print_warning "Conda not found. Using system Python."
    CONDA_ENV=""
fi

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local process_name=$2
    if check_port $port; then
        print_warning "Port $port is already in use by $process_name"
        print_info "Attempting to kill existing process..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
        if check_port $port; then
            print_error "Port $port is still in use. Please manually kill the process and try again."
            exit 1
        else
            print_success "Port $port is now free"
        fi
    fi
}

# Kill existing processes on ports 8000 and 5173
kill_port 8000 "backend"
kill_port 5173 "frontend"

# Initialize conda if available
if [ -n "$CONDA_ENV" ] && command -v conda &> /dev/null; then
    print_info "Initializing conda environment: $CONDA_ENV"
    eval "$(conda shell.bash hook)"
    conda activate $CONDA_ENV
fi

# ============================================================================
# BACKEND SETUP
# ============================================================================
print_info "Starting backend server..."

# Check if backend requirements.txt exists
if [ -f "$BACKEND_DIR/requirements.txt" ]; then
    print_info "Installing/updating backend dependencies in conda environment..."
    if [ -n "$CONDA_ENV" ]; then
        print_info "Activating conda environment: $CONDA_ENV"
        # Ensure we're using the right Python
        PYTHON_PATH=$(conda run -n $CONDA_ENV which python)
        print_info "Current Python: $PYTHON_PATH"
        
        # Install requirements
        conda run -n $CONDA_ENV pip install -r "$BACKEND_DIR/requirements.txt"
        print_success "Dependencies installed from requirements.txt"
    else
        pip install -r "$BACKEND_DIR/requirements.txt"
        print_success "Dependencies installed from requirements.txt"
    fi
else
    print_warning "No requirements.txt found in backend directory"
fi

# Start backend server
print_info "Starting FastAPI server on http://localhost:8000"
if [ -n "$CONDA_ENV" ]; then
    print_info "Starting backend with conda environment: $CONDA_ENV"
    # Use explicit conda activation to ensure proper environment
    bash -c "source ~/miniconda3/etc/profile.d/conda.sh && conda activate $CONDA_ENV && cd '$BACKEND_DIR' && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" &
else
    cd "$BACKEND_DIR"
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
fi

BACKEND_PID=$!
echo $BACKEND_PID > "$SCRIPT_DIR/backend.pid"

# Wait for backend to start
print_info "Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    print_success "Backend is running and healthy!"
else
    print_error "Backend failed to start. Check the logs above."
    exit 1
fi

# ============================================================================
# FRONTEND SETUP
# ============================================================================
print_info "Starting frontend development server..."

# Check if package.json exists
if [ -f "$FRONTEND_DIR/package.json" ]; then
    # Install frontend dependencies if node_modules doesn't exist
    if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        print_info "Installing frontend dependencies..."
        cd "$FRONTEND_DIR"
        npm install
        print_success "Frontend dependencies installed"
    else
        print_info "Frontend dependencies already installed"
    fi
else
    print_error "No package.json found in frontend directory"
    exit 1
fi

# Start frontend development server
print_info "Starting React development server on http://localhost:5173"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$SCRIPT_DIR/frontend.pid"

# Wait for frontend to start
print_info "Waiting for frontend to start..."
sleep 8

# Check if frontend is running
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    print_success "Frontend is running and ready!"
else
    print_warning "Frontend might still be starting up..."
fi

# ============================================================================
# SUCCESS MESSAGE
# ============================================================================
echo ""
print_success "🎉 K-Pop Dance Trainer is running!"
echo ""
echo -e "${CYAN}Services:${NC}"
echo "  🔧 Backend API: http://localhost:8000"
echo "  🎨 Frontend: http://localhost:5173"
echo "  📚 API Docs: http://localhost:8000/docs"
echo "  💚 Health Check: http://localhost:8000/health"
echo ""

print_info "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    print_info "Shutting down services..."
    
    # Kill backend
    if [ -f "$SCRIPT_DIR/backend.pid" ]; then
        BACKEND_PID=$(cat "$SCRIPT_DIR/backend.pid")
        kill $BACKEND_PID 2>/dev/null || true
        rm -f "$SCRIPT_DIR/backend.pid"
        print_info "Backend stopped"
    fi
    
    # Kill frontend
    if [ -f "$SCRIPT_DIR/frontend.pid" ]; then
        FRONTEND_PID=$(cat "$SCRIPT_DIR/frontend.pid")
        kill $FRONTEND_PID 2>/dev/null || true
        rm -f "$SCRIPT_DIR/frontend.pid"
        print_info "Frontend stopped"
    fi
    
    print_success "All services stopped. Goodbye! 👋"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait
