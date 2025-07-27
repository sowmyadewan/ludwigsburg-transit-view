package com.livelink.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "transport_lines")
public class TransportLine {
    @Id
    private String id;
    
    @Column(name = "line_number", nullable = false)
    private String lineNumber;
    
    @Column(name = "transport_type", nullable = false)
    private String transportType;
    
    private String operator;
    
    @Column(name = "color_code")
    private String colorCode;
    
    @Column(name = "is_active")
    private Boolean isActive = true;

    // Constructors
    public TransportLine() {}
    
    public TransportLine(String id, String lineNumber, String transportType) {
        this.id = id;
        this.lineNumber = lineNumber;
        this.transportType = transportType;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLineNumber() { return lineNumber; }
    public void setLineNumber(String lineNumber) { this.lineNumber = lineNumber; }
    public String getTransportType() { return transportType; }
    public void setTransportType(String transportType) { this.transportType = transportType; }
    public String getOperator() { return operator; }
    public void setOperator(String operator) { this.operator = operator; }
    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}