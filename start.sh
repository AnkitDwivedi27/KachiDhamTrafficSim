#!/bin/bash

echo "Starting Traffic Simulator..."

# Start the Flask backend
echo "Starting Flask backend..."
cd backend && python app.py &
BACKEND_PID=$!
cd ..

# Start the React frontend
echo "Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

echo "Both servers started! Open http://localhost:5173 in your browser to access the application."
echo "Press Ctrl+C to stop both servers."

# Function to kill both processes on exit
function cleanup {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

# Register the cleanup function to be called on SIGINT (Ctrl+C)
trap cleanup SIGINT

# Wait for user to press Ctrl+C
wait 