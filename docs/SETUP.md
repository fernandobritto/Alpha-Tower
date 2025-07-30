# Setup & Installation Guide

> **Complete setup instructions for Alpha Tower Sales System development and production environments**

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [File Upload Configuration](#file-upload-configuration)
- [Testing Setup](#testing-setup)
- [IDE Configuration](#ide-configuration)
- [Docker Setup](#docker-setup)
- [Deployment Options](#deployment-options)
- [Common Issues](#common-issues)
- [Performance Tuning](#performance-tuning)

## 📋 Prerequisites

### System Requirements

- **Operating System**: Linux, macOS, or Windows 10/11
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Disk Space**: At least 2GB free space
- **Network**: Internet connection for package downloads

### Required Software

#### Node.js & Package Manager
```bash
# Install Node.js (v16+ recommended)
# Via Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from official website
# https://nodejs.org/

# Install Yarn (recommended) or use npm
npm install -g yarn
```

#### PostgreSQL Database
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

#### Git Version Control
```bash
# Ubuntu/Debian
sudo apt install git

# macOS
# Included with Xcode Command Line Tools
xcode-select --install

# Windows
# Download from: https://git-scm.com/download/win
```

### Optional Tools

- **Database GUI**: pgAdmin, DBeaver, or TablePlus
- **API Testing**: Insomnia, Postman, or Thunder Client
- **Code Editor**: VS Code (recommended), WebStorm, or Vim

## 🚀 Development Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/fernandobritto/Alpha-Tower.git

# Navigate to project directory
cd Alpha-Tower

# Check Node.js version
node --version
# Should be v16+ (v18+ recommended)
```

### 2. Install Dependencies

```bash
# Install project dependencies
yarn install

# Or using npm
npm install

# Verify installation
yarn --version
```

### 3. Environment Configuration

Create environment files:

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

#### .env Configuration

```env
# Server Configuration
SERVER_PORT=8080
NODE_ENV=development

# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=alpha_tower

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=1d

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes

# Logging
LOG_LEVEL=debug
```

### 4. Database Setup

#### Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE alpha_tower;
CREATE USER alpha_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE alpha_tower TO alpha_user;

# Enable UUID extension
\c alpha_tower
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Exit PostgreSQL
\q
```

#### Create ormconfig.json

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "alpha_user",
  "password": "your_password",
  "database": "alpha_tower",
  "synchronize": false,
  "logging": ["error", "warn", "info"],
  "entities": ["src/modules/**/database/entities/*.ts"],
  "migrations": ["src/database/migrations/*.ts"],
  "cli": {
    "entitiesDir": "src/modules/**/database/entities",
    "migrationsDir": "src/database/migrations"
  }
}
```

#### Run Migrations

```bash
# Run database migrations
yarn database:run

# Verify migration status
yarn database migration:show

# Check database tables
psql -U alpha_user -d alpha_tower -c "\dt"
```

### 5. File Upload Setup

```bash
# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Set proper permissions (Linux/macOS)
chown -R $USER:$USER uploads/
```

### 6. Start Development Server

```bash
# Start development server with hot reload
yarn localhost

# Or using npm
npm run localhost

# Server should start on http://localhost:8080
```

### 7. Verify Installation

Test the API endpoints:

```bash
# Health check (if implemented)
curl http://localhost:8080/

# Test user creation
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🏭 Production Setup

### 1. Server Requirements

#### Minimum Specifications
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: Stable internet connection

#### Recommended Specifications
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Network**: High-speed connection
- **Load Balancer**: Nginx or HAProxy

### 2. Production Dependencies

```bash
# Install PM2 for process management
npm install -g pm2

# Install build tools
npm install -g typescript
```

### 3. Application Build

```bash
# Clone repository
git clone https://github.com/fernandobritto/Alpha-Tower.git
cd Alpha-Tower

# Install production dependencies
yarn install --production

# Build TypeScript to JavaScript
yarn build

# Verify build
ls -la build/
```

### 4. Production Environment

Create production environment file:

```env
# Production .env
NODE_ENV=production
SERVER_PORT=8080

# Database (use secure credentials)
DB_TYPE=postgres
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=alpha_user
DB_PASSWORD=secure_password
DB_DATABASE=alpha_tower

# JWT (use strong secret)
JWT_SECRET=your-production-jwt-secret-min-32-chars
JWT_EXPIRES_IN=1d

# Upload
UPLOAD_PATH=/var/www/alpha-tower/uploads
MAX_FILE_SIZE=10485760  # 10MB

# Logging
LOG_LEVEL=warn
```

### 5. Database Setup (Production)

```bash
# Connect to production database
psql -h your-db-host -U postgres

# Create production database
CREATE DATABASE alpha_tower;
CREATE USER alpha_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE alpha_tower TO alpha_user;

# Enable UUID extension
\c alpha_tower
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 6. Process Management

#### PM2 Configuration (ecosystem.config.js)

```javascript
module.exports = {
  apps: [{
    name: 'alpha-tower',
    script: 'build/shared/http/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

#### Start Production Server

```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
```

### 7. Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/alpha-tower
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /files/ {
        alias /var/www/alpha-tower/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/alpha-tower /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## ⚙️ Environment Configuration

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | development | No |
| `SERVER_PORT` | Server port | 8080 | No |
| `DB_TYPE` | Database type | postgres | Yes |
| `DB_HOST` | Database host | localhost | Yes |
| `DB_PORT` | Database port | 5432 | Yes |
| `DB_USERNAME` | Database username | - | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_DATABASE` | Database name | - | Yes |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration | 1d | No |
| `UPLOAD_PATH` | Upload directory | ./uploads | No |
| `MAX_FILE_SIZE` | Max upload size | 5242880 | No |
| `LOG_LEVEL` | Logging level | info | No |

### Multiple Environments

#### Development (.env.development)
```env
NODE_ENV=development
SERVER_PORT=8080
DB_DATABASE=alpha_tower_dev
JWT_SECRET=dev-secret-key
LOG_LEVEL=debug
```

#### Testing (.env.test)
```env
NODE_ENV=test
SERVER_PORT=8081
DB_DATABASE=alpha_tower_test
JWT_SECRET=test-secret-key
LOG_LEVEL=error
```

#### Production (.env.production)
```env
NODE_ENV=production
SERVER_PORT=8080
DB_DATABASE=alpha_tower
JWT_SECRET=secure-production-secret
LOG_LEVEL=warn
```

## 🗄️ Database Setup

### PostgreSQL Installation & Configuration

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

#### macOS
```bash
# Install via Homebrew
brew install postgresql

# Start service
brew services start postgresql

# Create user
createuser -s postgres
```

#### Docker Setup
```bash
# Run PostgreSQL in Docker
docker run --name alpha-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=alpha_tower \
  -p 5432:5432 \
  -d postgres:13

# Connect to container
docker exec -it alpha-postgres psql -U postgres -d alpha_tower
```

### Database Configuration

#### Create User & Database
```sql
-- Connect as postgres superuser
sudo -u postgres psql

-- Create database user
CREATE USER alpha_user WITH ENCRYPTED PASSWORD 'secure_password';

-- Create database
CREATE DATABASE alpha_tower OWNER alpha_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE alpha_tower TO alpha_user;

-- Connect to the database
\c alpha_tower

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO alpha_user;
```

#### Connection Testing
```bash
# Test connection
psql -h localhost -U alpha_user -d alpha_tower

# Test with connection string
psql "postgresql://alpha_user:secure_password@localhost:5432/alpha_tower"
```

### Migration Management

```bash
# Generate new migration
yarn database migration:generate -- --name AddIndexToUsers

# Create empty migration
yarn database migration:create -- --name AddNewTable

# Run migrations
yarn database:run

# Revert last migration
yarn database:revert

# Show migration status
yarn database migration:show

# Sync schema (development only)
yarn database:sync
```

## 📁 File Upload Configuration

### Directory Setup

```bash
# Create upload directories
mkdir -p uploads/{avatars,documents,temp}

# Set permissions (Linux/macOS)
chmod -R 755 uploads/
chown -R www-data:www-data uploads/  # For production with nginx
```

### Upload Configuration

```typescript
// src/config/upload.ts
import { resolve } from 'path'
import multer from 'multer'
import crypto from 'crypto'

const uploadFolder = resolve(__dirname, '..', '..', 'uploads')

export default {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex')
      const filename = `${fileHash}-${file.originalname}`
      callback(null, filename)
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ]
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
}
```

### File Serving

```typescript
// Static file serving
app.use('/files', express.static(uploadConfig.directory))

// With caching headers
app.use('/files', express.static(uploadConfig.directory, {
  maxAge: '1y',
  etag: true,
  lastModified: true
}))
```

## 🧪 Testing Setup

### Test Environment

```bash
# Install testing dependencies
yarn add -D jest @types/jest ts-jest supertest @types/supertest

# Create test database
psql -U postgres -c "CREATE DATABASE alpha_tower_test;"

# Set test environment
export NODE_ENV=test
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/database/migrations/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
}
```

### Test Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
  }
}
```

### Example Test

```typescript
// tests/users.test.ts
import request from 'supertest'
import { app } from '../src/shared/http/app'

describe('Users API', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe('test@example.com')
  })
})
```

## 💻 IDE Configuration

### VS Code Setup

#### Recommended Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### Settings Configuration

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.exclude": {
    "**/node_modules": true,
    "**/build": true,
    "**/.git": true
  }
}
```

#### Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/src/shared/http/server.ts",
      "outFiles": ["${workspaceFolder}/build/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register", "-r", "tsconfig-paths/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": false,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 🐳 Docker Setup

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN yarn build

# Production image
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S alpha -u 1001

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy built application
COPY --from=builder /app/build ./build

# Create uploads directory
RUN mkdir -p uploads && chown -R alpha:nodejs uploads

# Switch to non-root user
USER alpha

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build/shared/http/server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_USERNAME=alpha_user
      - DB_PASSWORD=secure_password
      - DB_DATABASE=alpha_tower
    depends_on:
      - postgres
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

  postgres:
    image: postgres:13-alpine
    environment:
      - POSTGRES_USER=alpha_user
      - POSTGRES_PASSWORD=secure_password
      - POSTGRES_DB=alpha_tower
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### Docker Commands

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Run migrations
docker-compose exec app yarn database:run

# Scale application
docker-compose up -d --scale app=3

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## 🚀 Deployment Options

### Manual Deployment

```bash
# 1. Prepare server
ssh user@your-server.com
sudo apt update && sudo apt upgrade -y

# 2. Clone and setup
git clone https://github.com/fernandobritto/Alpha-Tower.git
cd Alpha-Tower
yarn install --production

# 3. Configure environment
cp .env.example .env
nano .env

# 4. Setup database
sudo -u postgres createdb alpha_tower
yarn database:run

# 5. Build and start
yarn build
pm2 start ecosystem.config.js --env production
```

### CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'yarn'
    
    - name: Install dependencies
      run: yarn install --frozen-lockfile
    
    - name: Run tests
      run: yarn test
    
    - name: Build application
      run: yarn build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /var/www/alpha-tower
          git pull origin main
          yarn install --production
          yarn build
          pm2 reload ecosystem.config.js
```

### Heroku Deployment

```json
// package.json
{
  "scripts": {
    "start": "node build/shared/http/server.js",
    "build": "tsc",
    "heroku-postbuild": "yarn build"
  }
}
```

```
// Procfile
web: yarn start
```

```bash
# Deploy to Heroku
heroku create alpha-tower-app
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production
git push heroku main
```

## ❗ Common Issues

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check if port is open
netstat -an | grep 5432

# Test connection
psql -h localhost -U alpha_user -d alpha_tower

# Common fixes
sudo systemctl restart postgresql
sudo ufw allow 5432
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>

# Or use different port
export SERVER_PORT=8081
```

### Permission Errors

```bash
# Fix uploads directory permissions
sudo chown -R $USER:$USER uploads/
chmod -R 755 uploads/

# Fix node_modules permissions
rm -rf node_modules
yarn install
```

### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Monitor memory usage
node --max-old-space-size=4096 build/shared/http/server.js
```

## 🔧 Performance Tuning

### Node.js Optimization

```javascript
// Production optimizations
process.env.NODE_ENV = 'production'
app.set('trust proxy', 1)

// Connection pooling
{
  "pool": {
    "max": 20,
    "min": 5,
    "acquire": 30000,
    "idle": 10000
  }
}
```

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_name ON products(name);

-- Analyze tables
ANALYZE users;
ANALYZE products;
```

### Caching

```typescript
// Redis caching (optional)
import redis from 'redis'
const client = redis.createClient()

// Cache middleware
const cache = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl
    const cached = await client.get(key)
    
    if (cached) {
      return res.json(JSON.parse(cached))
    }
    
    res.sendResponse = res.json
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body))
      res.sendResponse(body)
    }
    
    next()
  }
}
```

---

This setup guide provides comprehensive instructions for getting Alpha Tower Sales System running in both development and production environments. For troubleshooting specific issues, refer to the [Troubleshooting Guide](TROUBLESHOOTING.md).
