package com.livelink.controller;

import com.livelink.dto.ApiResponse;
import com.livelink.dto.ApiDeparture;
import com.livelink.service.DeparturesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class DeparturesController {

    @Autowired
    private DeparturesService departuresService;

    @GetMapping("/departures")
    public ResponseEntity<ApiResponse<List<ApiDeparture>>> getDeparturesByPincode(
            @RequestParam String pincode) {
        
        List<ApiDeparture> departures = departuresService.getDeparturesByPincode(pincode);
        
        return ResponseEntity.ok(ApiResponse.success(departures, 
            "Departures retrieved for pincode: " + pincode));
    }

    @GetMapping("/departures/stop/{stopId}")
    public ResponseEntity<ApiResponse<List<ApiDeparture>>> getDeparturesByStop(
            @PathVariable String stopId) {
        
        List<ApiDeparture> departures = departuresService.getDeparturesByStop(stopId);
        
        return ResponseEntity.ok(ApiResponse.success(departures,
            "Departures retrieved for stop: " + stopId));
    }

    @PostMapping("/departures/live")
    public ResponseEntity<ApiResponse<List<ApiDeparture>>> getLiveDepartures(
            @RequestBody List<String> stopIds) {
        
        List<ApiDeparture> departures = departuresService.getLiveDepartures(stopIds);
        
        return ResponseEntity.ok(ApiResponse.success(departures,
            "Live departures retrieved"));
    }
}