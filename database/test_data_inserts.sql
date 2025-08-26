-- Insert queries to populate departure data for testing
-- These queries will ensure the departure API returns results

-- First, let's add more transport stops for pincode 71638 area
INSERT INTO transport_stops (id, name, stop_type, latitude, longitude, pincode, address, is_active) VALUES
('stop_neckarweihingen_zentrum', 'Neckarweihingen Zentrum', 'bus', 48.9135, 9.2045, '71638', 'Hauptstraße 25', true),
('stop_neckarweihingen_rathaus', 'Neckarweihingen Rathaus', 'bus', 48.9145, 9.2055, '71638', 'Rathausplatz 1', true),
('stop_neckarweihingen_schule', 'Neckarweihingen Schule', 'bus', 48.9155, 9.2065, '71638', 'Schulstraße 10', true)
ON CONFLICT (id) DO NOTHING;

-- Add more transport lines
INSERT INTO transport_lines (id, line_number, transport_type, operator, color_code, is_active) VALUES
('line_620', '620', 'bus', 'VVS', '#FF5722', true),
('line_621', '621', 'bus', 'VVS', '#2196F3', true),
('line_s4_regional', 'S4', 'train', 'DB Regio', '#4CAF50', true)
ON CONFLICT (id) DO NOTHING;

-- Insert scheduled departures for the next few hours (all days of week: 1-7)
-- Morning departures (6:00 - 12:00)
INSERT INTO scheduled_departures (line_id, stop_id, departure_time, days_of_week, platform, direction, is_active) VALUES
-- S4 Train at Neckarweihingen Bahnhof
('line_s4', 'stop_neckarweihingen', '06:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '06:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '07:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '07:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '08:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '08:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '09:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '09:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '10:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '10:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '11:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '11:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),

-- Opposite direction
('line_s4', 'stop_neckarweihingen', '06:30:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '07:00:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '07:30:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '08:00:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '08:30:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '09:00:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '09:30:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '10:00:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '10:30:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '11:00:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),
('line_s4', 'stop_neckarweihingen', '11:30:00', '{1,2,3,4,5,6,7}', '2', 'Backnang', true),

-- Bus Line 620 at Neckarweihingen Zentrum
('line_620', 'stop_neckarweihingen_zentrum', '06:10:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '06:40:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '07:10:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '07:40:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '08:10:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '08:40:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '09:10:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '09:40:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '10:10:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '10:40:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '11:10:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),
('line_620', 'stop_neckarweihingen_zentrum', '11:40:00', '{1,2,3,4,5,6,7}', NULL, 'Ludwigsburg Bahnhof', true),

-- Bus Line 621 at Neckarweihingen Rathaus
('line_621', 'stop_neckarweihingen_rathaus', '06:25:00', '{1,2,3,4,5,6,7}', NULL, 'Marbach am Neckar', true),
('line_621', 'stop_neckarweihingen_rathaus', '07:25:00', '{1,2,3,4,5,6,7}', NULL, 'Marbach am Neckar', true),
('line_621', 'stop_neckarweihingen_rathaus', '08:25:00', '{1,2,3,4,5,6,7}', NULL, 'Marbach am Neckar', true),
('line_621', 'stop_neckarweihingen_rathaus', '09:25:00', '{1,2,3,4,5,6,7}', NULL, 'Marbach am Neckar', true),
('line_621', 'stop_neckarweihingen_rathaus', '10:25:00', '{1,2,3,4,5,6,7}', NULL, 'Marbach am Neckar', true),
('line_621', 'stop_neckarweihingen_rathaus', '11:25:00', '{1,2,3,4,5,6,7}', NULL, 'Marbach am Neckar', true),

-- Afternoon departures (12:00 - 18:00)
('line_s4', 'stop_neckarweihingen', '12:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '12:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '13:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '13:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '14:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '14:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '15:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '15:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '16:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '16:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '17:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '17:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),

-- Evening departures (18:00 - 23:00)
('line_s4', 'stop_neckarweihingen', '18:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '18:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '19:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '19:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '20:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '20:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '21:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '21:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '22:15:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true),
('line_s4', 'stop_neckarweihingen', '22:45:00', '{1,2,3,4,5,6,7}', '1', 'Stuttgart Hauptbahnhof', true);

-- Add some live departure updates to make it more realistic
-- Add multiple delayed departures with different delay times
INSERT INTO live_departures (scheduled_departure_id, actual_departure_time, delay_minutes, status, updated_at)
SELECT 
    sd.id,
    CURRENT_TIMESTAMP + (sd.departure_time - CURRENT_TIME) + INTERVAL '2 minutes',
    2,
    'delayed',
    CURRENT_TIMESTAMP
FROM scheduled_departures sd
JOIN transport_stops ts ON sd.stop_id = ts.id
WHERE ts.pincode = '71638' 
    AND sd.departure_time >= CURRENT_TIME 
    AND sd.departure_time <= CURRENT_TIME + INTERVAL '2 hours'
    AND sd.line_id = 'line_s4'
LIMIT 8;

-- Add more delayed departures with 5-minute delays
INSERT INTO live_departures (scheduled_departure_id, actual_departure_time, delay_minutes, status, updated_at)
SELECT 
    sd.id,
    CURRENT_TIMESTAMP + (sd.departure_time - CURRENT_TIME) + INTERVAL '5 minutes',
    5,
    'delayed',
    CURRENT_TIMESTAMP
FROM scheduled_departures sd
JOIN transport_stops ts ON sd.stop_id = ts.id
WHERE ts.pincode = '71638' 
    AND sd.departure_time >= CURRENT_TIME 
    AND sd.departure_time <= CURRENT_TIME + INTERVAL '2 hours'
    AND sd.line_id = 'line_620'
    AND sd.id NOT IN (SELECT scheduled_departure_id FROM live_departures WHERE scheduled_departure_id IS NOT NULL)
LIMIT 6;

-- Add major delays (10-15 minutes)
INSERT INTO live_departures (scheduled_departure_id, actual_departure_time, delay_minutes, status, updated_at)
SELECT 
    sd.id,
    CURRENT_TIMESTAMP + (sd.departure_time - CURRENT_TIME) + INTERVAL '12 minutes',
    12,
    'delayed',
    CURRENT_TIMESTAMP
FROM scheduled_departures sd
JOIN transport_stops ts ON sd.stop_id = ts.id
WHERE ts.pincode = '71638' 
    AND sd.departure_time >= CURRENT_TIME 
    AND sd.departure_time <= CURRENT_TIME + INTERVAL '2 hours'
    AND sd.line_id = 'line_621'
    AND sd.id NOT IN (SELECT scheduled_departure_id FROM live_departures WHERE scheduled_departure_id IS NOT NULL)
LIMIT 4;

-- Add some severely delayed departures (20+ minutes)
INSERT INTO live_departures (scheduled_departure_id, actual_departure_time, delay_minutes, status, updated_at)
SELECT 
    sd.id,
    CURRENT_TIMESTAMP + (sd.departure_time - CURRENT_TIME) + INTERVAL '25 minutes',
    25,
    'delayed',
    CURRENT_TIMESTAMP
FROM scheduled_departures sd
JOIN transport_stops ts ON sd.stop_id = ts.id
WHERE ts.pincode = '71638' 
    AND sd.departure_time >= CURRENT_TIME 
    AND sd.departure_time <= CURRENT_TIME + INTERVAL '1 hour'
    AND sd.id NOT IN (SELECT scheduled_departure_id FROM live_departures WHERE scheduled_departure_id IS NOT NULL)
LIMIT 3;

-- Add some cancelled departures
INSERT INTO live_departures (scheduled_departure_id, actual_departure_time, delay_minutes, status, updated_at)
SELECT 
    sd.id,
    NULL,
    NULL,
    'cancelled',
    CURRENT_TIMESTAMP
FROM scheduled_departures sd
JOIN transport_stops ts ON sd.stop_id = ts.id
WHERE ts.pincode = '71638' 
    AND sd.departure_time >= CURRENT_TIME 
    AND sd.departure_time <= CURRENT_TIME + INTERVAL '2 hours'
    AND sd.id NOT IN (SELECT scheduled_departure_id FROM live_departures WHERE scheduled_departure_id IS NOT NULL)
LIMIT 2;

-- Add some on-time departures
INSERT INTO live_departures (scheduled_departure_id, actual_departure_time, delay_minutes, status, updated_at)
SELECT 
    sd.id,
    CURRENT_TIMESTAMP + (sd.departure_time - CURRENT_TIME),
    0,
    'on-time',
    CURRENT_TIMESTAMP
FROM scheduled_departures sd
JOIN transport_stops ts ON sd.stop_id = ts.id
WHERE ts.pincode = '71638' 
    AND sd.departure_time >= CURRENT_TIME 
    AND sd.departure_time <= CURRENT_TIME + INTERVAL '2 hours'
    AND sd.id NOT IN (SELECT scheduled_departure_id FROM live_departures WHERE scheduled_departure_id IS NOT NULL)
LIMIT 15;

-- Verify the data
SELECT 'Data inserted successfully. Run your API query now to see results.' as message;