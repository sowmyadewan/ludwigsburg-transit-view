package com.livelink.service;

import com.livelink.dto.ApiDeparture;
import com.livelink.entity.TransportStop;
import com.livelink.repository.TransportStopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class DeparturesService {

    @Autowired
    private TransportStopRepository transportStopRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ApiDeparture> getDeparturesByPincode(String pincode) {
        String sql = """
            SELECT 
                sd.id as departure_id,
                tl.transport_type,
                tl.line_number,
                sd.direction as destination,
                sd.departure_time,
                ld.actual_departure_time,
                sd.platform,
                COALESCE(ld.status, 'on-time') as status,
                COALESCE(ld.delay_minutes, 0) as delay_minutes,
                ts.id as stop_id,
                ts.name as stop_name
            FROM scheduled_departures sd
            JOIN transport_lines tl ON sd.line_id = tl.id
            JOIN transport_stops ts ON sd.stop_id = ts.id
            LEFT JOIN live_departures ld ON sd.id = ld.scheduled_departure_id
            WHERE ts.pincode = ? 
            AND ts.is_active = true
            AND tl.is_active = true
            AND sd.is_active = true
            AND sd.departure_time >= CURRENT_TIME
            AND sd.departure_time <= CURRENT_TIME + INTERVAL '2 hours'
            AND EXTRACT(dow FROM CURRENT_DATE) + 1 = ANY(sd.days_of_week)
            ORDER BY sd.departure_time ASC
            LIMIT 20
            """;
            
        return jdbcTemplate.query(sql, new DepartureRowMapper(), pincode);
    }

    public List<ApiDeparture> getDeparturesByStop(String stopId) {
        String sql = """
            SELECT 
                sd.id as departure_id,
                tl.transport_type,
                tl.line_number,
                sd.direction as destination,
                sd.departure_time,
                ld.actual_departure_time,
                sd.platform,
                COALESCE(ld.status, 'on-time') as status,
                COALESCE(ld.delay_minutes, 0) as delay_minutes,
                ts.id as stop_id,
                ts.name as stop_name
            FROM scheduled_departures sd
            JOIN transport_lines tl ON sd.line_id = tl.id
            JOIN transport_stops ts ON sd.stop_id = ts.id
            LEFT JOIN live_departures ld ON sd.id = ld.scheduled_departure_id
            WHERE ts.id = ? 
            AND ts.is_active = true
            AND tl.is_active = true
            AND sd.is_active = true
            AND sd.departure_time >= CURRENT_TIME
            AND sd.departure_time <= CURRENT_TIME + INTERVAL '2 hours'
            AND EXTRACT(dow FROM CURRENT_DATE) + 1 = ANY(sd.days_of_week)
            ORDER BY sd.departure_time ASC
            LIMIT 10
            """;
            
        return jdbcTemplate.query(sql, new DepartureRowMapper(), stopId);
    }

    public List<ApiDeparture> getLiveDepartures(List<String> stopIds) {
        if (stopIds.isEmpty()) {
            return List.of();
        }
        
        String placeholders = String.join(",", stopIds.stream().map(id -> "?").collect(Collectors.toList()));
        String sql = """
            SELECT 
                sd.id as departure_id,
                tl.transport_type,
                tl.line_number,
                sd.direction as destination,
                sd.departure_time,
                ld.actual_departure_time,
                sd.platform,
                COALESCE(ld.status, 'on-time') as status,
                COALESCE(ld.delay_minutes, 0) as delay_minutes,
                ts.id as stop_id,
                ts.name as stop_name
            FROM scheduled_departures sd
            JOIN transport_lines tl ON sd.line_id = tl.id
            JOIN transport_stops ts ON sd.stop_id = ts.id
            LEFT JOIN live_departures ld ON sd.id = ld.scheduled_departure_id
            WHERE ts.id IN (""" + placeholders + """
            )
            AND ts.is_active = true
            AND tl.is_active = true
            AND sd.is_active = true
            AND sd.departure_time >= CURRENT_TIME
            AND sd.departure_time <= CURRENT_TIME + INTERVAL '2 hours'
            AND EXTRACT(dow FROM CURRENT_DATE) + 1 = ANY(sd.days_of_week)
            ORDER BY sd.departure_time ASC
            """;
            
        return jdbcTemplate.query(sql, new DepartureRowMapper(), stopIds.toArray());
    }

    private static class DepartureRowMapper implements RowMapper<ApiDeparture> {
        @Override
        public ApiDeparture mapRow(ResultSet rs, int rowNum) throws SQLException {
            ApiDeparture departure = new ApiDeparture();
            departure.setId(rs.getString("departure_id"));
            departure.setTransportType(rs.getString("transport_type"));
            departure.setLineNumber(rs.getString("line_number"));
            departure.setDestination(rs.getString("destination"));
            
            // Format time for display
            LocalTime depTime = rs.getTime("departure_time").toLocalTime();
            departure.setScheduledDeparture(depTime.format(DateTimeFormatter.ofPattern("HH:mm")));
            
            // Handle actual departure time if available
            if (rs.getTimestamp("actual_departure_time") != null) {
                LocalTime actualTime = rs.getTimestamp("actual_departure_time").toLocalDateTime().toLocalTime();
                departure.setActualDeparture(actualTime.format(DateTimeFormatter.ofPattern("HH:mm")));
            }
            
            departure.setPlatform(rs.getString("platform"));
            departure.setStatus(rs.getString("status"));
            
            int delayMinutes = rs.getInt("delay_minutes");
            if (delayMinutes > 0) {
                departure.setDelayMinutes(delayMinutes);
            }
            
            departure.setStopId(rs.getString("stop_id"));
            departure.setStopName(rs.getString("stop_name"));
            
            // Generate next departures (simplified for demo)
            departure.setNextDepartures(generateNextDepartures(depTime, 3));
            
            return departure;
        }
        
        private List<String> generateNextDepartures(LocalTime baseTime, int count) {
            return java.util.stream.IntStream.range(1, count + 1)
                .mapToObj(i -> baseTime.plusMinutes(15 * i).format(DateTimeFormatter.ofPattern("HH:mm")))
                .collect(Collectors.toList());
        }
    }
}