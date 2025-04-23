# Traffic Simulator Backend

A Flask-based backend for the Traffic Simulator application.

## Setup

1. Install Python 3.8 or higher if not already installed.

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the server:
   ```
   python app.py
   ```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/login` - Login for users and admins

### Traffic Data
- `GET /api/traffic/roads` - Get all roads
- `GET /api/traffic/intersections` - Get all intersections
- `GET /api/traffic/events` - Get all traffic events
- `POST /api/traffic/events` - Add a new traffic event
- `DELETE /api/traffic/events/<event_id>` - Delete a traffic event
- `PUT /api/traffic/lights/<light_id>` - Update traffic light status

### Route Planning
- `POST /api/route/plan` - Plan a route between two points

### Zonal Throttling
- `POST /api/zonal/throttle` - Set throttling level for a traffic zone 