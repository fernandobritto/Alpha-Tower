# Database Documentation

> **Complete database schema and migration reference for Alpha Tower Sales System**

## 📋 Table of Contents

- [Overview](#overview)
- [Database Design](#database-design)
- [Tables](#tables)
  - [Users Table](#users-table)
  - [User Tokens Table](#user-tokens-table)
  - [Products Table](#products-table)
- [Entity Relationships](#entity-relationships)
- [Migrations](#migrations)
- [Indexes](#indexes)
- [Constraints](#constraints)
- [TypeORM Configuration](#typeorm-configuration)
- [Common Queries](#common-queries)
- [Database Operations](#database-operations)
- [Backup and Restore](#backup-and-restore)
- [Performance Optimization](#performance-optimization)

## 🔍 Overview

The Alpha Tower Sales System uses **PostgreSQL** as its primary database, managed through **TypeORM** for object-relational mapping. The database follows a normalized design with clear entity relationships and proper indexing for optimal performance.

### Database Specifications

- **Database System**: PostgreSQL 12+
- **ORM**: TypeORM 0.2.29
- **Character Set**: UTF-8
- **Collation**: Default PostgreSQL collation
- **Time Zone**: UTC

### Design Principles

- **Normalization**: Third normal form (3NF) compliance
- **UUID Primary Keys**: For better scalability and security
- **Timestamps**: Automatic created_at and updated_at tracking
- **Constraints**: Foreign keys and unique constraints for data integrity
- **Indexing**: Strategic indexing for query performance

## 🏗 Database Design

### ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────┐
│               Users                 │
├─────────────────────────────────────┤
│ id (PK)         │ UUID              │
│ name            │ VARCHAR           │
│ email           │ VARCHAR (UNIQUE)  │
│ password        │ VARCHAR           │
│ avatar          │ VARCHAR (NULL)    │
│ created_at      │ TIMESTAMP         │
│ updated_at      │ TIMESTAMP         │
└─────────────┬───────────────────────┘
              │ 1:N
              │
┌─────────────▼───────────────────────┐
│            User Tokens              │
├─────────────────────────────────────┤
│ id (PK)         │ UUID              │
│ token           │ UUID              │
│ user_id (FK)    │ UUID              │
│ created_at      │ TIMESTAMP         │
│ updated_at      │ TIMESTAMP         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│              Products               │
├─────────────────────────────────────┤
│ id (PK)         │ UUID              │
│ name            │ VARCHAR           │
│ description     │ VARCHAR (NULL)    │
│ price           │ DECIMAL(10,2)     │
│ quantity        │ INTEGER           │
│ created_at      │ TIMESTAMP         │
│ updated_at      │ TIMESTAMP         │
└─────────────────────────────────────┘
```

## 📊 Tables

### Users Table

The `users` table stores user account information with authentication and profile data.

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

#### Columns

| Column     | Type      | Constraints       | Description                    |
|------------|-----------|-------------------|--------------------------------|
| id         | UUID      | PRIMARY KEY       | Unique user identifier         |
| name       | VARCHAR   | NOT NULL          | User's full name               |
| email      | VARCHAR   | UNIQUE, NOT NULL  | User's email address           |
| password   | VARCHAR   | NOT NULL          | Hashed password (bcrypt)       |
| avatar     | VARCHAR   | NULLABLE          | Avatar filename                |
| created_at | TIMESTAMP | DEFAULT NOW()     | Account creation timestamp     |
| updated_at | TIMESTAMP | DEFAULT NOW()     | Last modification timestamp    |

#### TypeORM Entity

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

#### Sample Data

```sql
INSERT INTO users (name, email, password, avatar) VALUES
('John Doe', 'john@example.com', '$2y$08$hashed_password', 'avatar1.jpg'),
('Jane Smith', 'jane@example.com', '$2y$08$hashed_password', NULL);
```

---

### User Tokens Table

The `user_tokens` table manages authentication tokens for password resets and other token-based operations.

```sql
CREATE TABLE user_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Columns

| Column     | Type      | Constraints       | Description                    |
|------------|-----------|-------------------|--------------------------------|
| id         | UUID      | PRIMARY KEY       | Unique token record identifier |
| token      | UUID      | DEFAULT UUID      | Generated token value          |
| user_id    | UUID      | FOREIGN KEY       | Reference to users table       |
| created_at | TIMESTAMP | DEFAULT NOW()     | Token creation timestamp       |
| updated_at | TIMESTAMP | DEFAULT NOW()     | Last modification timestamp    |

#### TypeORM Entity

```typescript
@Entity('user_tokens')
class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Generated('uuid')
  token: string

  @Column()
  user_id: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
```

---

### Products Table

The `products` table stores product catalog information including inventory data.

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

#### Columns

| Column      | Type          | Constraints       | Description                    |
|-------------|---------------|-------------------|--------------------------------|
| id          | UUID          | PRIMARY KEY       | Unique product identifier      |
| name        | VARCHAR       | NOT NULL          | Product name                   |
| description | VARCHAR       | NULLABLE          | Product description            |
| price       | DECIMAL(10,2) | NOT NULL          | Product price with 2 decimals  |
| quantity    | INTEGER       | NOT NULL          | Available inventory quantity   |
| created_at  | TIMESTAMP     | DEFAULT NOW()     | Product creation timestamp     |
| updated_at  | TIMESTAMP     | DEFAULT NOW()     | Last modification timestamp    |

#### TypeORM Entity

```typescript
@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column('decimal')
  price: number

  @Column('int')
  quantity: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
```

#### Sample Data

```sql
INSERT INTO products (name, description, price, quantity) VALUES
('Laptop Computer', 'High-performance laptop for professionals', 1299.99, 25),
('Wireless Mouse', 'Ergonomic wireless mouse with long battery life', 29.99, 150),
('Mechanical Keyboard', 'RGB mechanical gaming keyboard', 89.99, 75);
```

## 🔗 Entity Relationships

### Current Relationships

1. **Users → User Tokens** (One-to-Many)
   - One user can have multiple tokens (for different purposes)
   - Foreign key: `user_tokens.user_id` → `users.id`
   - Cascade delete: When user is deleted, all tokens are removed

### Potential Future Relationships

```sql
-- Orders table (future enhancement)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items table (future enhancement)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 📦 Migrations

### Migration Files

TypeORM manages database schema changes through migration files located in `src/database/migrations/`.

#### 1. Create Products Table (1656514921765)

```typescript
export class CreateTableProducts1656514921765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'integer',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products')
  }
}
```

#### 2. Create Users Table (1656974488575)

```typescript
export class CreateTableUsers1656974488575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}
```

### Migration Commands

```bash
# Generate a new migration
yarn database migration:generate -- --name MigrationName

# Run pending migrations
yarn database:run

# Revert the last migration
yarn database:revert

# Show migration status
yarn database migration:show

# Sync database schema (development only)
yarn database:sync
```

## 📈 Indexes

### Automatic Indexes

- **Primary Keys**: Automatic unique index on all `id` columns
- **Unique Constraints**: Automatic unique index on `users.email`

### Recommended Additional Indexes

```sql
-- Performance indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX idx_user_tokens_token ON user_tokens(token);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_created_at_users ON users(created_at);
CREATE INDEX idx_created_at_products ON products(created_at);
```

### Index Usage Examples

```sql
-- Fast email lookup (uses idx_users_email)
SELECT * FROM users WHERE email = 'user@example.com';

-- Fast token validation (uses idx_user_tokens_token)
SELECT * FROM user_tokens WHERE token = 'uuid-token-value';

-- Product search by name (uses idx_products_name)
SELECT * FROM products WHERE name ILIKE '%laptop%';
```

## 🔒 Constraints

### Primary Key Constraints

```sql
-- All tables have UUID primary keys
ALTER TABLE users ADD CONSTRAINT pk_users PRIMARY KEY (id);
ALTER TABLE user_tokens ADD CONSTRAINT pk_user_tokens PRIMARY KEY (id);
ALTER TABLE products ADD CONSTRAINT pk_products PRIMARY KEY (id);
```

### Unique Constraints

```sql
-- Email uniqueness
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
```

### Foreign Key Constraints

```sql
-- User tokens reference users
ALTER TABLE user_tokens 
ADD CONSTRAINT fk_user_tokens_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

### Check Constraints

```sql
-- Price must be positive
ALTER TABLE products ADD CONSTRAINT chk_products_price_positive 
CHECK (price > 0);

-- Quantity must be non-negative
ALTER TABLE products ADD CONSTRAINT chk_products_quantity_non_negative 
CHECK (quantity >= 0);

-- Email format validation (PostgreSQL specific)
ALTER TABLE users ADD CONSTRAINT chk_users_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

## ⚙️ TypeORM Configuration

### ormconfig.json

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "password",
  "database": "alpha_tower",
  "synchronize": false,
  "logging": true,
  "entities": [
    "src/modules/**/database/entities/*.ts"
  ],
  "migrations": [
    "src/database/migrations/*.ts"
  ],
  "cli": {
    "entitiesDir": "src/modules/**/database/entities",
    "migrationsDir": "src/database/migrations"
  }
}
```

### Environment Variables

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=alpha_tower

# TypeORM Configuration
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=true
TYPEORM_MIGRATIONS_RUN=true
```

### Connection Setup

```typescript
// src/database/index.ts
import { createConnection } from 'typeorm'

createConnection()
  .then(() => {
    console.log('Database connected successfully')
  })
  .catch(error => {
    console.error('Database connection failed:', error)
  })
```

## 🔍 Common Queries

### User Management Queries

```sql
-- Find user by email
SELECT * FROM users WHERE email = $1;

-- Get user with token count
SELECT u.*, COUNT(ut.id) as token_count 
FROM users u 
LEFT JOIN user_tokens ut ON u.id = ut.user_id 
WHERE u.id = $1 
GROUP BY u.id;

-- Find users created in the last 30 days
SELECT * FROM users 
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

### Product Management Queries

```sql
-- Find products by name (case-insensitive)
SELECT * FROM products 
WHERE name ILIKE '%' || $1 || '%'
ORDER BY name;

-- Get low stock products
SELECT * FROM products 
WHERE quantity < $1 
ORDER BY quantity ASC;

-- Products within price range
SELECT * FROM products 
WHERE price BETWEEN $1 AND $2 
ORDER BY price ASC;

-- Most expensive products
SELECT * FROM products 
ORDER BY price DESC 
LIMIT 10;
```

### Token Management Queries

```sql
-- Find valid token
SELECT ut.*, u.email 
FROM user_tokens ut 
JOIN users u ON ut.user_id = u.id 
WHERE ut.token = $1;

-- Clean expired tokens (if expiration logic added)
DELETE FROM user_tokens 
WHERE created_at < NOW() - INTERVAL '24 hours';
```

### Analytics Queries

```sql
-- User registration statistics
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as user_count
FROM users 
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Product inventory summary
SELECT 
  COUNT(*) as total_products,
  SUM(quantity) as total_inventory,
  AVG(price) as average_price,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM products;

-- Top products by value
SELECT 
  name,
  price,
  quantity,
  (price * quantity) as inventory_value
FROM products 
ORDER BY inventory_value DESC
LIMIT 10;
```

## 🛠 Database Operations

### Backup Operations

```bash
# Full database backup
pg_dump -h localhost -U postgres -d alpha_tower > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema-only backup
pg_dump -h localhost -U postgres -d alpha_tower --schema-only > schema_backup.sql

# Data-only backup
pg_dump -h localhost -U postgres -d alpha_tower --data-only > data_backup.sql

# Compressed backup
pg_dump -h localhost -U postgres -d alpha_tower | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore Operations

```bash
# Restore from backup
psql -h localhost -U postgres -d alpha_tower < backup_file.sql

# Restore compressed backup
gunzip -c backup_file.sql.gz | psql -h localhost -U postgres -d alpha_tower

# Create database and restore
createdb -h localhost -U postgres alpha_tower_restored
psql -h localhost -U postgres -d alpha_tower_restored < backup_file.sql
```

### Maintenance Operations

```sql
-- Analyze tables for query optimization
ANALYZE users;
ANALYZE products;
ANALYZE user_tokens;

-- Vacuum tables to reclaim space
VACUUM users;
VACUUM products;
VACUUM user_tokens;

-- Full vacuum with analyze
VACUUM FULL ANALYZE;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🚀 Performance Optimization

### Query Optimization Tips

1. **Use Indexes**: Ensure proper indexing on frequently queried columns
2. **Limit Results**: Always use LIMIT for paginated queries
3. **Select Specific Columns**: Avoid SELECT * when possible
4. **Use JOINs Wisely**: Prefer JOINs over subqueries when appropriate

### Connection Pool Configuration

```typescript
// TypeORM connection options
{
  type: 'postgres',
  // ... other options
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
  }
}
```

### Monitoring Queries

```sql
-- Long running queries
SELECT 
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- Database statistics
SELECT 
  datname,
  numbackends,
  xact_commit,
  xact_rollback,
  blks_read,
  blks_hit,
  temp_files,
  temp_bytes
FROM pg_stat_database
WHERE datname = 'alpha_tower';
```

## 📝 Best Practices

### Development

1. **Always use migrations** for schema changes
2. **Test migrations** in development before production
3. **Version control** all migration files
4. **Use meaningful names** for migration files

### Production

1. **Regular backups** with tested restore procedures
2. **Monitor database performance** and query statistics
3. **Update statistics** regularly with ANALYZE
4. **Monitor disk space** and plan for growth

### Security

1. **Use connection pooling** to prevent connection exhaustion
2. **Implement proper indexing** for performance
3. **Regular maintenance** with VACUUM and ANALYZE
4. **Monitor slow queries** and optimize them

---

This database documentation provides comprehensive information about the Alpha Tower Sales System's data layer. For application-level database usage, refer to the [Architecture Documentation](ARCHITECTURE.md) and [API Documentation](API.md).
