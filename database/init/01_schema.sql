-- LiveLink Database Schema
-- PostgreSQL initialization script

-- Create database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial data if needed

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('commuter', 'tourist', 'senior')),
    pincode VARCHAR(5) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transport stops
CREATE TABLE transport_stops (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stop_type VARCHAR(20) NOT NULL CHECK (stop_type IN ('bus', 'train', 'tram', 'mixed')),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    pincode VARCHAR(5) NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transport lines
CREATE TABLE transport_lines (
    id VARCHAR(50) PRIMARY KEY,
    line_number VARCHAR(20) NOT NULL,
    transport_type VARCHAR(20) NOT NULL CHECK (transport_type IN ('bus', 'train', 'tram')),
    operator VARCHAR(100),
    color_code VARCHAR(7), -- hex color
    is_active BOOLEAN DEFAULT true
);

-- Routes between stops
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    line_id VARCHAR(50) REFERENCES transport_lines(id),
    from_stop_id VARCHAR(50) REFERENCES transport_stops(id),
    to_stop_id VARCHAR(50) REFERENCES transport_stops(id),
    sequence_order INTEGER NOT NULL,
    travel_time_minutes INTEGER NOT NULL,
    distance_km DECIMAL(8, 3)
);

-- Scheduled departures
CREATE TABLE scheduled_departures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    line_id VARCHAR(50) REFERENCES transport_lines(id),
    stop_id VARCHAR(50) REFERENCES transport_stops(id),
    departure_time TIME NOT NULL,
    days_of_week INTEGER[] NOT NULL, -- [1,2,3,4,5] for Mon-Fri
    platform VARCHAR(10),
    direction VARCHAR(255),
    is_active BOOLEAN DEFAULT true
);

-- Live departure updates
CREATE TABLE live_departures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduled_departure_id UUID REFERENCES scheduled_departures(id),
    actual_departure_time TIMESTAMP WITH TIME ZONE,
    delay_minutes INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL CHECK (status IN ('on-time', 'delayed', 'cancelled', 'boarding')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service alerts
CREATE TABLE service_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('warning', 'info', 'disruption')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    affected_lines VARCHAR(20)[], -- array of line numbers
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    home_stop_id VARCHAR(50) REFERENCES transport_stops(id),
    work_stop_id VARCHAR(50) REFERENCES transport_stops(id),
    preferred_transport_types VARCHAR(20)[], -- ['bus', 'train', 'tram']
    max_walking_distance INTEGER DEFAULT 500, -- meters
    notifications_delays BOOLEAN DEFAULT true,
    notifications_disruptions BOOLEAN DEFAULT true,
    notifications_route_updates BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for Ludwigsburg
INSERT INTO transport_stops (id, name, stop_type, latitude, longitude, pincode, address) VALUES
('stop_ludwigsburg_hbf', 'Ludwigsburg Hauptbahnhof', 'mixed', 48.8974, 9.1907, '71634', 'Bahnhofstraße 1'),
('stop_arsenalplatz', 'Arsenalplatz', 'bus', 48.8965, 9.1901, '71634', 'Arsenalplatz'),
('stop_schlossstrasse', 'Schlossstraße', 'bus', 48.8945, 9.1889, '71634', 'Schlossstraße'),
('stop_marienplatz', 'Marienplatz', 'tram', 48.8934, 9.1867, '71636', 'Marienplatz'),
('stop_neckarweihingen', 'Neckarweihingen Bahnhof', 'train', 48.9123, 9.2034, '71638', 'Bahnhofstraße 15');

INSERT INTO transport_lines (id, line_number, transport_type, operator, color_code) VALUES
('line_s4', 'S4', 'train', 'DB Regio', '#00A651'),
('line_s5', 'S5', 'train', 'DB Regio', '#9B59B6'),
('line_443', '443', 'bus', 'VVS', '#E74C3C'),
('line_42', '42', 'bus', 'VVS', '#3498DB'),
('line_tram1', '1', 'tram', 'SSB', '#F39C12');

-- Add indexes for performance
CREATE INDEX idx_live_departures_scheduled_id ON live_departures(scheduled_departure_id);
CREATE INDEX idx_live_departures_updated_at ON live_departures(updated_at);
CREATE INDEX idx_scheduled_departures_stop_line ON scheduled_departures(stop_id, line_id);
CREATE INDEX idx_transport_stops_pincode ON transport_stops(pincode);
CREATE INDEX idx_service_alerts_active ON service_alerts(is_active, start_time);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();