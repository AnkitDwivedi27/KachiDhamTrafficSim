from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import database as db
import logging
from ml_service import traffic_predictor

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize database when the server starts
try:
    db.initialize_db()
    logger.info("Database initialized")
except Exception as e:
    logger.warning(f"Database initialization warning: {str(e)}")
    logger.info("Continuing with existing database")

@app.route('/')
def index():
    return jsonify({
        "status": "ok",
        "message": "Traffic Simulator API is running",
        "endpoints": [
            "/api/login",
            "/api/traffic/roads",
            "/api/traffic/intersections",
            "/api/traffic/events",
            "/api/route/plan",
            "/api/zonal/throttle"
        ]
    })

@app.route('/api/login', methods=['POST'])
def login():
    try:
        logger.debug("Received login request")
        data = request.json
        logger.debug(f"Login data: {data}")
        
        if not data:
            logger.error("No data received in request")
            return jsonify({"success": False, "message": "No data received"}), 400
            
        email_or_username = data.get('email') or data.get('username')
        password = data.get('password')
        
        if not email_or_username or not password:
            logger.error("Missing email/username or password")
            return jsonify({"success": False, "message": "Missing email/username or password"}), 400
        
        logger.debug(f"Attempting to authenticate user: {email_or_username}")
        user = db.check_user(email_or_username, password)
        
        if not user:
            logger.warning(f"Invalid credentials for user: {email_or_username}")
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
        
        logger.info(f"Successful login for user: {email_or_username}")
        return jsonify({
            "success": True,
            "user": {
                "email_or_username": email_or_username,
                "role": user['role']
            }
        })
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route('/api/traffic/roads', methods=['GET'])
def get_roads():
    roads = db.get_all_roads()
    return jsonify(roads)

@app.route('/api/traffic/intersections', methods=['GET'])
def get_intersections():
    intersections = db.get_all_intersections()
    return jsonify(intersections)

@app.route('/api/traffic/events', methods=['GET'])
def get_events():
    events = db.get_all_events()
    return jsonify(events)

@app.route('/api/traffic/events', methods=['POST'])
def add_event():
    new_event = request.json
    created_event = db.add_traffic_event(new_event)
    return jsonify(created_event)

@app.route('/api/traffic/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    success = db.delete_traffic_event(event_id)
    
    if success:
        return jsonify({"success": True})
    
    return jsonify({"success": False, "message": "Event not found"}), 404

@app.route('/api/traffic/lights/<light_id>', methods=['PUT'])
def update_traffic_light(light_id):
    phase = request.json.get('phase')
    updated_intersection = db.update_traffic_light(light_id, phase)
    
    if updated_intersection:
        return jsonify(updated_intersection)
    
    return jsonify({"success": False, "message": "Traffic light not found"}), 404

@app.route('/api/route/plan', methods=['POST'])
def plan_route():
    # In a real app, this would implement an actual routing algorithm
    origin = request.json.get('origin')
    destination = request.json.get('destination')
    
    # Dummy response with a route
    return jsonify({
        "success": True,
        "route": {
            "origin": origin,
            "destination": destination,
            "distance": 5.2,
            "duration": 15,
            "path": ["road-1", "road-5", "road-8"]
        }
    })

@app.route('/api/zonal/throttle', methods=['POST'])
def set_zonal_throttling():
    zone_id = request.json.get('zoneId')
    throttle_level = request.json.get('throttleLevel')
    
    updated_zone = db.update_zone_throttle(zone_id, throttle_level)
    
    if updated_zone:
        return jsonify({
            "success": True,
            "zone": updated_zone
        })
    
    return jsonify({"success": False, "message": "Zone not found"}), 404

@app.route('/backend/data/traffic_data.json', methods=['GET'])
def get_traffic_data_file():
    # Construct the complete data object
    traffic_data = {
        "roads": db.get_all_roads(),
        "intersections": db.get_all_intersections(),
        "trafficEvents": db.get_all_events(),
        "zones": db.get_all_zones()
    }
    
    return jsonify(traffic_data)

@app.route('/api/traffic/predict', methods=['POST'])
def predict_traffic():
    try:
        data = request.get_json()
        road_id = data.get('road_id')
        
        if not road_id:
            return jsonify({'error': 'Road ID is required'}), 400
            
        # Get current road data
        road = db.get_road_by_id(road_id)
        
        if not road:
            return jsonify({'error': 'Road not found'}), 404
            
        # Prepare road data for prediction
        road_data = {
            'vehicleCount': road['vehicle_count'],
            'speed': road['speed_limit'],
            'congestionLevel': road['congestion_level']
        }
        
        # Get prediction
        prediction = traffic_predictor.predict_traffic(road_data)
        
        return jsonify({
            'road_id': road_id,
            'current_status': {
                'vehicle_count': road['vehicle_count'],
                'speed_limit': road['speed_limit'],
                'congestion_level': road['congestion_level']
            },
            'prediction': prediction
        })
        
    except Exception as e:
        logging.error(f"Error in traffic prediction: {str(e)}")
        return jsonify({'error': 'Failed to generate prediction'}), 500

@app.route('/api/zonal/points/<zone_id>', methods=['GET'])
def get_zone_points(zone_id):
    points = db.get_zone_points(zone_id)
    if points:
        return jsonify(points)
    return jsonify({"success": False, "message": "Zone points not found"}), 404

@app.route('/api/zonal/points/<point_id>', methods=['PUT'])
def update_zone_point(point_id):
    updates = request.json
    updated_point = db.update_zone_point(point_id, updates)
    
    if updated_point:
        return jsonify({
            "success": True,
            "point": updated_point
        })
    
    return jsonify({"success": False, "message": "Point not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000) 