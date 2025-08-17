# LiveLink Ludwigsburg - Complete Local Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [Project Structure Overview](#project-structure-overview)
4. [Docker Environment Setup](#docker-environment-setup)
5. [Backend Setup (Spring Boot)](#backend-setup-spring-boot)
6. [Frontend Setup (React/Vite)](#frontend-setup-reactvite)
7. [Database Configuration](#database-configuration)
8. [Running the Complete Application](#running-the-complete-application)
9. [Testing & Verification](#testing--verification)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
```bash
# 1. Git
git --version  # Should show version 2.x or higher

# 2. Docker & Docker Compose
docker --version  # Should show version 20.x or higher
docker-compose --version  # Should show version 1.29 or higher

# 3. Java 17 (for Spring Boot)
java -version  # Should show Java 17

# 4. Maven 3.6+ (for Spring Boot)
mvn --version

# 5. Node.js 18+ (for React frontend)
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher

# 6. IntelliJ IDEA (recommended for Spring Boot development)
# Download from: https://www.jetbrains.com/idea/
```

### System Requirements
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 5GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)

## GitHub Setup

### Step 1: Fork or Clone Repository
```bash
# Option 1: If you have access to the original repository
git clone https://github.com/your-username/livelink-ludwigsburg.git
cd livelink-ludwigsburg

# Option 2: If working with Lovable's GitHub integration
# 1. In Lovable editor, click GitHub → Connect to GitHub
# 2. Authorize the Lovable GitHub App
# 3. Click Create Repository
# 4. Clone the created repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Step 2: Verify Project Structure
```bash
# Verify you have all necessary files
ls -la
# Should show:
# - backend/          (Spring Boot application)
# - src/              (React frontend)
# - database/         (SQL initialization scripts)
# - docker-compose.yml
# - Dockerfile
# - nginx.conf
# - package.json
```

## Project Structure Overview

```
livelink-ludwigsburg/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/livelink/
│   │   ├── LiveLinkApplication.java
│   │   ├── controller/         # REST Controllers
│   │   ├── service/           # Business Logic
│   │   ├── entity/            # JPA Entities
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── repository/        # Database Repositories
│   │   └── config/            # Configuration Classes
│   ├── src/main/resources/
│   │   ├── application.yml    # Main configuration
│   │   └── application-docker.yml  # Docker configuration
│   ├── pom.xml               # Maven dependencies
│   └── Dockerfile            # Backend Docker image
├── src/                      # React Frontend
│   ├── components/           # React components
│   ├── services/            # API service layer
│   ├── types/               # TypeScript type definitions
│   ├── pages/               # Page components
│   └── hooks/               # Custom React hooks
├── database/                # Database Setup
│   └── init/
│       ├── 01_schema.sql    # Database schema
│       └── 02_dummy_data.sql # Sample data
├── monitoring/              # Monitoring Configuration
│   └── prometheus.yml       # Prometheus configuration
├── docker-compose.yml       # Multi-container orchestration
├── Dockerfile              # Frontend Docker image
├── nginx.conf              # Nginx configuration
└── docs/                   # Documentation
    └── API_DOCUMENTATION.md # API reference
```

## Docker Environment Setup

### Step 1: Verify Docker Installation
```bash
# Test Docker installation
docker run hello-world

# Test Docker Compose
docker-compose --version
```

### Step 2: Create Environment Variables (Optional)
```bash
# Create .env file for custom configuration (optional)
cat > .env << EOF
# Database Configuration
POSTGRES_DB=livelink_db
POSTGRES_USER=livelink_user
POSTGRES_PASSWORD=livelink_password

# Spring Boot Configuration
SPRING_PROFILES_ACTIVE=docker

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8080/api/v1
EOF
```

### Step 3: Build Docker Images
```bash
# Build all services (this will take 5-10 minutes on first run)
docker-compose build

# Verify images were created
docker images | grep livelink
```

## Backend Setup (Spring Boot)

### Step 1: Open Backend in IntelliJ IDEA

```bash
# Method 1: Open IntelliJ and import project
# 1. Open IntelliJ IDEA
# 2. File → Open → Select the 'backend' folder
# 3. Choose "Open as Maven Project"
# 4. Wait for Maven dependencies to download

# Method 2: Command line (if IntelliJ CLI is installed)
idea backend/
```

### Step 2: Configure IntelliJ Project

1. **Set Project SDK**:
   - File → Project Structure → Project Settings → Project
   - Set Project SDK to Java 17
   - Set Project language level to "17 - Sealed types, always-strict floating-point semantics"

2. **Configure Maven**:
   - File → Settings → Build, Execution, Deployment → Build Tools → Maven
   - Verify Maven home directory is set correctly
   - Check "Import Maven projects automatically"

3. **Verify Dependencies**:
   - Open Maven tool window (View → Tool Windows → Maven)
   - Click refresh to ensure all dependencies are downloaded

### Step 3: Create Run Configuration

1. **Add Spring Boot Run Configuration**:
   - Run → Edit Configurations
   - Click "+" → Spring Boot
   - Name: "LiveLink Backend"
   - Main class: `com.livelink.LiveLinkApplication`
   - Active profiles: `default` (leave empty for local development)
   - Working directory: `$MODULE_WORKING_DIR$`

2. **Environment Variables** (if needed):
   - In the run configuration, add environment variables:
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/livelink_db
   SPRING_DATASOURCE_USERNAME=livelink_user
   SPRING_DATASOURCE_PASSWORD=livelink_password
   ```

### Step 4: Database Connection Setup

```bash
# Start only PostgreSQL and Redis for backend development
docker-compose up -d postgres redis

# Verify services are running
docker-compose ps

# Should show postgres and redis as "Up"
```

### Step 5: Initialize Database

```bash
# Connect to PostgreSQL and run initialization scripts
docker exec -i $(docker-compose ps -q postgres) psql -U livelink_user -d livelink_db < database/init/01_schema.sql
docker exec -i $(docker-compose ps -q postgres) psql -U livelink_user -d livelink_db < database/init/02_dummy_data.sql

# Verify data was inserted
docker exec -it $(docker-compose ps -q postgres) psql -U livelink_user -d livelink_db -c "SELECT COUNT(*) FROM transport_stops;"
```

### Step 6: Run Spring Boot Application

```bash
# Option 1: Run from IntelliJ
# Click the green play button next to your run configuration

# Option 2: Run from command line
cd backend
mvn spring-boot:run

# Option 3: Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=docker
```

### Step 7: Verify Backend is Running

```bash
# Test health endpoint
curl http://localhost:8080/api/v1/health

# Test departures endpoint
curl "http://localhost:8080/api/v1/departures?pincode=71634"

# Should return JSON with departure data
```

## Frontend Setup (React/Vite)

### Step 1: Install Node Dependencies

```bash
# Navigate to frontend directory (project root)
cd /path/to/your/project

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 2: Configure Development Environment

```bash
# Create .env.local for development (optional)
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:8080/api/v1
EOF
```

### Step 3: Start Development Server

```bash
# Start Vite development server
npm run dev

# Server should start on http://localhost:3000
# You should see:
# ➜  Local:   http://localhost:3000/
# ➜  Network: use --host to expose
```

### Step 4: Verify Frontend is Running

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Check Console**: Open browser DevTools → Console (should show no errors)
3. **Test API Connection**: The app should load departure data from your backend

## Database Configuration

### Step 1: Access Database Management

```bash
# Option 1: Command line access
docker exec -it $(docker-compose ps -q postgres) psql -U livelink_user -d livelink_db

# Option 2: Use a GUI tool like DBeaver or pgAdmin
# Connection details:
# Host: localhost
# Port: 5432
# Database: livelink_db
# Username: livelink_user
# Password: livelink_password
```

### Step 2: Verify Database Schema

```sql
-- Check tables were created
\dt

-- Verify sample data
SELECT COUNT(*) FROM transport_stops;
SELECT COUNT(*) FROM transport_lines;
SELECT COUNT(*) FROM scheduled_departures;

-- Test a query similar to what the API uses
SELECT 
    tl.line_number,
    ts.name as stop_name,
    sd.direction,
    sd.departure_time
FROM scheduled_departures sd
JOIN transport_lines tl ON sd.line_id = tl.id
JOIN transport_stops ts ON sd.stop_id = ts.id
WHERE ts.pincode = '71634'
LIMIT 5;
```

### Step 3: Database Backup & Restore (Optional)

```bash
# Create backup
docker exec $(docker-compose ps -q postgres) pg_dump -U livelink_user livelink_db > backup.sql

# Restore from backup
docker exec -i $(docker-compose ps -q postgres) psql -U livelink_user -d livelink_db < backup.sql
```

## Running the Complete Application

### Option 1: Full Docker Deployment

```bash
# Start all services with Docker Compose
docker-compose up -d

# Verify all services are running
docker-compose ps

# Should show all services as "Up":
# - postgres
# - redis
# - backend
# - frontend
# - prometheus
# - grafana

# Access points:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api/v1
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin)
```

### Option 2: Hybrid Development (Recommended)

```bash
# 1. Start infrastructure services
docker-compose up -d postgres redis prometheus grafana

# 2. Run backend in IntelliJ (for debugging)
# Click Run in IntelliJ IDEA

# 3. Run frontend with Vite (for hot reload)
npm run dev

# This gives you:
# - Database and cache in Docker (stable)
# - Backend in IDE (debuggable)
# - Frontend with hot reload (fast development)
```

### Option 3: Everything Local (Advanced)

```bash
# 1. Install and start PostgreSQL locally
# 2. Install and start Redis locally
# 3. Run backend: mvn spring-boot:run
# 4. Run frontend: npm run dev
```

## Testing & Verification

### Step 1: API Testing

```bash
# Test all main endpoints
curl http://localhost:8080/api/v1/health
curl "http://localhost:8080/api/v1/departures?pincode=71634"
curl "http://localhost:8080/api/v1/departures/stop/stop_ludwigsburg_hbf"
curl "http://localhost:8080/api/v1/alerts"
curl "http://localhost:8080/api/v1/stops?pincode=71634"
curl "http://localhost:8080/api/v1/stops/search?q=Ludwigsburg"
```

### Step 2: Frontend Testing

1. **User Registration**: Visit http://localhost:3000 and register a test user
2. **Dashboard**: Verify the dashboard loads with live data
3. **Route Search**: Test the route planner functionality
4. **Alerts**: Check service alerts are displayed
5. **Refresh**: Test the refresh functionality

### Step 3: Database Verification

```sql
-- Connect to database and verify data integrity
docker exec -it $(docker-compose ps -q postgres) psql -U livelink_user -d livelink_db

-- Check data consistency
SELECT 
    (SELECT COUNT(*) FROM transport_stops) as stops_count,
    (SELECT COUNT(*) FROM transport_lines) as lines_count,
    (SELECT COUNT(*) FROM scheduled_departures) as departures_count,
    (SELECT COUNT(*) FROM service_alerts) as alerts_count;
```

### Step 4: Integration Testing

```bash
# Test complete user flow
# 1. Register user with pincode 71634
# 2. Verify departures load for that pincode
# 3. Test search functionality
# 4. Check alerts are relevant to the area
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Docker Issues

```bash
# Problem: Docker containers won't start
# Solution: Check Docker daemon and port conflicts
docker system prune -a  # Clean up unused containers/images
sudo systemctl restart docker  # Restart Docker daemon (Linux)

# Problem: Port already in use
# Solution: Kill processes or change ports
lsof -i :8080  # Find process using port 8080
kill -9 <PID>  # Kill the process

# Problem: Out of disk space
docker system df  # Check Docker disk usage
docker system prune -a --volumes  # Clean up everything (CAREFUL!)
```

#### 2. Database Connection Issues

```bash
# Problem: Backend can't connect to database
# Check connection details in application.yml
# Verify PostgreSQL is running: docker-compose ps

# Problem: Database not initialized
# Re-run initialization scripts
docker exec -i $(docker-compose ps -q postgres) psql -U livelink_user -d livelink_db < database/init/01_schema.sql

# Problem: Permission denied
# Check PostgreSQL logs: docker-compose logs postgres
```

#### 3. Backend Issues

```bash
# Problem: Maven dependencies not downloading
# Solution: Clear Maven cache and retry
rm -rf ~/.m2/repository
mvn clean install

# Problem: Java version mismatch
# Solution: Verify Java version
java -version
# Update JAVA_HOME if necessary

# Problem: Spring Boot won't start
# Check application logs in IntelliJ console
# Verify application.yml configuration
```

#### 4. Frontend Issues

```bash
# Problem: npm install fails
# Solution: Clear npm cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Problem: API calls failing
# Check browser DevTools → Network tab
# Verify backend is running on port 8080
# Check CORS configuration in WebConfig.java

# Problem: Vite dev server issues
# Try different port: npm run dev -- --port 3001
# Clear Vite cache: rm -rf node_modules/.vite
```

#### 5. API Integration Issues

```bash
# Problem: CORS errors in browser
# Solution: Update WebConfig.java with correct origins
# Add your frontend URL to allowed origins

# Problem: API returns empty data
# Check database has sample data
# Verify API service URLs in src/services/api.ts
# Check network requests in browser DevTools
```

### Performance Optimization

```bash
# Optimize Docker performance
# 1. Increase Docker memory allocation (Docker Desktop → Settings → Resources)
# 2. Use Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Optimize database performance
# 1. Increase PostgreSQL shared_buffers
# 2. Add database indexes for frequently queried columns

# Optimize frontend performance
# 1. Use Vite's built-in optimization
# 2. Enable browser caching for static assets
```

### Development Workflow

```bash
# Recommended daily workflow:

# 1. Start infrastructure
docker-compose up -d postgres redis

# 2. Start backend in IntelliJ (with debugger)
# 3. Start frontend with hot reload
npm run dev

# 4. Make changes and test
# 5. Commit changes to Git
git add .
git commit -m "Feature: Add new functionality"
git push origin main

# 6. Stop services when done
docker-compose down
```

## Additional Resources

- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Database Schema**: `database/init/01_schema.sql`
- **Sample Data**: `database/init/02_dummy_data.sql`
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React/Vite Docs**: https://vitejs.dev/guide/
- **Docker Compose Docs**: https://docs.docker.com/compose/

## Support

For issues specific to this setup:
1. Check the console logs in browser DevTools
2. Check Docker container logs: `docker-compose logs [service-name]`
3. Check Spring Boot logs in IntelliJ console
4. Verify database connectivity and data integrity

This setup provides a complete development environment for the LiveLink Ludwigsburg public transport application with real-time data integration.