#!/usr/bin/env python
"""
Database management utility for Traffic Simulator
"""

import argparse
import os
import json
import sqlite3
import database as db

def reset_db():
    """Reset the database by removing it and recreating it"""
    try:
        if os.path.exists(db.DB_PATH):
            os.remove(db.DB_PATH)
            print(f"Database file removed: {db.DB_PATH}")
        
        # Initialize will create tables and load initial data
        db.initialize_db()
        print("Database has been reset and initialized with initial data.")
    except Exception as e:
        print(f"Error resetting database: {e}")

def export_data(output_path=None):
    """Export database data to a JSON file"""
    try:
        if output_path is None:
            output_path = os.path.join(os.path.dirname(__file__), 'data', 'exported_data.json')
        
        # Get all data
        data = {
            "roads": db.get_all_roads(),
            "intersections": db.get_all_intersections(),
            "trafficEvents": db.get_all_events(),
            "zones": db.get_all_zones()
        }
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Write to file
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Data exported to {output_path}")
    except Exception as e:
        print(f"Error exporting data: {e}")

def show_stats():
    """Display database statistics"""
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()
        
        stats = {}
        
        # Get table counts
        for table in ['users', 'roads', 'intersections', 'traffic_events', 'zones']:
            cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
            stats[table] = cursor.fetchone()['count']
        
        conn.close()
        
        print("\nDatabase Statistics:")
        print("-" * 30)
        for table, count in stats.items():
            print(f"{table.replace('_', ' ').title()}: {count} records")
        print("-" * 30)
    except Exception as e:
        print(f"Error getting database stats: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Traffic Simulator Database Management')
    
    # Define commands
    subparsers = parser.add_subparsers(dest='command', help='Command to run')
    
    # Reset command
    reset_parser = subparsers.add_parser('reset', help='Reset the database')
    
    # Export command
    export_parser = subparsers.add_parser('export', help='Export data to JSON')
    export_parser.add_argument('--output', '-o', help='Output file path')
    
    # Stats command
    stats_parser = subparsers.add_parser('stats', help='Show database statistics')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Execute command
    if args.command == 'reset':
        reset_db()
    elif args.command == 'export':
        export_data(args.output)
    elif args.command == 'stats':
        show_stats()
    else:
        parser.print_help() 