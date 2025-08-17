package com.livelink.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service
public class AlertsService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getActiveAlerts(String pincode) {
        String sql = """
            SELECT 
                sa.id,
                sa.alert_type,
                sa.title,
                sa.description,
                sa.severity,
                sa.affected_lines,
                sa.start_time,
                sa.end_time,
                sa.is_active
            FROM service_alerts sa
            WHERE sa.is_active = true
            AND sa.start_time <= CURRENT_TIMESTAMP
            AND (sa.end_time IS NULL OR sa.end_time >= CURRENT_TIMESTAMP)
            """;
            
        if (pincode != null && !pincode.isEmpty()) {
            sql += " AND EXISTS (SELECT 1 FROM transport_stops ts WHERE ts.pincode = ? AND sa.affected_lines && ARRAY(SELECT line_number FROM transport_lines tl JOIN scheduled_departures sd ON tl.id = sd.line_id WHERE sd.stop_id = ts.id))";
            return jdbcTemplate.queryForList(sql, pincode);
        }
        
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getAlertsByLine(String lineNumber) {
        String sql = """
            SELECT 
                sa.id,
                sa.alert_type,
                sa.title,
                sa.description,
                sa.severity,
                sa.affected_lines,
                sa.start_time,
                sa.end_time,
                sa.is_active
            FROM service_alerts sa
            WHERE sa.is_active = true
            AND sa.start_time <= CURRENT_TIMESTAMP
            AND (sa.end_time IS NULL OR sa.end_time >= CURRENT_TIMESTAMP)
            AND ? = ANY(sa.affected_lines)
            ORDER BY sa.severity DESC, sa.start_time DESC
            """;
            
        return jdbcTemplate.queryForList(sql, lineNumber);
    }
}