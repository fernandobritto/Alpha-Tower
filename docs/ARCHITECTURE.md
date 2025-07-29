# Architecture Documentation

> **Technical architecture and design decisions for Alpha Tower Sales System**

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Design Patterns](#design-patterns)
- [Modular Structure](#modular-structure)
- [Data Flow](#data-flow)
- [Authentication & Authorization](#authentication--authorization)
- [Database Design](#database-design)
- [File Management](#file-management)
- [Error Handling](#error-handling)
- [Middleware Architecture](#middleware-architecture)
- [Configuration Management](#configuration-management)
- [Performance Considerations](#performance-considerations)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)

## 🔍 Overview

Alpha Tower Sales System follows a **layered architecture** with clear separation of concerns, implementing modern Node.js best practices and TypeScript for type safety. The system is designed to be maintainable, scalable, and testable.

### Architectural Principles

- **Single Responsibility**: Each component has a single, well-defined purpose
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Open/Closed**: Open for extension, closed for modification
- **Interface Segregation**: Small, focused interfaces
- **DRY (Don't Repeat Yourself)**: Code reusability and maintainability

## 🏗 System Architecture

### Overall Architecture Diagram

```
┌─────────────────────────────────────────┐
│                Frontend                 │
│            (Any Client)                 │
└─────────────┬───────────────────────────┘
              │ HTTP/HTTPS
              │
┌─────────────▼───────────────────────────┐
│           Express Server                │
│         (src/shared/http/)              │
├─────────────────────────────────────────┤
│            Middlewares                  │
│  ┌─────────────────────────────────┐    │
│  │ • CORS                          │    │
│  │ • Authentication (JWT)          │    │
│  │ • Validation (Celebrate/Joi)    │    │
│  │ • Error Handler                 │    │
│  │ • File Upload (Multer)          │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│              Routes                     │
│  ┌─────────────────────────────────┐    │
│  │ • /sessions   (Auth)            │    │
│  │ • /users      (User Management) │    │
│  │ • /products   (Product Mgmt)    │    │
│  │ • /files      (Static Files)    │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│             Controllers                 │
│  ┌─────────────────────────────────┐    │
│  │ • Handle HTTP requests          │    │
│  │ • Input validation              │    │
│  │ • Response formatting           │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│              Services                   │
│  ┌─────────────────────────────────┐    │
│  │ • Business logic                │    │
│  │ • Data transformation           │    │
│  │ • External integrations         │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│            Repositories                 │
│  ┌─────────────────────────────────┐    │
│  │ • Data access abstraction       │    │
│  │ • Query optimization            │    │
│  │ • Database operations           │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│             TypeORM                     │
│  ┌─────────────────────────────────┐    │
│  │ • Entity mapping                │    │
│  │ • Migration management          │    │
│  │ • Connection pooling            │    │
│  └─────────────────────────────────┘    │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│           PostgreSQL                    │
│        Database Server                  │
└─────────────────────────────────────────┘
```

### Technology Stack Layers

#### 1. Presentation Layer
- **Express.js**: Web framework for handling HTTP requests
- **Middleware**: Request/response processing
- **Routes**: Endpoint definition and routing

#### 2. Business Logic Layer
- **Controllers**: Request handling and response formatting
- **Services**: Core business logic implementation
- **Validation**: Input validation using Joi/Celebrate

#### 3. Data Access Layer
- **Repositories**: Data access abstraction
- **Entities**: Domain models using TypeORM decorators
- **TypeORM**: Object-Relational Mapping

#### 4. Persistence Layer
- **PostgreSQL**: Relational database
- **Migrations**: Database schema versioning

## 🎨 Design Patterns

### 1. Repository Pattern

Provides an abstraction layer over data access:

```typescript
// Repository Interface
@EntityRepository(User)
class UsersRepository extends Repository<User> {
  public async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } })
  }
}

// Usage in Service
class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findByEmail(email)
    // Business logic...
  }
}
```

### 2. Service Layer Pattern

Encapsulates business logic:

```typescript
interface IRequest {
  name: string
  email: string
  password: string
}

class CreateUserService {
  public async execute(data: IRequest): Promise<User> {
    // Validation
    // Business rules
    // Data persistence
  }
}
```

### 3. Dependency Injection

Achieved through TypeORM's `getCustomRepository`:

```typescript
// Service uses repository through DI
const usersRepository = getCustomRepository(UsersRepository)
const productsRepository = getCustomRepository(ProductsRepository)
```

### 4. Middleware Pattern

Cross-cutting concerns handled via middleware:

```typescript
// Authentication middleware
export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // JWT verification logic
  next()
}
```

### 5. Error Handling Pattern

Centralized error management:

```typescript
class AppError {
  public readonly message: string
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}

// Global error handler
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }
})
```

## 📦 Modular Structure

### Module Organization

Each business domain is organized into a self-contained module:

```
src/modules/
├── users/
│   ├── controllers/
│   │   ├── UsersController.ts
│   │   ├── UserAvatarController.ts
│   │   └── SessionsController.ts
│   ├── services/
│   │   ├── CreateUserService.ts
│   │   ├── UpdateUserService.ts
│   │   ├── DeleteUserService.ts
│   │   ├── ListUserService.ts
│   │   ├── ShowUserService.ts
│   │   ├── UpdateUserAvatarService.ts
│   │   └── CreateSessionsService.ts
│   ├── database/
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   │   └── UserToken.ts
│   │   └── repositories/
│   │       ├── UsersRepository.ts
│   │       └── UserTokensRepository.ts
│   └── routes/
│       ├── users.routes.ts
│       └── sessions.routes.ts
└── products/
    ├── controllers/
    │   └── ProductsController.ts
    ├── services/
    │   ├── CreateProductService.ts
    │   ├── UpdateProductService.ts
    │   ├── DeleteProductService.ts
    │   ├── ListProductService.ts
    │   └── ShowProductService.ts
    ├── database/
    │   ├── entities/
    │   │   └── Product.ts
    │   └── repositories/
    │       └── ProductsRepository.ts
    └── routes/
        └── products.routes.ts
```

### Shared Components

Common functionality is centralized in the shared module:

```
src/shared/
├── http/
│   ├── app.ts           # Express application setup
│   └── server.ts        # Server initialization
├── middlewares/
│   └── isAuthenticated.ts
├── errors/
│   └── AppError.ts
```

## 🔄 Data Flow

### Request Processing Flow

1. **HTTP Request** → Express Router
2. **Route Handler** → Controller method
3. **Controller** → Service class
4. **Service** → Repository/Database
5. **Database** → Service → Controller
6. **Controller** → HTTP Response

### Example Flow: User Creation

```typescript
// 1. Route Definition
router.post('/', celebrate(validation), usersController.create)

// 2. Controller
class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body
    
    // 3. Service Call
    const createUser = new CreateUserService()
    const user = await createUser.execute({ name, email, password })
    
    return response.json(user)
  }
}

// 4. Service Logic
class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    // 5. Repository Access
    const usersRepository = getCustomRepository(UsersRepository)
    
    // Business logic
    const emailExists = await usersRepository.findByEmail(email)
    if (emailExists) {
      throw new AppError('Email address already used.')
    }
    
    // Password hashing
    const hashedPassword = await hash(password, 8)
    
    // 6. Database Operation
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })
    
    await usersRepository.save(user)
    return user
  }
}
```

## 🔐 Authentication & Authorization

### JWT Implementation

```typescript
// Token Generation
const token = sign({}, authConfig.jwt.secret, {
  subject: user.id,
  expiresIn: authConfig.jwt.expiresIn,
})

// Token Verification
const decodedToken = verify(token, authConfig.jwt.secret)
const { sub } = decodedToken as TokenPayload

request.user = {
  id: sub,
}
```

### Authentication Flow

1. User sends credentials to `/sessions`
2. System validates credentials
3. JWT token is generated and returned
4. Client includes token in subsequent requests
5. Middleware verifies token on protected routes

### Authorization Middleware

```typescript
export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT Token is missing.')
  }

  const [, token] = authHeader.split(' ')

  try {
    const decodedToken = verify(token, authConfig.jwt.secret)
    const { sub } = decodedToken as TokenPayload

    request.user = { id: sub }
    return next()
  } catch {
    throw new AppError('Invalid JWT Token.')
  }
}
```

## 🗄️ Database Design

### Entity Relationships

```
┌─────────────────┐
│      Users      │
│─────────────────│
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ avatar          │
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐
│   User Tokens   │
│─────────────────│
│ id (PK)         │
│ token           │
│ user_id (FK)    │
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐
│    Products     │
│─────────────────│
│ id (PK)         │
│ name            │
│ description     │
│ price           │
│ quantity        │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### TypeORM Entity Configuration

```typescript
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  avatar: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
```

### Migration Management

```typescript
export class CreateTableUsers1656974488575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        // ... other columns
      ],
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}
```

## 📁 File Management

### Upload Configuration

```typescript
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
}
```

### File Upload Flow

1. Client sends multipart/form-data request
2. Multer middleware processes the file
3. File is saved to local storage with unique name
4. Filename is stored in database
5. Static file serving via Express

## ❌ Error Handling

### Error Hierarchy

```typescript
// Base Error Class
class AppError {
  public readonly message: string
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}

// Usage in Services
if (emailExists) {
  throw new AppError('Email address already used.')
}

if (!user) {
  throw new AppError('Incorrect email/password combination.', 401)
}
```

### Global Error Handler

```typescript
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      })
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  },
)
```

## 🔧 Middleware Architecture

### Middleware Stack

```typescript
const app = express()

// CORS for cross-origin requests
app.use(cors())

// Body parsing
app.use(express.json())

// Static file serving
app.use('/files', express.static(uploadConfig.directory))

// Routes
app.use(routes)

// Validation errors (Celebrate)
app.use(errors())

// Global error handler
app.use(globalErrorHandler)
```

### Custom Middleware

```typescript
// Authentication Middleware
app.get('/users', isAuthenticated, usersController.index)

// Validation Middleware
app.post('/users', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}), usersController.create)
```

## ⚙️ Configuration Management

### Environment Configuration

```typescript
// src/config/auth.ts
export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
}

// src/config/upload.ts
export default {
  directory: process.env.UPLOAD_PATH || './uploads',
  // ... multer configuration
}
```

### TypeORM Configuration

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "entities": ["src/modules/**/database/entities/*.ts"],
  "migrations": ["src/database/migrations/*.ts"],
  "cli": {
    "migrationsDir": "src/database/migrations"
  }
}
```

## 🚀 Performance Considerations

### Database Optimization

- **Connection Pooling**: TypeORM manages connection pools
- **Query Optimization**: Repository pattern with optimized queries
- **Indexing**: UUID primary keys with automatic indexing

### Caching Strategy

- **Static Files**: Express static middleware with caching headers
- **JWT Tokens**: Stateless authentication reduces database queries

### File Upload Optimization

- **Local Storage**: Fast disk I/O for file uploads
- **Unique Filenames**: Prevents conflicts and enables caching

## 🔒 Security Architecture

### Authentication Security

- **JWT Tokens**: Stateless, secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Token Expiration**: Configurable token lifetime

### Input Validation

- **Joi Validation**: Schema-based validation for all inputs
- **UUID Validation**: Ensures valid UUID format for IDs
- **Email Validation**: Email format validation

### CORS Configuration

```typescript
app.use(cors())
```

### SQL Injection Prevention

- **TypeORM**: Parameterized queries prevent SQL injection
- **Repository Pattern**: Abstracted data access

## 📈 Scalability Considerations

### Horizontal Scaling

- **Stateless Design**: JWT tokens enable stateless scaling
- **Database Connection Pooling**: Efficient resource management
- **Modular Architecture**: Independent module scaling

### Vertical Scaling

- **Efficient Memory Usage**: TypeScript and optimized queries
- **Connection Pooling**: Reduced database connection overhead

### Future Enhancements

- **Caching Layer**: Redis for session and data caching
- **Message Queues**: Asynchronous processing
- **Microservices**: Module separation into independent services
- **Load Balancing**: Multiple application instances

## 🔄 Deployment Architecture

### Development Environment

```
┌─────────────────┐
│   Developer     │
│    Machine      │
├─────────────────┤
│ • Node.js       │
│ • TypeScript    │
│ • PostgreSQL    │
│ • ts-node-dev   │
└─────────────────┘
```

### Production Considerations

```
┌─────────────────┐    ┌─────────────────┐
│  Load Balancer  │────│   App Server    │
│                 │    │                 │
└─────────────────┘    ├─────────────────┤
                       │ • Node.js       │
┌─────────────────┐    │ • PM2 Process   │
│   Database      │────│   Manager       │
│                 │    │ • Built JS      │
│ • PostgreSQL    │    └─────────────────┘
│ • Connection    │
│   Pooling       │    ┌─────────────────┐
└─────────────────┘    │  File Storage   │
                       │                 │
                       │ • Static Files  │
                       │ • Uploads       │
                       └─────────────────┘
```

---

This architecture documentation provides a comprehensive overview of the Alpha Tower Sales System's technical design and implementation decisions. For implementation details, refer to the [API Documentation](API.md) and [Database Documentation](DATABASE.md).
