// API Types for LiveLink backend integration
export interface ApiDeparture {
  id: string;
  transportType: "bus" | "train" | "tram";
  lineNumber: string;
  destination: string;
  scheduledDeparture: string;
  actualDeparture?: string;
  platform?: string;
  status: "on-time" | "delayed" | "cancelled" | "boarding";
  delayMinutes?: number;
  nextDepartures: string[];
  stopId: string;
  stopName: string;
}

export interface ApiRoute {
  id: string;
  fromStopId: string;
  toStopId: string;
  totalDurationMinutes: number;
  transferCount: number;
  walkingTimeMinutes: number;
  steps: RouteStep[];
  emissions?: number;
  price?: number;
}

export interface RouteStep {
  id: string;
  type: "bus" | "train" | "tram" | "walk";
  lineNumber?: string;
  fromStop: string;
  toStop: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  platform?: string;
}

export interface ApiAlert {
  id: string;
  type: "warning" | "info" | "disruption";
  title: string;
  description: string;
  affectedLines: string[];
  severity: "low" | "medium" | "high";
  startTime: string;
  endTime?: string;
  isActive: boolean;
}

export interface StopLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  pincode: string;
  stopType: "bus" | "train" | "tram" | "mixed";
}

export interface UserPreferences {
  id: string;
  userId: string;
  homeStopId?: string;
  workStopId?: string;
  preferredTransportTypes: string[];
  maxWalkingDistance: number;
  notificationSettings: {
    delays: boolean;
    disruptions: boolean;
    routeUpdates: boolean;
  };
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}