# Troubleshooting Guide

> **Common issues, solutions, and debugging techniques for Alpha Tower Sales System**

## 📋 Table of Contents

- [Getting Help](#getting-help)
- [Common Issues](#common-issues)
  - [Installation Problems](#installation-problems)
  - [Database Issues](#database-issues)
  - [Authentication Errors](#authentication-errors)
  - [File Upload Problems](#file-upload-problems)
  - [Server Issues](#server-issues)
- [Error Messages](#error-messages)
- [Debugging Techniques](#debugging-techniques)
- [Performance Issues](#performance-issues)
- [Environment-Specific Problems](#environment-specific-problems)
- [Logging and Monitoring](#logging-and-monitoring)
- [FAQ](#faq)

## 🆘 Getting Help

### Before You Start

1. **Check the logs** - Most issues can be diagnosed from log output
2. **Verify your environment** - Ensure all prerequisites are met
3. **Test in isolation** - Try to reproduce the issue with minimal setup
4. **Check recent changes** - Review what was changed before the issue appeared

### Resources

- **Documentation**: [Setup Guide](SETUP.md), [API Docs](API.md), [Architecture](ARCHITECTURE.md)
- **Issue Tracker**: [GitHub Issues](https://github.com/fernandobritto/Alpha-Tower/issues)
- **Community**: Stack Overflow with tag `alpha-tower`

## 🔧 Common Issues

### Installation Problems

#### Node.js Version Issues

**Problem**: Application fails to start with Node.js version errors

```bash
Error: The engine "node" is incompatible with this module.
```

**Solution**:
```bash
# Check current Node.js version
node --version

# Install correct version (18+ recommended)
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

#### Dependency Installation Fails

**Problem**: `yarn install` or `npm install` fails

```bash
error An unexpected error occurred: "EACCES: permission denied"
```

**Solutions**:
```bash
# Fix npm permissions (Unix/Linux)
sudo chown -R $(whoami) ~/.npm

# Clear cache
yarn cache clean
# or
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
yarn install

# Use specific registry if network issues
yarn install --registry https://registry.npmjs.org/
```

#### TypeScript Compilation Errors

**Problem**: Build fails with TypeScript errors

```bash
error TS2307: Cannot find module '@config/auth'
```

**Solutions**:
```bash
# Verify tsconfig.json paths are correct
# Ensure all dependencies are installed
yarn install

# Clear TypeScript cache
rm -rf build/
yarn tsc --build --clean

# Rebuild
yarn build
```

### Database Issues

#### Connection Refused

**Problem**: Cannot connect to PostgreSQL database

```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql
# Start if not running
sudo systemctl start postgresql

# Verify port is open
netstat -an | grep 5432

# Check PostgreSQL configuration
sudo nano /etc/postgresql/13/main/postgresql.conf
# Ensure: listen_addresses = 'localhost'

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Authentication Failed

**Problem**: Database authentication fails

```bash
Error: password authentication failed for user "alpha_user"
```

**Solutions**:
```bash
# Reset user password
sudo -u postgres psql
ALTER USER alpha_user WITH PASSWORD 'new_password';

# Check pg_hba.conf authentication method
sudo nano /etc/postgresql/13/main/pg_hba.conf
# Change 'peer' to 'md5' for local connections

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Migration Failures

**Problem**: Database migrations fail to run

```bash
Error: relation "users" already exists
```

**Solutions**:
```bash
# Check migration status
yarn database migration:show

# Revert problematic migration
yarn database:revert

# Drop database and recreate (development only)
sudo -u postgres psql
DROP DATABASE alpha_tower;
CREATE DATABASE alpha_tower;

# Run migrations again
yarn database:run
```

#### UUID Extension Missing

**Problem**: UUID generation fails

```bash
Error: function uuid_generate_v4() does not exist
```

**Solution**:
```sql
-- Connect to database
psql -U alpha_user -d alpha_tower

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify installation
SELECT uuid_generate_v4();
```

### Authentication Errors

#### JWT Token Invalid

**Problem**: Authentication fails with invalid token

```bash
Error: Invalid JWT Token
```

**Solutions**:
```bash
# Check JWT secret in environment
echo $JWT_SECRET

# Verify token format in request
# Should be: Authorization: Bearer <token>

# Generate new token by logging in again
curl -X POST http://localhost:8080/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

#### Password Hashing Issues

**Problem**: User creation fails with password errors

```bash
Error: data and salt arguments required
```

**Solutions**:
```bash
# Verify bcryptjs is installed
yarn list bcryptjs

# Check password hashing in service
# Ensure password is not empty before hashing
if (!password) {
  throw new AppError('Password is required')
}
```

#### Session Expiration

**Problem**: Tokens expire too quickly or don't expire

**Solutions**:
```env
# Adjust token expiration in .env
JWT_EXPIRES_IN=24h  # 24 hours
JWT_EXPIRES_IN=7d   # 7 days
JWT_EXPIRES_IN=30m  # 30 minutes
```

### File Upload Problems

#### Upload Directory Missing

**Problem**: File uploads fail with directory errors

```bash
Error: ENOENT: no such file or directory, open './uploads/filename.jpg'
```

**Solutions**:
```bash
# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Set proper ownership (Linux)
chown -R $USER:$USER uploads/

# For production with web server
chown -R www-data:www-data uploads/
```

#### File Size Limits

**Problem**: Large file uploads fail

```bash
Error: File too large
```

**Solutions**:
```typescript
// Increase file size limit in upload config
export default {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}
```

```nginx
# Increase nginx client_max_body_size
client_max_body_size 10M;
```

#### File Type Restrictions

**Problem**: Certain file types rejected

```bash
Error: Invalid file type
```

**Solutions**:
```typescript
// Update allowed file types
fileFilter: (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp', // Add new types
    'application/pdf'
  ]
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`))
  }
}
```

### Server Issues

#### Port Already in Use

**Problem**: Server fails to start due to port conflict

```bash
Error: listen EADDRINUSE: address already in use :::8080
```

**Solutions**:
```bash
# Find process using the port
lsof -i :8080
# or
netstat -tulpn | grep 8080

# Kill the process
kill -9 <PID>

# Use different port
export SERVER_PORT=8081
yarn localhost
```

#### Memory Issues

**Problem**: Server crashes with out of memory errors

```bash
Error: JavaScript heap out of memory
```

**Solutions**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# For production with PM2
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'alpha-tower',
    script: 'build/shared/http/server.js',
    node_args: '--max-old-space-size=4096'
  }]
}
```

#### CORS Issues

**Problem**: Frontend cannot access API due to CORS

```bash
Access to fetch at 'http://localhost:8080/users' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions**:
```typescript
// Configure CORS properly
import cors from 'cors'

app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend.com'],
  credentials: true
}))
```

## 📜 Error Messages

### Common Error Codes and Solutions

#### `ECONNREFUSED`
- **Cause**: Service is not running or unreachable
- **Solution**: Start the service or check network connectivity

#### `EADDRINUSE`
- **Cause**: Port is already in use
- **Solution**: Kill the process or use a different port

#### `EACCES`
- **Cause**: Permission denied
- **Solution**: Fix file/directory permissions or run with proper privileges

#### `ENOENT`
- **Cause**: File or directory not found
- **Solution**: Create the missing file/directory or check path

### Application-Specific Errors

#### `Email address already used`
- **Cause**: Attempting to create user with existing email
- **Solution**: Use different email or update existing user

#### `JWT Token is missing`
- **Cause**: No authorization header in request
- **Solution**: Include `Authorization: Bearer <token>` header

#### `Incorrect email/password combination`
- **Cause**: Invalid login credentials
- **Solution**: Verify credentials or reset password

## 🐛 Debugging Techniques

### Enable Debug Logging

```env
# Set debug level logging
LOG_LEVEL=debug
NODE_ENV=development
```

```typescript
// Add debug statements
console.log('Debug: User data:', user)
console.log('Debug: Database query:', query)

// Use proper logging library
import winston from 'winston'

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'debug.log' })
  ]
})

logger.debug('Debug message', { data: someObject })
```

### Database Query Debugging

```typescript
// Enable TypeORM logging
// ormconfig.json
{
  "logging": ["query", "error", "schema", "warn", "info", "log"]
}

// Log specific queries
const users = await usersRepository
  .createQueryBuilder('user')
  .where('user.email = :email', { email })
  .printSql() // This will log the SQL
  .getOne()
```

### API Request Debugging

```bash
# Use curl with verbose output
curl -v -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass"}'

# Test with different HTTP clients
# Postman, Insomnia, HTTPie
http POST localhost:8080/users name="Test" email="test@example.com" password="pass"
```

### Performance Debugging

```typescript
// Add timing to operations
const start = Date.now()
const result = await someOperation()
console.log(`Operation took ${Date.now() - start}ms`)

// Profile memory usage
console.log('Memory usage:', process.memoryUsage())

// Monitor event loop lag
const { monitorEventLoopDelay } = require('perf_hooks')
const h = monitorEventLoopDelay({ resolution: 20 })
h.enable()
// Later...
console.log('Event loop delay:', h.mean / 1000000, 'ms')
```

## 🚀 Performance Issues

### Slow Database Queries

**Problem**: API responses are slow

**Solutions**:
```sql
-- Add missing indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_name ON products(name);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Update table statistics
ANALYZE users;
ANALYZE products;
```

### Memory Leaks

**Problem**: Memory usage increases over time

**Solutions**:
```typescript
// Avoid creating unnecessary closures
// Bad
setInterval(() => {
  const data = heavyOperation()
  // data is captured in closure
}, 1000)

// Good
const processData = () => {
  const data = heavyOperation()
  // data will be garbage collected
}
setInterval(processData, 1000)

// Use weak references for caches
const cache = new WeakMap()
```

### High CPU Usage

**Problem**: Server consumes too much CPU

**Solutions**:
```bash
# Monitor CPU usage
top -p $(pgrep node)

# Profile the application
node --prof build/shared/http/server.js
# Process the profile
node --prof-process isolate-*.log > processed.txt
```

## 🌍 Environment-Specific Problems

### Development Environment

**Issue**: Hot reload not working
```bash
# Check ts-node-dev is installed
yarn list ts-node-dev

# Restart with verbose output
yarn localhost --verbose
```

**Issue**: Environment variables not loading
```bash
# Verify .env file exists and is readable
ls -la .env
cat .env

# Check for syntax errors in .env
# No spaces around = sign
# Use quotes for values with spaces
SECRET_KEY="my secret key"
```

### Production Environment

**Issue**: Application crashes after deployment
```bash
# Check PM2 logs
pm2 logs alpha-tower

# Monitor PM2 processes
pm2 monit

# Restart application
pm2 restart alpha-tower
```

**Issue**: Static files not served
```nginx
# Check nginx configuration
sudo nginx -t

# Verify file permissions
ls -la /var/www/alpha-tower/uploads/

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Docker Environment

**Issue**: Container won't start
```bash
# Check container logs
docker logs <container-id>

# Inspect container
docker inspect <container-id>

# Run container interactively
docker run -it <image> /bin/sh
```

**Issue**: Database connection in Docker
```yaml
# Use service name as hostname
environment:
  - DB_HOST=postgres  # Not localhost
  - DB_PORT=5432
```

## 📊 Logging and Monitoring

### Application Logging

```typescript
// Configure Winston logger
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

// Use in application
logger.info('Server started', { port: SERVER_PORT })
logger.error('Database connection failed', { error: error.message })
```

### Database Monitoring

```sql
-- Monitor active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Monitor database size
SELECT pg_size_pretty(pg_database_size('alpha_tower'));
```

### System Monitoring

```bash
# Monitor system resources
htop

# Check disk usage
df -h

# Monitor network connections
netstat -tulpn

# Check system logs
journalctl -u postgresql
journalctl -u nginx
```

## ❓ FAQ

### General Questions

**Q: How do I reset my database?**
A: For development:
```bash
sudo -u postgres psql
DROP DATABASE alpha_tower;
CREATE DATABASE alpha_tower;
\q
yarn database:run
```

**Q: How do I change the server port?**
A: Set the `SERVER_PORT` environment variable:
```bash
export SERVER_PORT=3000
# or in .env file
SERVER_PORT=3000
```

**Q: How do I update dependencies?**
A:
```bash
# Check outdated packages
yarn outdated

# Update all dependencies
yarn upgrade

# Update specific package
yarn upgrade package-name@latest
```

### Security Questions

**Q: How do I change the JWT secret?**
A: Update the `JWT_SECRET` in your environment file and restart the server. Note that existing tokens will become invalid.

**Q: How do I enable HTTPS?**
A: Configure SSL/TLS in your reverse proxy (nginx) or use a service like Let's Encrypt:
```bash
sudo certbot --nginx -d your-domain.com
```

### Deployment Questions

**Q: How do I deploy to production?**
A: Follow the [Production Setup](SETUP.md#production-setup) guide or use Docker deployment.

**Q: How do I backup my database?**
A:
```bash
pg_dump -U alpha_user -h localhost alpha_tower > backup.sql
```

**Q: How do I scale the application?**
A: Use PM2 cluster mode or Docker Swarm:
```bash
pm2 start ecosystem.config.js -i max
```

### Development Questions

**Q: How do I add a new endpoint?**
A: Follow the modular structure:
1. Add route in `routes/`
2. Create controller method
3. Implement service logic
4. Add validation schema

**Q: How do I run tests?**
A:
```bash
yarn test
yarn test:coverage
yarn test:watch
```

**Q: How do I generate new migrations?**
A:
```bash
yarn database migration:generate -- --name YourMigrationName
```

---

## 🔍 Still Need Help?

If your issue isn't covered here:

1. **Check the logs** - Enable debug logging and examine output
2. **Search existing issues** - Check GitHub issues for similar problems
3. **Create a minimal reproduction** - Isolate the problem
4. **Ask for help** - Create a GitHub issue with:
   - Node.js and npm/yarn versions
   - Operating system
   - Complete error messages
   - Steps to reproduce
   - Expected vs actual behavior

For urgent production issues, consider:
- Rolling back to the last working version
- Checking monitoring dashboards
- Reviewing recent deployments or changes

Remember: Most issues are configuration-related and can be resolved by carefully reviewing the setup steps and error messages.
