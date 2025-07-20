import { ApiDeparture, ApiRoute, ApiAlert, StopLocation, ApiResponse } from "@/types/api";

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-livelink-api.com/api/v1'  // Your production API
  : 'http://localhost:8080/api/v1';          // Your local Docker API

class LiveLinkApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers when implementing authentication
          // 'Authorization': `Bearer ${getToken()}`,
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Departures API
  async getDeparturesByPincode(pincode: string): Promise<ApiDeparture[]> {
    const response = await this.fetchApi<ApiDeparture[]>(`/departures?pincode=${pincode}`);
    return response.data;
  }

  async getDeparturesByStop(stopId: string): Promise<ApiDeparture[]> {
    const response = await this.fetchApi<ApiDeparture[]>(`/departures/stop/${stopId}`);
    return response.data;
  }

  async getLiveDepartures(stopIds: string[]): Promise<ApiDeparture[]> {
    const response = await this.fetchApi<ApiDeparture[]>('/departures/live', {
      method: 'POST',
      body: JSON.stringify({ stopIds }),
    });
    return response.data;
  }

  // Route Planning API
  async planRoute(fromPincode: string, toPincode: string, options?: {
    departureTime?: string;
    maxTransfers?: number;
    transportTypes?: string[];
  }): Promise<ApiRoute[]> {
    const params = new URLSearchParams();
    params.append('from', fromPincode);
    params.append('to', toPincode);
    
    if (options?.departureTime) params.append('departureTime', options.departureTime);
    if (options?.maxTransfers) params.append('maxTransfers', options.maxTransfers.toString());
    if (options?.transportTypes) params.append('transportTypes', options.transportTypes.join(','));
    
    const response = await this.fetchApi<ApiRoute[]>(`/routes/plan?${params}`);
    return response.data;
  }

  // Alerts API
  async getActiveAlerts(pincode?: string): Promise<ApiAlert[]> {
    const endpoint = pincode ? `/alerts?pincode=${pincode}` : '/alerts';
    const response = await this.fetchApi<ApiAlert[]>(endpoint);
    return response.data;
  }

  async getAlertsByLine(lineNumber: string): Promise<ApiAlert[]> {
    const response = await this.fetchApi<ApiAlert[]>(`/alerts/line/${lineNumber}`);
    return response.data;
  }

  // Stops API
  async getStopsByPincode(pincode: string): Promise<StopLocation[]> {
    const response = await this.fetchApi<StopLocation[]>(`/stops?pincode=${pincode}`);
    return response.data;
  }

  async searchStops(query: string): Promise<StopLocation[]> {
    const response = await this.fetchApi<StopLocation[]>(`/stops/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  // User Preferences API (when implementing user accounts)
  async getUserPreferences(userId: string): Promise<any> {
    const response = await this.fetchApi(`/users/${userId}/preferences`);
    return response.data;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<any> {
    const response = await this.fetchApi(`/users/${userId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
    return response.data;
  }

  // Health check for monitoring
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.fetchApi<{ status: string; timestamp: string }>('/health');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new LiveLinkApiService();

// Export dummy data for development/testing
export const dummyApiData = {
  departures: {
    "71634": [
      {
        id: "dep_1",
        transportType: "train" as const,
        lineNumber: "S4",
        destination: "Stuttgart Hauptbahnhof",
        scheduledDeparture: "14:32",
        actualDeparture: "14:37",
        platform: "2",
        status: "delayed" as const,
        delayMinutes: 5,
        nextDepartures: ["14:47", "15:02", "15:17"],
        stopId: "stop_ludwigsburg_hbf",
        stopName: "Ludwigsburg Hauptbahnhof"
      },
      {
        id: "dep_2",
        transportType: "bus" as const,
        lineNumber: "443",
        destination: "Schlossstraße",
        scheduledDeparture: "14:28",
        platform: undefined,
        status: "on-time" as const,
        nextDepartures: ["14:43", "14:58", "15:13"],
        stopId: "stop_arsenalplatz",
        stopName: "Arsenalplatz"
      }
    ] as ApiDeparture[]
  },
  
  alerts: [
    {
      id: "alert_1",
      type: "warning" as const,
      title: "S4 Line Delays",
      description: "Signal maintenance causing 5-10 minute delays",
      affectedLines: ["S4"],
      severity: "medium" as const,
      startTime: "2024-01-20T13:00:00Z",
      isActive: true
    }
  ] as ApiAlert[]
};