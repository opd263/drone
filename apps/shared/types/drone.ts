 interface DroneMeta {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'returning';
}
export interface Drone {
  id: string;
  temperature: number;
  battery: number;
  signal: number;
  image: string;
}
  
export interface DroneVitals {
  temperature: number;
  battery: number;
  signal: number;
}

export interface DroneFeed {
  imageBase64: string;
  timestamp: string;
}
export interface LogEntry {
  id: string;
  timestamp: string;
  gps: { lat: number; lon: number };
  status: string;
  notes?: string;
};
