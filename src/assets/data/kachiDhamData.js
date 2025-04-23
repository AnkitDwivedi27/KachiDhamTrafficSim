

export const CONGESTION_LEVEL = {
    NONE: 'none',
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    SEVERE: 'severe'
  };
  
  export const TRAFFIC_LIGHT_PHASE = {
    GREEN: 'green',
    YELLOW: 'yellow',
    RED: 'red'
  };
  
  export const VEHICLE_TYPE = {
    CAR: 'car',
    BUS: 'bus',
    TRUCK: 'truck',
    MOTORCYCLE: 'motorcycle',
    EMERGENCY: 'emergency'
  };
  
  export const TRAFFIC_EVENT_TYPE = {
    ACCIDENT: 'accident',
    ROAD_WORK: 'roadWork',
    BLOCKAGE: 'blockage',
    SPECIAL_EVENT: 'specialEvent',
    WEATHER_CONDITION: 'weatherCondition'
  };
  
  export const EVENT_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  };
  
  
  export const kachiDhamRoads = [
    {
      id: 'road-1',
      name: 'Main Temple Road',
      startPoint: { x: 100, y: 300 },
      endPoint: { x: 400, y: 300 },
      lanes: 4,
      speedLimit: 40,
      currentSpeed: 35,
      congestionLevel: CONGESTION_LEVEL.MEDIUM,
      vehicleCount: 50
    },
    {
      id: 'road-2',
      name: 'Market Street',
      startPoint: { x: 400, y: 300 },
      endPoint: { x: 400, y: 100 },
      lanes: 2,
      speedLimit: 30,
      currentSpeed: 15,
      congestionLevel: CONGESTION_LEVEL.HIGH,
      vehicleCount: 60
    },
    {
      id: 'road-3',
      name: 'River Road',
      startPoint: { x: 400, y: 300 },
      endPoint: { x: 700, y: 300 },
      lanes: 3,
      speedLimit: 50,
      currentSpeed: 45,
      congestionLevel: CONGESTION_LEVEL.LOW,
      vehicleCount: 20
    },
    {
      id: 'road-4',
      name: 'Temple Circle',
      startPoint: { x: 400, y: 300 },
      endPoint: { x: 400, y: 500 },
      lanes: 2,
      speedLimit: 30,
      currentSpeed: 10,
      congestionLevel: CONGESTION_LEVEL.SEVERE,
      vehicleCount: 80
    },
    {
      id: 'road-5',
      name: 'Eastern Avenue',
      startPoint: { x: 700, y: 300 },
      endPoint: { x: 700, y: 500 },
      lanes: 2,
      speedLimit: 40,
      currentSpeed: 38,
      congestionLevel: CONGESTION_LEVEL.LOW,
      vehicleCount: 15
    },
    {
      id: 'road-6',
      name: 'Northern Boulevard',
      startPoint: { x: 400, y: 500 },
      endPoint: { x: 700, y: 500 },
      lanes: 3,
      speedLimit: 50,
      currentSpeed: 40,
      congestionLevel: CONGESTION_LEVEL.MEDIUM,
      vehicleCount: 30
    },
    {
      id: 'road-7',
      name: 'Pilgrim Path',
      startPoint: { x: 100, y: 300 },
      endPoint: { x: 100, y: 500 },
      lanes: 2,
      speedLimit: 25,
      currentSpeed: 22,
      congestionLevel: CONGESTION_LEVEL.LOW,
      vehicleCount: 25
    },
    {
      id: 'road-8',
      name: 'Western Connection',
      startPoint: { x: 100, y: 500 },
      endPoint: { x: 400, y: 500 },
      lanes: 2,
      speedLimit: 35,
      currentSpeed: 30,
      congestionLevel: CONGESTION_LEVEL.MEDIUM,
      vehicleCount: 35
    }
  ];
  

  export const kachiDhamIntersections = [
    {
      id: 'intersection-1',
      location: { x: 400, y: 300 },
      connectedRoads: ['road-1', 'road-2', 'road-3', 'road-4'],
      hasTrafficLight: true,
      currentPhase: TRAFFIC_LIGHT_PHASE.GREEN
    },
    {
      id: 'intersection-2',
      location: { x: 400, y: 500 },
      connectedRoads: ['road-4', 'road-6', 'road-8'],
      hasTrafficLight: true,
      currentPhase: TRAFFIC_LIGHT_PHASE.RED
    },
    {
      id: 'intersection-3',
      location: { x: 700, y: 500 },
      connectedRoads: ['road-5', 'road-6'],
      hasTrafficLight: false
    },
    {
      id: 'intersection-4',
      location: { x: 700, y: 300 },
      connectedRoads: ['road-3', 'road-5'],
      hasTrafficLight: false
    },
    {
      id: 'intersection-5',
      location: { x: 100, y: 500 },
      connectedRoads: ['road-7', 'road-8'],
      hasTrafficLight: false
    },
    {
      id: 'intersection-6',
      location: { x: 100, y: 300 },
      connectedRoads: ['road-1', 'road-7'],
      hasTrafficLight: true,
      currentPhase: TRAFFIC_LIGHT_PHASE.RED
    },
    {
      id: 'intersection-7',
      location: { x: 400, y: 100 },
      connectedRoads: ['road-2'],
      hasTrafficLight: false
    }
  ];
  

  export const pointsOfInterest = [
    {
      id: 'poi-1',
      name: 'Main Temple',
      location: { x: 250, y: 350 },
      type: 'religious',
      description: 'The main Kachi Dham temple'
    },
    {
      id: 'poi-2',
      name: 'Market',
      location: { x: 420, y: 200 },
      type: 'commercial',
      description: 'Central market area with shops and vendors'
    },
    {
      id: 'poi-3',
      name: 'Bus Station',
      location: { x: 600, y: 280 },
      type: 'transportation',
      description: 'Main bus station for pilgrims'
    },
    {
      id: 'poi-4',
      name: 'Parking Area',
      location: { x: 500, y: 450 },
      type: 'transportation',
      description: 'Large parking area for private vehicles'
    },
    {
      id: 'poi-5',
      name: 'Jagdish Villas',
      location: { x: 750, y: 400 },
      type: 'religious',
      description: 'Holy bathing area by the river'
    }
  ];
  
  
  export const kachiDhamRoadNetwork = {
    roads: kachiDhamRoads,
    intersections: kachiDhamIntersections,
    pointsOfInterest: pointsOfInterest
  };
  
 
  export const sampleVehicles = [
    {
      id: 'vehicle-1',
      type: VEHICLE_TYPE.CAR,
      position: { x: 150, y: 300 },
      direction: 0,
      speed: 30,
      route: ['road-1', 'road-3', 'road-5'],
      currentRoadId: 'road-1',
      nextIntersectionId: 'intersection-1',
      destinationId: 'poi-5'
    },
    {
      id: 'vehicle-2',
      type: VEHICLE_TYPE.BUS,
      position: { x: 400, y: 200 },
      direction: 270,
      speed: 20,
      route: ['road-2', 'road-1', 'road-7'],
      currentRoadId: 'road-2',
      nextIntersectionId: 'intersection-1',
      destinationId: 'poi-1'
    },
    {
      id: 'vehicle-3',
      type: VEHICLE_TYPE.EMERGENCY,
      position: { x: 500, y: 300 },
      direction: 0,
      speed: 60,
      route: ['road-3', 'road-5', 'road-6'],
      currentRoadId: 'road-3',
      nextIntersectionId: 'intersection-4',
      destinationId: 'poi-4'
    }
  ];
  

  export const sampleTrafficEvents = [
    {
      id: 'event-1',
      type: TRAFFIC_EVENT_TYPE.ROAD_WORK,
      location: { x: 600, y: 300 },
      affectedRoadIds: ['road-3'],
      startTime: new Date('2024-04-22T08:00:00'),
      endTime: new Date('2024-04-25T18:00:00'),
      description: 'Road widening work',
      severity: EVENT_SEVERITY.MEDIUM
    },
    {
      id: 'event-2',
      type: TRAFFIC_EVENT_TYPE.SPECIAL_EVENT,
      location: { x: 250, y: 350 },
      affectedRoadIds: ['road-1', 'road-7'],
      startTime: new Date('2024-04-23T10:00:00'),
      endTime: new Date('2024-04-23T20:00:00'),
      description: 'Temple festival celebration',
      severity: EVENT_SEVERITY.HIGH
    }
  ];
  
 
  export const initialSimulationState = {
    isRunning: false,
    speed: 1,
    currentTime: new Date(),
    vehicles: sampleVehicles,
    events: sampleTrafficEvents,
    roadNetwork: kachiDhamRoadNetwork
  };