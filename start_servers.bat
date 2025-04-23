@echo off
echo Starting Traffic Simulator servers...

echo Starting backend server...
start cmd /k "cd backend && python app.py"

echo Starting frontend server...
start cmd /k "npm run dev"

echo Both servers started!
echo Backend server: http://localhost:5000
echo Frontend server: http://localhost:5173 