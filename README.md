# Alpha Tower Sales System 🏆

> **A robust RESTful API built with Node.js and TypeScript for managing sales proposals, products, and client relationships**

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FF6600?style=for-the-badge&logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

Alpha Tower Sales System is a comprehensive API solution designed to streamline sales operations through efficient management of products and user accounts. Built with modern technologies and following clean architecture principles, it provides a scalable foundation for sales-oriented applications.

### Key Capabilities

- **User Management**: Complete CRUD operations with authentication and authorization
- **Product Catalog**: Comprehensive product management with inventory tracking
- **Authentication**: JWT-based security with token management
- **File Upload**: Avatar and file management with AWS S3 integration ready
- **Data Validation**: Robust input validation using Joi/Celebrate
- **Database Management**: TypeORM with PostgreSQL and migration support

## ✨ Features

### 🔐 Authentication & Authorization
- JWT token-based authentication
- Secure password hashing with bcryptjs
- Protected routes with middleware authentication
- User session management

### 👥 User Management
- User registration and profile management
- Avatar upload and management
- User authentication and authorization
- Complete CRUD operations

### 📦 Product Management
- Product catalog with full CRUD operations
- Inventory tracking with quantity management
- Product categorization and description
- Price management with decimal precision

### 🛡️ Security & Validation
- Input validation with Celebrate/Joi
- CORS support for cross-origin requests
- Error handling with custom AppError class
- SQL injection protection through TypeORM

### 📁 File Management
- File upload with Multer
- Avatar management system
- Static file serving
- AWS SDK integration ready

## 🛠 Technology Stack

### Core Technologies
- **[Node.js](https://nodejs.org/)** - JavaScript runtime environment
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript superset
- **[Express.js](https://expressjs.com/)** - Web application framework
- **[TypeORM](https://typeorm.io/)** - Object-Relational Mapping library
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database system

### Key Dependencies
- **Authentication**: JWT, bcryptjs
- **Validation**: Celebrate, Joi
- **File Upload**: Multer, AWS SDK
- **Development**: ts-node-dev, ESLint, Prettier
- **Testing**: Jest, Supertest

## 🏗 Architecture

The application follows a **modular architecture** with clear separation of concerns:

```
├── src/
│   ├── modules/           # Business logic modules
│   │   ├── users/         # User management
│   │   └── products/      # Product management
│   ├── shared/            # Shared utilities and infrastructure
│   │   ├── http/          # Express server configuration
│   │   ├── middlewares/   # Custom middleware
│   │   └── errors/        # Error handling
│   ├── config/            # Application configuration
│   ├── database/          # Database setup and migrations
│   └── routes/            # Route definitions
```

### Design Patterns
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **Dependency Injection**: Loose coupling between components
- **Error Handling**: Centralized error management

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (v12.0 or higher)
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/fernandobritto/Alpha-Tower.git
cd Alpha-Tower
```

### 2. Install Dependencies

```bash
# Using yarn (recommended)
yarn install

# Or using npm
npm install
```

### 3. Database Setup

Create a PostgreSQL database for the application:

```sql
CREATE DATABASE alpha_tower;
```

### 4. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
SERVER_PORT=8080

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=alpha_tower

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Upload Configuration
UPLOAD_PATH=./uploads
```

### 5. Run Database Migrations

```bash
# Run all pending migrations
yarn database:run

# Or using npm
npm run database:run
```

### 6. Start the Application

```bash
# Development mode with hot reload
yarn localhost

# Or using npm
npm run localhost
```

The server will start on `http://localhost:8080` 🚀

## ⚙️ Configuration

### Database Configuration

The application uses TypeORM for database management. Create an `ormconfig.json` file:

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "your_username",
  "password": "your_password",
  "database": "alpha_tower",
  "entities": ["src/modules/**/database/entities/*.ts"],
  "migrations": ["src/database/migrations/*.ts"],
  "cli": {
    "migrationsDir": "src/database/migrations"
  }
}
```

### Upload Configuration

Configure file upload settings in `src/config/upload.ts`:

```typescript
export default {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('hex')
      const filename = `${fileHash}-${file.originalname}`
      callback(null, filename)
    },
  }),
}
```

## 📖 Usage

### Starting the Server

```bash
# Development mode
yarn localhost

# Production mode
yarn start
```

### Database Operations

```bash
# Run migrations
yarn database:run

# Revert last migration
yarn database:revert

# Sync database schema
yarn database:sync
```

### Code Quality

```bash
# Run linting
yarn lint

# Fix linting issues
yarn lint-fix

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage
```

## 📚 API Documentation

The API provides the following endpoints:

### Authentication
- `POST /sessions` - User login and token generation

### Users
- `GET /users` - List all users (authenticated)
- `GET /users/:id` - Get user by ID (authenticated)
- `POST /users` - Create new user
- `PUT /users/:id` - Update user (authenticated)
- `DELETE /users/:id` - Delete user (authenticated)
- `PATCH /users/avatar` - Upload user avatar (authenticated)

### Products
- `GET /products` - List all products (authenticated)
- `GET /products/:id` - Get product by ID (authenticated)
- `POST /products` - Create new product (authenticated)
- `PUT /products/:id` - Update product (authenticated)
- `DELETE /products/:id` - Delete product (authenticated)

For detailed API documentation, see [docs/API.md](docs/API.md).

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  avatar VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description VARCHAR,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

For complete database documentation, see [docs/DATABASE.md](docs/DATABASE.md).

## 🧪 Testing

The project is configured with Jest for testing:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:silent

# Generate coverage report
yarn test:coverage
```

## 📁 Project Structure

```
Alpha-Tower/
├── src/
│   ├── @types/                 # Type definitions
│   ├── config/                 # Configuration files
│   │   ├── auth.ts            # JWT configuration
│   │   └── upload.ts          # File upload configuration
│   ├── database/              # Database setup
│   │   ├── index.ts          # Database connection
│   │   └── migrations/       # Database migrations
│   ├── modules/               # Business modules
│   │   ├── products/         # Product management
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── database/     # Entities and repositories
│   │   │   ├── routes/       # Route definitions
│   │   │   └── services/     # Business logic
│   │   └── users/            # User management
│   │       ├── controllers/  # Request handlers
│   │       ├── database/     # Entities and repositories
│   │       ├── routes/       # Route definitions
│   │       └── services/     # Business logic
│   ├── routes/                # Main route configuration
│   └── shared/                # Shared utilities
│       ├── errors/           # Error handling
│       ├── http/             # Server configuration
│       └── middlewares/      # Custom middleware
├── docs/                      # Documentation
├── resource/                  # Static resources
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── jest.config.js            # Testing configuration
└── README.md                 # Project documentation
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Run linting before committing

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Fernando Britto**
- LinkedIn: [Fernando Britto](https://br.linkedin.com/in/fernando-britto)
- GitHub: [@fernandobritto](https://github.com/fernandobritto)

## 🙏 Acknowledgments

- Node.js community for excellent tooling
- TypeORM team for the robust ORM solution
- Express.js for the minimal and flexible framework
- All contributors who help improve this project

---

⭐ **If you found this project helpful, please give it a star!** ⭐
