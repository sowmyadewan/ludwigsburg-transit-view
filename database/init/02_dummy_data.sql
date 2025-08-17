-- LiveLink Dummy Data for Testing
-- Insert comprehensive test data for Ludwigsburg area

-- Insert more transport stops
INSERT INTO transport_stops (id, name, stop_type, latitude, longitude, pincode, address) VALUES
('stop_ludwigsburg_hbf', 'Ludwigsburg Hauptbahnhof', 'mixed', 48.8974, 9.1907, '71634', 'Bahnhofstraße 1'),
('stop_arsenalplatz', 'Arsenalplatz', 'bus', 48.8965, 9.1901, '71634', 'Arsenalplatz'),
('stop_schlossstrasse', 'Schlossstraße', 'bus', 48.8945, 9.1889, '71634', 'Schlossstraße'),
('stop_marienplatz', 'Marienplatz', 'tram', 48.8934, 9.1867, '71636', 'Marienplatz'),
('stop_neckarweihingen', 'Neckarweihingen Bahnhof', 'train', 48.9123, 9.2034, '71638', 'Bahnhofstraße 15'),
('stop_kornwestheim', 'Kornwestheim Bahnhof', 'train', 48.8643, 9.1813, '70806', 'Bahnhofstraße 10'),
('stop_remseck', 'Remseck am Neckar', 'bus', 48.8756, 9.2789, '71686', 'Hauptstraße 45'),
('stop_aldingen', 'Aldingen', 'tram', 48.8823, 9.1456, '71640', 'Dorfstraße 12');

-- Insert transport lines
INSERT INTO transport_lines (id, line_number, transport_type, operator, color_code) VALUES
('line_s4', 'S4', 'train', 'DB Regio', '#00A651'),
('line_s5', 'S5', 'train', 'DB Regio', '#9B59B6'),
('line_443', '443', 'bus', 'VVS', '#E74C3C'),
('line_42', '42', 'bus', 'VVS', '#3498DB'),
('line_421', '421', 'bus', 'VVS', '#2ECC71'),
('line_422', '422', 'bus', 'VVS', '#F1C40F'),
('line_444', '444', 'bus', 'VVS', '#E67E22'),
('line_tram1', '1', 'tram', 'SSB', '#F39C12'),
('line_tram2', '2', 'tram', 'SSB', '#8E44AD');

-- Insert scheduled departures for today (Monday = 1, Tuesday = 2, etc.)
INSERT INTO scheduled_departures (line_id, stop_id, departure_time, days_of_week, platform, direction) VALUES
-- S4 Train Line
('line_s4', 'stop_ludwigsburg_hbf', '14:32', '{1,2,3,4,5,6,7}', '2', 'Stuttgart Hauptbahnhof'),
('line_s4', 'stop_ludwigsburg_hbf', '14:47', '{1,2,3,4,5,6,7}', '2', 'Stuttgart Hauptbahnhof'),
('line_s4', 'stop_ludwigsburg_hbf', '15:02', '{1,2,3,4,5,6,7}', '2', 'Stuttgart Hauptbahnhof'),
('line_s4', 'stop_ludwigsburg_hbf', '15:17', '{1,2,3,4,5,6,7}', '2', 'Stuttgart Hauptbahnhof'),
('line_s4', 'stop_neckarweihingen', '14:38', '{1,2,3,4,5,6,7}', '3', 'Marbach'),
('line_s4', 'stop_neckarweihingen', '14:53', '{1,2,3,4,5,6,7}', '3', 'Marbach'),
('line_s4', 'stop_neckarweihingen', '15:08', '{1,2,3,4,5,6,7}', '3', 'Marbach'),

-- S5 Train Line
('line_s5', 'stop_ludwigsburg_hbf', '14:35', '{1,2,3,4,5,6,7}', '1', 'Bietigheim-Bissingen'),
('line_s5', 'stop_ludwigsburg_hbf', '14:50', '{1,2,3,4,5,6,7}', '1', 'Bietigheim-Bissingen'),
('line_s5', 'stop_ludwigsburg_hbf', '15:05', '{1,2,3,4,5,6,7}', '1', 'Bietigheim-Bissingen'),

-- Bus 443
('line_443', 'stop_arsenalplatz', '14:28', '{1,2,3,4,5,6,7}', NULL, 'Schlossstraße'),
('line_443', 'stop_arsenalplatz', '14:43', '{1,2,3,4,5,6,7}', NULL, 'Schlossstraße'),
('line_443', 'stop_arsenalplatz', '14:58', '{1,2,3,4,5,6,7}', NULL, 'Schlossstraße'),
('line_443', 'stop_arsenalplatz', '15:13', '{1,2,3,4,5,6,7}', NULL, 'Schlossstraße'),

-- Bus 42
('line_42', 'stop_marienplatz', '14:25', '{1,2,3,4,5,6,7}', NULL, 'Hauptbahnhof'),
('line_42', 'stop_marienplatz', '14:40', '{1,2,3,4,5,6,7}', NULL, 'Hauptbahnhof'),
('line_42', 'stop_marienplatz', '14:55', '{1,2,3,4,5,6,7}', NULL, 'Hauptbahnhof'),
('line_42', 'stop_marienplatz', '15:10', '{1,2,3,4,5,6,7}', NULL, 'Hauptbahnhof'),

-- Bus 421
('line_421', 'stop_schlossstrasse', '14:33', '{1,2,3,4,5,6,7}', NULL, 'Kornwestheim'),
('line_421', 'stop_schlossstrasse', '14:48', '{1,2,3,4,5,6,7}', NULL, 'Kornwestheim'),
('line_421', 'stop_schlossstrasse', '15:03', '{1,2,3,4,5,6,7}', NULL, 'Kornwestheim'),

-- Bus 422
('line_422', 'stop_remseck', '14:29', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg'),
('line_422', 'stop_remseck', '14:44', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg'),
('line_422', 'stop_remseck', '14:59', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg'),

-- Bus 444
('line_444', 'stop_neckarweihingen', '14:26', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg'),
('line_444', 'stop_neckarweihingen', '14:41', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg'),
('line_444', 'stop_neckarweihingen', '14:56', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg'),

-- Tram 1
('line_tram1', 'stop_marienplatz', '14:30', '{1,2,3,4,5,6,7}', NULL, 'Hauptbahnhof'),
('line_tram1', 'stop_marienplatz', '14:45', '{1,2,3,4,5,6,7}', NULL, 'Hauptbahnhof'),
('line_tram1', 'stop_marienplatz', '15:00', '{1,2,3,4,5,6,7}', NULL, 'Hauptbahnhof'),

-- Tram 2
('line_tram2', 'stop_aldingen', '14:31', '{1,2,3,4,5,6,7}', NULL, 'Zentrum'),
('line_tram2', 'stop_aldingen', '14:46', '{1,2,3,4,5,6,7}', NULL, 'Zentrum'),
('line_tram2', 'stop_aldingen', '15:01', '{1,2,3,4,5,6,7}', NULL, 'Zentrum');

-- Insert live departure updates (current status)
INSERT INTO live_departures (scheduled_departure_id, actual_departure_time, delay_minutes, status) 
SELECT 
    id,
    CASE 
        WHEN departure_time = '14:32' THEN CURRENT_TIMESTAMP + INTERVAL '5 minutes'  -- S4 delayed
        WHEN departure_time = '14:30' AND line_id = 'line_tram1' THEN NULL  -- Tram 1 cancelled
        ELSE CURRENT_TIMESTAMP + (departure_time - CURRENT_TIME)  -- On time
    END,
    CASE 
        WHEN departure_time = '14:32' THEN 5  -- S4 delayed by 5 min
        WHEN departure_time = '14:26' THEN 3  -- Bus 444 delayed by 3 min
        ELSE 0
    END,
    CASE 
        WHEN departure_time = '14:32' THEN 'delayed'
        WHEN departure_time = '14:30' AND line_id = 'line_tram1' THEN 'cancelled'
        WHEN departure_time = '14:35' AND line_id = 'line_s5' THEN 'boarding'
        ELSE 'on-time'
    END
FROM scheduled_departures 
WHERE departure_time BETWEEN '14:20' AND '15:30';

-- Insert service alerts
INSERT INTO service_alerts (alert_type, title, description, severity, affected_lines, start_time, end_time, is_active) VALUES
('warning', 'S4 Line Delays', 'Signal maintenance causing 5-10 minute delays between Ludwigsburg and Stuttgart', 'medium', '{S4}', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP + INTERVAL '3 hours', true),
('disruption', 'Tram Line 1 Service Disruption', 'Overhead line repairs. Replacement bus service available', 'high', '{1}', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP + INTERVAL '2 hours', true),
('info', 'Weekend Schedule Changes', 'Reduced service frequency on weekends for lines 42, 421, 422', 'low', '{42,421,422}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 days', true);

-- Insert sample users
INSERT INTO users (name, email, password_hash, user_type, pincode) VALUES
('Max Müller', 'max.mueller@example.com', '$2a$10$example.hash.for.password123', 'commuter', '71634'),
('Anna Schmidt', 'anna.schmidt@example.com', '$2a$10$example.hash.for.password456', 'tourist', '71636'),
('Hans Weber', 'hans.weber@example.com', '$2a$10$example.hash.for.password789', 'senior', '71638');