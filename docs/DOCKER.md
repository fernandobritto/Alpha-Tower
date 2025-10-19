# Docker Setup Guide for Alpha Tower

This guide provides comprehensive instructions for running Alpha Tower using Docker and Docker Compose.

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Git

## 🚀 Quick Start

### Development Environment

1. **Clone and setup**:

```bash
git clone https://github.com/fernandobritto/Alpha-Tower.git
cd Alpha-Tower
```

2. **Configure environment**:

```bash
cp .env.docker .env
# Edit .env with your preferred settings
```

3. **Start development environment**:

```bash
# Using the management script (recommended)
./scripts/docker.sh dev:up

# Or using docker-compose directly
docker-compose up --build
```

4. **Run database migrations**:

```bash
./scripts/docker.sh db:migrate
# Or
docker-compose exec api yarn database:run
```

### Production Environment

1. **Start production environment**:

```bash
./scripts/docker.sh prod:up
# Or
docker-compose --profile production up --build -d
```

## 🏗 Architecture

The Docker setup includes:

- **PostgreSQL 15**: Main database with UUID extension
- **Redis 7**: Caching and session storage
- **Alpha Tower API**: Node.js/TypeScript application
- **Nginx**: Reverse proxy and static file serving (production only)

## 📂 Directory Structure

```
Alpha-Tower/
├── docker/
│   ├── nginx/
│   │   └── nginx.conf          # Nginx configuration
│   └── postgres/
│       └── init/
│           └── 01-init.sh      # PostgreSQL initialization
├── scripts/
│   └── docker.sh               # Docker management script
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Docker Compose configuration
├── .dockerignore              # Docker build exclusions
└── .env.docker                # Environment template
```

## 🔧 Configuration

### Environment Variables

The following environment variables can be configured in `.env`:

#### Application

- `APP_NAME`: Application name (default: alpha-tower)
- `APP_ENV`: Application environment (development/production)
- `APP_SECRET`: Application secret key
- `SERVER_PORT`: Server port (default: 3333)

#### Database

- `DB_HML_HOST`: Database host (default: postgres)
- `DB_HML_PORT`: Database port (default: 5432)
- `DB_HML_DATABASE`: Database name (default: alpha_tower)
- `DB_HML_USERNAME`: Database username (default: alpha_user)
- `DB_HML_PASSWORD`: Database password

#### Redis

- `REDIS_HOST`: Redis host (default: redis)
- `REDIS_PORT`: Redis port (default: 6379)
- `REDIS_PASS`: Redis password

#### Authentication

- `TOKEN_SECRET`: JWT secret key
- `TOKEN_EXPIRATION`: JWT expiration time (default: 1d)

### Volumes

- `postgres_data`: PostgreSQL data persistence
- `redis_data`: Redis data persistence
- `uploads_data`: File uploads storage
- `logs_data`: Application logs

## 🛠 Management Scripts

The `scripts/docker.sh` provides convenient commands:

### Development

```bash
./scripts/docker.sh dev:up        # Start development environment
./scripts/docker.sh dev:down      # Stop development environment
./scripts/docker.sh dev:restart   # Restart development environment
```

### Production

```bash
./scripts/docker.sh prod:up       # Start production environment
./scripts/docker.sh prod:down     # Stop production environment
```

### Database

```bash
./scripts/docker.sh db:migrate    # Run migrations
./scripts/docker.sh db:backup     # Create backup
./scripts/docker.sh db:restore    # Restore from backup
```

### Utilities

```bash
./scripts/docker.sh logs [service]    # View logs
./scripts/docker.sh shell [service]   # Open shell
./scripts/docker.sh cleanup           # Clean Docker resources
```

## 🔍 Health Checks

All services include health checks:

- **PostgreSQL**: `pg_isready` command
- **Redis**: Redis ping command
- **API**: HTTP health endpoint
- **Nginx**: Basic connectivity check

## 📊 Monitoring

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f postgres
```

### Service Status

```bash
# Check service status
docker-compose ps

# Check health status
docker-compose ps --filter "health=healthy"
```

## 🔒 Security Considerations

1. **Change default passwords** in production
2. **Use strong JWT secrets**
3. **Enable SSL/TLS** for production
4. **Limit exposed ports**
5. **Regular security updates**

## 🚀 Production Deployment

### With Nginx Reverse Proxy

```bash
# Start full production stack
docker-compose --profile production up -d

# Check status
docker-compose --profile production ps
```

### SSL/TLS Setup

1. Place SSL certificates in `docker/ssl/`
2. Update nginx configuration
3. Restart nginx service

## 🧪 Testing

### Running Tests in Container

```bash
# Run tests
docker-compose exec api yarn test

# Run with coverage
docker-compose exec api yarn test:coverage
```

## 📝 Common Commands

### Database Operations

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U alpha_user -d alpha_tower

# View database tables
docker-compose exec postgres psql -U alpha_user -d alpha_tower -c "\dt"

# Reset database
docker-compose down -v
docker-compose up -d postgres
./scripts/docker.sh db:migrate
```

### Application Operations

```bash
# Rebuild application
docker-compose build api

# View application logs
docker-compose logs -f api

# Access application shell
docker-compose exec api sh
```

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in `.env` file
2. **Permission errors**: Check file ownership and permissions
3. **Database connection**: Ensure PostgreSQL is healthy
4. **Out of memory**: Increase Docker memory limits

### Debug Mode

```bash
# Run with debug output
docker-compose up --build

# Check service health
docker-compose exec api curl http://localhost:3333/health
```

## 📈 Performance Tuning

### PostgreSQL

- Adjust `shared_buffers` and `work_mem`
- Enable query logging for optimization
- Regular VACUUM and ANALYZE

### Redis

- Configure appropriate memory limits
- Enable persistence if needed
- Monitor memory usage

### Application

- Use production builds
- Enable gzip compression
- Implement caching strategies

## 🔄 Updates and Maintenance

### Updating Services

```bash
# Pull latest images
docker-compose pull

# Rebuild with latest code
docker-compose build --no-cache

# Restart services
docker-compose restart
```

### Backup Strategy

```bash
# Automated backups
0 2 * * * /path/to/Alpha-Tower/scripts/docker.sh db:backup
```

This Docker setup provides a robust, scalable, and maintainable deployment solution for the Alpha Tower API.
