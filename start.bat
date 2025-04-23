@echo off
echo Starting Traffic Simulator...

echo Starting Flask backend...
start cmd /k "cd backend && python app.py"

echo Starting React frontend...
start cmd /k "npm run dev"

echo Both servers started! Open http://localhost:5173 in your browser to access the application. 