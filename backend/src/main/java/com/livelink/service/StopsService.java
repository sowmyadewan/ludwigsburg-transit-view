package com.livelink.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class StopsService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getStopsByPincode(String pincode) {
        String sql = """
            SELECT 
                id,
                name,
                stop_type,
                latitude,
                longitude,
                pincode,
                address,
                is_active
            FROM transport_stops
            WHERE pincode = ?
            AND is_active = true
            ORDER BY name ASC
            """;
            
        return jdbcTemplate.queryForList(sql, pincode);
    }

    public List<Map<String, Object>> searchStops(String query) {
        String sql = """
            SELECT 
                id,
                name,
                stop_type,
                latitude,
                longitude,
                pincode,
                address,
                is_active
            FROM transport_stops
            WHERE (LOWER(name) LIKE LOWER(?) OR LOWER(address) LIKE LOWER(?))
            AND is_active = true
            ORDER BY 
                CASE WHEN LOWER(name) LIKE LOWER(?) THEN 1 ELSE 2 END,
                name ASC
            LIMIT 20
            """;
            
        String searchPattern = "%" + query + "%";
        String exactPattern = query + "%";
        
        return jdbcTemplate.queryForList(sql, searchPattern, searchPattern, exactPattern);
    }
}