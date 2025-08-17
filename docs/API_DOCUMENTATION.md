# LiveLink Ludwigsburg API Documentation

## Overview
The LiveLink API provides real-time public transport information for the Ludwigsburg area. This RESTful API serves departure times, service alerts, and route planning data.

**Base URL:** `http://localhost:8080/api/v1`

## Authentication
Currently, the API does not require authentication. This will be implemented in future versions.

## Response Format
All API responses follow this standard format:

```json
{
  "success": true,
  "data": [...],
  "message": "Operation completed successfully",
  "timestamp": "2024-01-20T14:30:00Z"
}
```

## API Endpoints

### 1. Departures

#### Get Departures by Pincode
Retrieves live departure information for all stops within a specific postal code area.

```http
GET /api/v1/departures?pincode={pincode}
```

**Parameters:**
- `pincode` (required): 5-digit German postal code (e.g., "71634")

**Example Request:**
```bash
curl "http://localhost:8080/api/v1/departures?pincode=71634"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dep_1",
      "transportType": "train",
      "lineNumber": "S4",
      "destination": "Stuttgart Hauptbahnhof",
      "scheduledDeparture": "14:32",
      "actualDeparture": "14:37",
      "platform": "2",
      "status": "delayed",
      "delayMinutes": 5,
      "nextDepartures": ["14:47", "15:02", "15:17"],
      "stopId": "stop_ludwigsburg_hbf",
      "stopName": "Ludwigsburg Hauptbahnhof"
    }
  ],
  "message": "Departures retrieved for pincode: 71634"
}
```

#### Get Departures by Stop
Retrieves departure information for a specific transport stop.

```http
GET /api/v1/departures/stop/{stopId}
```

**Parameters:**
- `stopId` (required): Unique identifier for the transport stop

**Example Request:**
```bash
curl "http://localhost:8080/api/v1/departures/stop/stop_ludwigsburg_hbf"
```

#### Get Live Departures for Multiple Stops
Retrieves live departure information for multiple stops simultaneously.

```http
POST /api/v1/departures/live
Content-Type: application/json

{
  "stopIds": ["stop_ludwigsburg_hbf", "stop_arsenalplatz"]
}
```

**Request Body:**
```json
{
  "stopIds": ["stop_ludwigsburg_hbf", "stop_arsenalplatz"]
}
```

### 2. Service Alerts

#### Get Active Alerts
Retrieves all active service alerts, optionally filtered by postal code.

```http
GET /api/v1/alerts?pincode={pincode}
```

**Parameters:**
- `pincode` (optional): Filter alerts relevant to a specific postal code area

**Example Request:**
```bash
curl "http://localhost:8080/api/v1/alerts?pincode=71634"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "alert_1",
      "alert_type": "warning",
      "title": "S4 Line Delays",
      "description": "Signal maintenance causing 5-10 minute delays",
      "severity": "medium",
      "affected_lines": ["S4"],
      "start_time": "2024-01-20T13:00:00Z",
      "end_time": "2024-01-20T16:00:00Z",
      "is_active": true
    }
  ],
  "message": "Active alerts retrieved for pincode: 71634"
}
```

#### Get Alerts by Line
Retrieves alerts specific to a transport line.

```http
GET /api/v1/alerts/line/{lineNumber}
```

**Parameters:**
- `lineNumber` (required): Transport line identifier (e.g., "S4", "443")

### 3. Transport Stops

#### Get Stops by Pincode
Retrieves all transport stops within a postal code area.

```http
GET /api/v1/stops?pincode={pincode}
```

**Parameters:**
- `pincode` (required): 5-digit German postal code

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "stop_ludwigsburg_hbf",
      "name": "Ludwigsburg Hauptbahnhof",
      "stop_type": "mixed",
      "latitude": 48.8974,
      "longitude": 9.1907,
      "pincode": "71634",
      "address": "Bahnhofstraße 1",
      "is_active": true
    }
  ],
  "message": "Stops retrieved for pincode: 71634"
}
```

#### Search Stops
Searches for transport stops by name or address.

```http
GET /api/v1/stops/search?q={query}
```

**Parameters:**
- `q` (required): Search query string

### 4. Health Check

#### System Health
Checks the API health status.

```http
GET /api/v1/health
```

**Example Response:**
```json
{
  "status": "UP",
  "timestamp": "2024-01-20T14:30:00Z",
  "service": "LiveLink API"
}
```

## Data Models

### ApiDeparture
```typescript
interface ApiDeparture {
  id: string;
  transportType: "bus" | "train" | "tram";
  lineNumber: string;
  destination: string;
  scheduledDeparture: string;      // HH:mm format
  actualDeparture?: string;        // HH:mm format
  platform?: string;
  status: "on-time" | "delayed" | "cancelled" | "boarding";
  delayMinutes?: number;
  nextDepartures: string[];        // Array of HH:mm times
  stopId: string;
  stopName: string;
}
```

### TransportStop
```typescript
interface TransportStop {
  id: string;
  name: string;
  stop_type: "bus" | "train" | "tram" | "mixed";
  latitude: number;
  longitude: number;
  pincode: string;
  address: string;
  is_active: boolean;
}
```

### ServiceAlert
```typescript
interface ServiceAlert {
  id: string;
  alert_type: "warning" | "info" | "disruption";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  affected_lines: string[];
  start_time: string;              // ISO 8601 format
  end_time?: string;               // ISO 8601 format
  is_active: boolean;
}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PINCODE",
    "message": "Pincode must be exactly 5 digits"
  },
  "timestamp": "2024-01-20T14:30:00Z"
}
```

## Rate Limiting
Currently no rate limiting is implemented. Production deployment should include appropriate rate limiting.

## CORS Policy
The API currently allows cross-origin requests from:
- `http://localhost:3000` (development frontend)
- `http://frontend:3000` (Docker environment)

## Sample Data
The API includes comprehensive sample data for the Ludwigsburg area:

### Postal Code Areas
- `71634` - Central Ludwigsburg (Hauptbahnhof, Arsenalplatz)
- `71636` - West Ludwigsburg (Marienplatz)
- `71638` - East Ludwigsburg (Neckarweihingen)
- `71640` - South Ludwigsburg (Aldingen)

### Transport Lines
- **Trains**: S4 (Stuttgart), S5 (Bietigheim-Bissingen)
- **Buses**: 42, 421, 422, 443, 444
- **Trams**: 1, 2

## Setup & Testing

### Prerequisites
1. PostgreSQL database running
2. Spring Boot application started
3. Database initialized with schema and sample data

### Quick Test
```bash
# Test API connectivity
curl "http://localhost:8080/api/v1/health"

# Get departures for central Ludwigsburg
curl "http://localhost:8080/api/v1/departures?pincode=71634"

# Get active alerts
curl "http://localhost:8080/api/v1/alerts"
```

### Database Setup
1. Run `database/init/01_schema.sql` to create tables
2. Run `database/init/02_dummy_data.sql` to populate with sample data

## Future Enhancements
- User authentication and authorization
- Real-time WebSocket updates
- Route planning algorithm
- Mobile app support
- Advanced filtering and search
- Performance monitoring and analytics