# LiveLink Ludwigsburg - Full Stack Setup Guide

## Architecture Overview

```
Frontend (React/Vite) → API Gateway → Backend (Spring Boot) → PostgreSQL
                                   ↓
                              Prometheus → Grafana
```

## 🚀 Quick Start

### 1. Project Structure
```
livelink-project/
├── frontend/                 # This React app
│   ├── src/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                  # Your IntelliJ Spring Boot app
│   ├── src/main/java/
│   ├── Dockerfile
│   └── pom.xml
├── database/
│   └── init/
│       └── 01_schema.sql
├── monitoring/
│   └── prometheus.yml
└── docker-compose.yml       # Root orchestration
```

### 2. Backend Integration (Spring Boot)

Add these dependencies to your `pom.xml`:

```xml
<!-- Spring Boot Actuator for monitoring -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Micrometer Prometheus registry -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>

<!-- PostgreSQL driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>

<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Redis for caching -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### 3. Backend Configuration (`application-docker.yml`)

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/livelink_db}
    username: ${SPRING_DATASOURCE_USERNAME:livelink_user}
    password: ${SPRING_DATASOURCE_PASSWORD:livelink_password}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  redis:
    host: ${SPRING_REDIS_HOST:localhost}
    port: ${SPRING_REDIS_PORT:6379}
    timeout: 2000ms

server:
  port: ${SERVER_PORT:8080}

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,info
  endpoint:
    health:
      show-details: always
    metrics:
      enabled: true
    prometheus:
      enabled: true
  metrics:
    export:
      prometheus:
        enabled: true

# CORS configuration
cors:
  allowed-origins: 
    - http://localhost:3000
    - http://frontend:3000
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
```

### 4. Sample Backend Controller

```java
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
        
        return ResponseEntity.ok(ApiResponse.<List<ApiDeparture>>builder()
            .data(departures)
            .success(true)
            .timestamp(Instant.now().toString())
            .build());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = Map.of(
            "status", "UP",
            "timestamp", Instant.now().toString()
        );
        return ResponseEntity.ok(status);
    }
}
```

## 🐳 Docker Deployment

### 1. Build and Run

```bash
# Navigate to your project root
cd livelink-project/

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 2. Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **PostgreSQL**: localhost:5432
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

### 3. Database Connection

The PostgreSQL database will be automatically initialized with the schema and sample data.

```bash
# Connect to database
docker exec -it livelink_postgres psql -U livelink_user -d livelink_db

# Run queries
SELECT * FROM transport_stops WHERE pincode = '71634';
```

## 📊 Monitoring Setup

### 1. Prometheus Metrics

Your Spring Boot app will expose metrics at:
- http://localhost:8080/actuator/prometheus
- http://localhost:8080/actuator/health
- http://localhost:8080/actuator/metrics

### 2. Key Metrics to Monitor

- **API Response Times**: `http_server_requests_seconds`
- **Database Connections**: `hikaricp_connections`
- **JVM Memory**: `jvm_memory_used_bytes`
- **Custom Business Metrics**: 
  - Departures requested per minute
  - Route planning requests
  - Alert notifications sent

### 3. Custom Metrics Example

```java
@Service
public class DeparturesService {
    
    private final MeterRegistry meterRegistry;
    private final Counter departuresRequestCounter;
    
    public DeparturesService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.departuresRequestCounter = Counter.builder("departures_requests_total")
            .description("Total departures requests")
            .tag("pincode", "unknown")
            .register(meterRegistry);
    }
    
    public List<ApiDeparture> getDeparturesByPincode(String pincode) {
        departuresRequestCounter.increment(Tags.of("pincode", pincode));
        
        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            // Your business logic here
            return fetchDepartures(pincode);
        } finally {
            sample.stop(Timer.builder("departures_request_duration")
                .description("Departures request duration")
                .register(meterRegistry));
        }
    }
}
```

## 🚀 Development Workflow

### 1. Local Development
```bash
# Start only database and monitoring
docker-compose up -d postgres redis prometheus grafana

# Run backend in IntelliJ with profile: docker
# Run frontend: npm run dev

# Frontend will connect to localhost:8080
```

### 2. Environment Variables

Create `.env` file for local development:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
SPRING_PROFILES_ACTIVE=docker
```

### 3. API Integration

The frontend is already configured to use your backend API. Update the `API_BASE_URL` in `src/services/api.ts` if needed.

## 📈 Next Steps

1. **Deploy dummy data**: Import your current dummy data into PostgreSQL
2. **API implementation**: Implement the endpoints in your Spring Boot app
3. **Real-time updates**: Add WebSocket support for live departures
4. **Authentication**: Integrate user authentication
5. **Caching**: Implement Redis caching for frequently requested data
6. **Alerting**: Set up Prometheus alerting rules

## 🔧 Troubleshooting

### Common Issues:

1. **Port conflicts**: Change ports in docker-compose.yml if 3000/8080/5432 are in use
2. **Database connection**: Ensure PostgreSQL is ready before backend starts
3. **CORS errors**: Verify CORS configuration in backend
4. **Hot reload**: Frontend changes should be reflected immediately in development

### Useful Commands:

```bash
# Reset database
docker-compose down postgres
docker volume rm livelink_postgres_data
docker-compose up -d postgres

# Restart single service
docker-compose restart backend

# View real-time logs
docker-compose logs -f --tail=100 backend
```

This setup provides a production-ready foundation for your LiveLink application with monitoring, scalability, and development convenience!