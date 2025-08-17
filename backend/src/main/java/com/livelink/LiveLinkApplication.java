package com.livelink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {
        org.springframework.boot.actuate.autoconfigure.metrics.SystemMetricsAutoConfiguration.class,
        org.springframework.boot.actuate.autoconfigure.metrics.MetricsAutoConfiguration.class
})
@EnableCaching
@EnableScheduling
public class LiveLinkApplication {
    public static void main(String[] args) {
        SpringApplication.run(LiveLinkApplication.class, args);
    }
}