/**
 * ISS (International Space Station) Types
 * Type definitions for ISS tracking API
 */

export interface ISSPosition {
    latitude: string;
    longitude: string;
}

export interface ISSData {
    timestamp: number;
    iss_position: ISSPosition;
    message: string;
}

export interface ISSStats {
    lat: number;
    lon: number;
    altitude: number;  // km
    velocity: number;  // km/h
    timestamp: Date;
}

export interface ISSTrackerProps {
    onClose: () => void;
}
