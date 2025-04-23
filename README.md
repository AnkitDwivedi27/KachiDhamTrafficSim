# Traffic Simulator

A web-based traffic simulation and management system for Kachi Dham, featuring real-time monitoring, route planning, and zonal traffic throttling.

## Features

- Real-time traffic monitoring dashboard
- Route planning with multiple options
- Admin panel for traffic management
- Zonal traffic throttling
- User and admin authentication

## Tech Stack

- **Frontend**: React, CSS
- **Backend**: Flask (Python)
- **Build Tool**: Vite

## Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/traffic-simulator.git
   cd traffic-simulator
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

### Running the Application

You can start both the frontend and backend servers using the provided batch file:

```
start.bat
```

Or start them separately:

1. Start the backend server
   ```
   cd backend
   python app.py
   ```

2. Start the frontend development server (in a separate terminal)
   ```
   npm run dev
   ```

3. Open your browser and navigate to:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Usage

- **Login**: Use the login page with the following credentials:
  - Regular user: Email: user@example.com / Password: password123
  - Admin: Username: admin / Password: admin123

- **Route Planner**: Plan optimal routes between locations
- **Admin Panel**: Manage traffic events and control traffic signals
- **Zonal Throttling**: Configure traffic flow restrictions in different zones

## Project Structure

```
TrafficSim/
├── backend/           # Flask backend
│   ├── data/          # JSON data files
│   ├── app.py         # Main Flask application
│   └── requirements.txt
├── src/               # React components and logic
├── Components/        # Shared UI components
├── Style/             # CSS stylesheets
├── public/            # Static assets
└── package.json
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
