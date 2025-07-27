package com.livelink.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transport_stops")
public class TransportStop {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "stop_type", nullable = false)
    private String stopType;
    
    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @Column(nullable = false, length = 5)
    private String pincode;
    
    private String address;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public TransportStop() {}
    
    public TransportStop(String id, String name, String stopType, String pincode) {
        this.id = id;
        this.name = name;
        this.stopType = stopType;
        this.pincode = pincode;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStopType() { return stopType; }
    public void setStopType(String stopType) { this.stopType = stopType; }
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}