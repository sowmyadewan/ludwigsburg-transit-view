package com.livelink.service;

import com.livelink.dto.ApiDeparture;
import com.livelink.entity.TransportStop;
import com.livelink.repository.TransportStopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeparturesService {

    @Autowired
    private TransportStopRepository transportStopRepository;

    public List<ApiDeparture> getDeparturesByPincode(String pincode) {
        List<TransportStop> stops = transportStopRepository.findByPincodeAndIsActiveTrue(pincode);
        
        // For now, return dummy data based on pincode
        return createDummyDepartures(pincode, stops);
    }

    public List<ApiDeparture> getDeparturesByStop(String stopId) {
        TransportStop stop = transportStopRepository.findById(stopId).orElse(null);
        if (stop == null) {
            return List.of();
        }
        
        return createDummyDeparturesForStop(stop);
    }

    public List<ApiDeparture> getLiveDepartures(List<String> stopIds) {
        List<TransportStop> stops = transportStopRepository.findAllById(stopIds);
        
        return stops.stream()
                .flatMap(stop -> createDummyDeparturesForStop(stop).stream())
                .collect(Collectors.toList());
    }

    private List<ApiDeparture> createDummyDepartures(String pincode, List<TransportStop> stops) {
        if ("71634".equals(pincode)) {
            return Arrays.asList(
                createDeparture("dep_1", "train", "S4", "Stuttgart Hauptbahnhof", 
                    "14:32", "14:37", "2", "delayed", 5, 
                    Arrays.asList("14:47", "15:02", "15:17"),
                    "stop_ludwigsburg_hbf", "Ludwigsburg Hauptbahnhof"),
                createDeparture("dep_2", "bus", "443", "Schlossstraße", 
                    "14:28", null, null, "on-time", null,
                    Arrays.asList("14:43", "14:58", "15:13"),
                    "stop_arsenalplatz", "Arsenalplatz"),
                createDeparture("dep_3", "bus", "42", "Marienplatz", 
                    "14:35", null, "B1", "on-time", null,
                    Arrays.asList("14:50", "15:05", "15:20"),
                    "stop_schlossstrasse", "Schlossstraße")
            );
        }
        
        // Default dummy data for other pincodes
        return Arrays.asList(
            createDeparture("dep_default", "bus", "Local", "City Center", 
                "14:30", null, null, "on-time", null,
                Arrays.asList("14:45", "15:00", "15:15"),
                "stop_default", "Local Stop")
        );
    }

    private List<ApiDeparture> createDummyDeparturesForStop(TransportStop stop) {
        return Arrays.asList(
            createDeparture("dep_" + stop.getId(), "bus", "Local", "Destination", 
                "14:30", null, null, "on-time", null,
                Arrays.asList("14:45", "15:00", "15:15"),
                stop.getId(), stop.getName())
        );
    }

    private ApiDeparture createDeparture(String id, String transportType, String lineNumber,
                                       String destination, String scheduledDeparture, String actualDeparture,
                                       String platform, String status, Integer delayMinutes,
                                       List<String> nextDepartures, String stopId, String stopName) {
        ApiDeparture departure = new ApiDeparture();
        departure.setId(id);
        departure.setTransportType(transportType);
        departure.setLineNumber(lineNumber);
        departure.setDestination(destination);
        departure.setScheduledDeparture(scheduledDeparture);
        departure.setActualDeparture(actualDeparture);
        departure.setPlatform(platform);
        departure.setStatus(status);
        departure.setDelayMinutes(delayMinutes);
        departure.setNextDepartures(nextDepartures);
        departure.setStopId(stopId);
        departure.setStopName(stopName);
        return departure;
    }
}