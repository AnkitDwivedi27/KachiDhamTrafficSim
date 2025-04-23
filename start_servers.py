import subprocess
import os
import sys
from pathlib import Path

def start_servers():
    # Get the current directory
    current_dir = Path(__file__).parent.absolute()
    
    print("Starting Traffic Simulator servers...")
    
    # Start backend server
    print("Starting backend server...")
    backend_process = subprocess.Popen(
        ["python", "app.py"],
        cwd=os.path.join(current_dir, "backend")
    )
    
    # Start frontend server
    print("Starting frontend server...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=current_dir
    )
    
    print("\nBoth servers started!")
    print("Backend server: http://localhost:5000")
    print("Frontend server: http://localhost:5173")
    
    try:
        # Keep the script running
        backend_process.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    start_servers() 