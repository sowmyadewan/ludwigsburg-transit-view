package com.livelink.repository;

import com.livelink.entity.TransportStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportStopRepository extends JpaRepository<TransportStop, String> {
    List<TransportStop> findByPincodeAndIsActiveTrue(String pincode);
    List<TransportStop> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
}