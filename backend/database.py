import sqlite3
import os
import json
from datetime import datetime

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'traffic.db')

def dict_factory(cursor, row):
    """Convert database row objects to dictionaries"""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_db_connection():
    """Create a database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    return conn

def create_test_users(conn):
    """Create test users if they don't exist"""
    cursor = conn.cursor()
    
    # Check if users already exist
    cursor.execute('SELECT COUNT(*) as count FROM users')
    if cursor.fetchone()['count'] > 0:
        return
    
    # Test admin user
    cursor.execute('''
    INSERT INTO users (username, password, role)
    VALUES (?, ?, ?)
    ''', ('admin', 'admin123', 'admin'))
    
    # Test regular user
    cursor.execute('''
    INSERT INTO users (username, password, role)
    VALUES (?, ?, ?)
    ''', ('user', 'user123', 'user'))
    
    conn.commit()

def initialize_db():
    """Create database tables if they don't exist"""
    # Create data directory if it doesn't exist
    data_dir = os.path.dirname(DB_PATH)
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    # Check if database file exists
    if os.path.exists(DB_PATH):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if users table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if cursor.fetchone():
            conn.close()
            return  # Database already initialized
        
        conn.close()
    
    # If we get here, we need to create the database
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )
    ''')
    
    # Create roads table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS roads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        length REAL NOT NULL,
        speed_limit INTEGER NOT NULL,
        lanes INTEGER NOT NULL,
        vehicle_count INTEGER NOT NULL,
        congestion_level TEXT NOT NULL
    )
    ''')
    
    # Create intersections table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS intersections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location_x REAL NOT NULL,
        location_y REAL NOT NULL,
        has_traffic_light BOOLEAN NOT NULL,
        current_phase TEXT
    )
    ''')
    
    # Create traffic events table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS traffic_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        road_id TEXT NOT NULL,
        severity TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        location_x REAL NOT NULL,
        location_y REAL NOT NULL,
        affected_road_ids TEXT NOT NULL,
        FOREIGN KEY (road_id) REFERENCES roads (id)
    )
    ''')
    
    # Create zones table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS zones (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        boundaries TEXT NOT NULL,
        throttle_level REAL NOT NULL,
        max_capacity INTEGER NOT NULL,
        current_vehicle_count INTEGER NOT NULL
    )
    ''')
    
    conn.commit()
    
    # Create test users
    create_test_users(conn)
    
    # Load initial data
    load_initial_data(conn)
    
    conn.close()

def load_initial_data(conn):
    """Load initial data into tables if they are empty"""
    cursor = conn.cursor()
    
    # Check if data already exists using a single query
    cursor.execute('''
    SELECT 
        (SELECT COUNT(*) FROM roads) as roads_count,
        (SELECT COUNT(*) FROM intersections) as intersections_count,
        (SELECT COUNT(*) FROM traffic_events) as events_count,
        (SELECT COUNT(*) FROM zones) as zones_count
    ''')
    counts = cursor.fetchone()
    
    if counts['roads_count'] > 0:
        return  # Data already exists
    
    # Load traffic data from JSON file
    data_file = os.path.join(os.path.dirname(__file__), 'data', 'traffic_data.json')
    if os.path.exists(data_file):
        with open(data_file, 'r') as f:
            data = json.load(f)
            
            # Insert roads in batch
            roads_data = [(road['id'], road['name'], road['length'], road['speedLimit'],
                          road['lanes'], road['vehicleCount'], road['congestionLevel'])
                         for road in data.get('roads', [])]
            if roads_data:
                cursor.executemany('''
                INSERT INTO roads (id, name, length, speed_limit, lanes, vehicle_count, congestion_level)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', roads_data)
            
            # Insert intersections in batch
            intersections_data = [(intersection['id'],
                                 intersection.get('name', f"Intersection {intersection['id']}"),
                                 intersection['location']['x'],
                                 intersection['location']['y'],
                                 intersection['hasTrafficLight'],
                                 intersection.get('currentPhase'))
                                for intersection in data.get('intersections', [])]
            if intersections_data:
                cursor.executemany('''
                INSERT INTO intersections (id, name, location_x, location_y, has_traffic_light, current_phase)
                VALUES (?, ?, ?, ?, ?, ?)
                ''', intersections_data)
            
            # Insert traffic events in batch
            events_data = [(event['id'], event['type'], event['description'],
                           event['roadId'], event['severity'], event['startTime'],
                           event['endTime'], event['location']['x'],
                           event['location']['y'], json.dumps(event['affectedRoadIds']))
                          for event in data.get('trafficEvents', [])]
            if events_data:
                cursor.executemany('''
                INSERT INTO traffic_events (
                    id, type, description, road_id, severity,
                    start_time, end_time, location_x, location_y, affected_road_ids
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', events_data)
            
            # Insert zones in batch
            zones_data = [(zone['id'], zone['name'], json.dumps(zone['boundaries']),
                          zone['throttleLevel'], zone['maxCapacity'],
                          zone['currentVehicleCount'])
                         for zone in data.get('zones', [])]
            if zones_data:
                cursor.executemany('''
                INSERT INTO zones (
                    id, name, boundaries, throttle_level,
                    max_capacity, current_vehicle_count
                )
                VALUES (?, ?, ?, ?, ?, ?)
                ''', zones_data)
    
    conn.commit()

def get_all_roads():
    """Fetch all roads from the database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM roads')
    roads = cursor.fetchall()
    conn.close()
    return roads

def get_all_intersections():
    """Fetch all intersections with their connected roads"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM intersections')
    intersections = cursor.fetchall()
    
    # Get connected roads for each intersection
    for intersection in intersections:
        cursor.execute('''
        SELECT road_id FROM intersection_roads
        WHERE intersection_id = ?
        ''', (intersection['id'],))
        
        connected_roads = [row['road_id'] for row in cursor.fetchall()]
        intersection['connectedRoads'] = connected_roads
        
        # Convert location_x and location_y to a location object
        intersection['location'] = {
            'x': intersection.pop('location_x'),
            'y': intersection.pop('location_y')
        }
        
        # Convert has_traffic_light from int to bool
        intersection['hasTrafficLight'] = bool(intersection.pop('has_traffic_light'))
        
        # Rename current_phase to currentPhase
        if 'current_phase' in intersection:
            intersection['currentPhase'] = intersection.pop('current_phase')
    
    conn.close()
    return intersections

def get_all_events():
    """Fetch all traffic events with their affected roads"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM traffic_events')
    events = cursor.fetchall()
    
    # Get affected roads for each event
    for event in events:
        cursor.execute('''
        SELECT road_id FROM event_affected_roads
        WHERE event_id = ?
        ''', (event['id'],))
        
        affected_roads = [row['road_id'] for row in cursor.fetchall()]
        event['affectedRoadIds'] = affected_roads
        
        # Convert location_x and location_y to a location object
        event['location'] = {
            'x': event.pop('location_x'),
            'y': event.pop('location_y')
        }
        
        # Rename start_time and end_time to startTime and endTime
        event['startTime'] = event.pop('start_time')
        event['endTime'] = event.pop('end_time')
        
        # Remove created_at from the returned data
        event.pop('created_at', None)
    
    conn.close()
    return events

def get_all_zones():
    """Fetch all zones with their boundaries"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM zones')
    zones = cursor.fetchall()
    
    # Get boundaries for each zone
    for zone in zones:
        cursor.execute('''
        SELECT x, y FROM zone_boundaries
        WHERE zone_id = ?
        ORDER BY point_index
        ''', (zone['id'],))
        
        boundaries = cursor.fetchall()
        zone['boundaries'] = boundaries
        
        # Rename throttle_level, max_capacity, and current_vehicle_count
        zone['throttleLevel'] = zone.pop('throttle_level')
        zone['maxCapacity'] = zone.pop('max_capacity')
        zone['currentVehicleCount'] = zone.pop('current_vehicle_count')
    
    conn.close()
    return zones

def update_traffic_light(light_id, phase):
    """Update a traffic light's phase"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
    UPDATE intersections
    SET current_phase = ?
    WHERE id = ?
    ''', (phase, light_id))
    
    conn.commit()
    
    # Get the updated intersection
    cursor.execute('SELECT * FROM intersections WHERE id = ?', (light_id,))
    intersection = cursor.fetchone()
    
    if intersection:
        # Get connected roads
        cursor.execute('''
        SELECT road_id FROM intersection_roads
        WHERE intersection_id = ?
        ''', (intersection['id'],))
        
        connected_roads = [row['road_id'] for row in cursor.fetchall()]
        intersection['connectedRoads'] = connected_roads
        
        # Convert location_x and location_y to a location object
        intersection['location'] = {
            'x': intersection.pop('location_x'),
            'y': intersection.pop('location_y')
        }
        
        # Convert has_traffic_light from int to bool
        intersection['hasTrafficLight'] = bool(intersection.pop('has_traffic_light'))
        
        # Rename current_phase to currentPhase
        if 'current_phase' in intersection:
            intersection['currentPhase'] = intersection.pop('current_phase')
    
    conn.close()
    return intersection

def add_traffic_event(event_data):
    """Add a new traffic event"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Generate event ID
    cursor.execute('SELECT COUNT(*) as count FROM traffic_events')
    count = cursor.fetchone()['count']
    event_id = f"event-{count + 1}"
    
    # Extract data
    event_type = event_data.get('type')
    description = event_data.get('description')
    location = event_data.get('location', {})
    location_x = location.get('x', 0)
    location_y = location.get('y', 0)
    severity = event_data.get('severity')
    start_time = event_data.get('startTime')
    end_time = event_data.get('endTime')
    affected_road_ids = event_data.get('affectedRoadIds', [])
    
    # Insert into traffic_events table
    cursor.execute('''
    INSERT INTO traffic_events (
        id, type, description, location_x, location_y,
        severity, start_time, end_time, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        event_id,
        event_type,
        description,
        location_x,
        location_y,
        severity,
        start_time,
        end_time,
        datetime.now().isoformat()
    ))
    
    # Insert affected roads
    for road_id in affected_road_ids:
        cursor.execute('''
        INSERT INTO event_affected_roads (event_id, road_id)
        VALUES (?, ?)
        ''', (event_id, road_id))
    
    conn.commit()
    
    # Prepare the response
    new_event = {
        'id': event_id,
        'type': event_type,
        'description': description,
        'location': {'x': location_x, 'y': location_y},
        'severity': severity,
        'startTime': start_time,
        'endTime': end_time,
        'affectedRoadIds': affected_road_ids
    }
    
    conn.close()
    return new_event

def delete_traffic_event(event_id):
    """Delete a traffic event"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # First delete from the junction table
    cursor.execute('DELETE FROM event_affected_roads WHERE event_id = ?', (event_id,))
    
    # Then delete the event
    cursor.execute('DELETE FROM traffic_events WHERE id = ?', (event_id,))
    
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    
    return success

def update_zone_throttle(zone_id, throttle_level):
    """Update a zone's throttle level"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
    UPDATE zones
    SET throttle_level = ?
    WHERE id = ?
    ''', (throttle_level, zone_id))
    
    success = cursor.rowcount > 0
    conn.commit()
    
    # Get the updated zone
    cursor.execute('SELECT * FROM zones WHERE id = ?', (zone_id,))
    zone = cursor.fetchone()
    
    if zone:
        zone['throttleLevel'] = zone.pop('throttle_level')
        zone['maxCapacity'] = zone.pop('max_capacity')
        zone['currentVehicleCount'] = zone.pop('current_vehicle_count')
    
    conn.close()
    return zone if success else None

def check_user(username, password):
    """Check if a user exists and password is correct"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    
    conn.close()
    
    if not user:
        return None
    
    if user['password'] != password:
        return None
    
    return {'username': user['username'], 'role': user['role']}

def get_road_by_id(road_id):
    """Fetch a single road by its ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM roads WHERE id = ?', (road_id,))
    road = cursor.fetchone()
    conn.close()
    return road

def get_zone_points(zone_id):
    """Fetch all entry and exit points for a zone"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT * FROM zone_points
    WHERE zone_id = ?
    ''', (zone_id,))
    
    points = cursor.fetchall()
    
    # Convert to dictionary format
    points = [dict(point) for point in points]
    
    conn.close()
    return points

def update_zone_point(point_id, updates):
    """Update a zone point's properties"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Build the update query dynamically based on provided updates
    update_fields = []
    values = []
    
    for field, value in updates.items():
        if field in ['status', 'capacity']:
            update_fields.append(f"{field} = ?")
            values.append(value)
    
    if not update_fields:
        conn.close()
        return None
    
    # Add point_id to values list
    values.append(point_id)
    
    # Construct and execute the update query
    query = f'''
    UPDATE zone_points
    SET {', '.join(update_fields)}
    WHERE id = ?
    '''
    
    cursor.execute(query, values)
    success = cursor.rowcount > 0
    conn.commit()
    
    # Get the updated point
    cursor.execute('SELECT * FROM zone_points WHERE id = ?', (point_id,))
    point = cursor.fetchone()
    
    if point:
        point = dict(point)
    
    conn.close()
    return point if success else None

# Initialize the database on import
if not os.path.exists(os.path.dirname(DB_PATH)):
    os.makedirs(os.path.dirname(DB_PATH))

initialize_db() 