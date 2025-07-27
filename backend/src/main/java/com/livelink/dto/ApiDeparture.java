package com.livelink.dto;

import java.util.List;

public class ApiDeparture {
    private String id;
    private String transportType;
    private String lineNumber;
    private String destination;
    private String scheduledDeparture;
    private String actualDeparture;
    private String platform;
    private String status;
    private Integer delayMinutes;
    private List<String> nextDepartures;
    private String stopId;
    private String stopName;

    // Constructors
    public ApiDeparture() {}

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTransportType() { return transportType; }
    public void setTransportType(String transportType) { this.transportType = transportType; }
    public String getLineNumber() { return lineNumber; }
    public void setLineNumber(String lineNumber) { this.lineNumber = lineNumber; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getScheduledDeparture() { return scheduledDeparture; }
    public void setScheduledDeparture(String scheduledDeparture) { this.scheduledDeparture = scheduledDeparture; }
    public String getActualDeparture() { return actualDeparture; }
    public void setActualDeparture(String actualDeparture) { this.actualDeparture = actualDeparture; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getDelayMinutes() { return delayMinutes; }
    public void setDelayMinutes(Integer delayMinutes) { this.delayMinutes = delayMinutes; }
    public List<String> getNextDepartures() { return nextDepartures; }
    public void setNextDepartures(List<String> nextDepartures) { this.nextDepartures = nextDepartures; }
    public String getStopId() { return stopId; }
    public void setStopId(String stopId) { this.stopId = stopId; }
    public String getStopName() { return stopName; }
    public void setStopName(String stopName) { this.stopName = stopName; }
}