# API Documentation

> **Complete API reference for Alpha Tower Sales System**

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Status Codes](#status-codes)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#users-endpoints)
  - [Products](#products-endpoints)
- [Request Examples](#request-examples)
- [Response Examples](#response-examples)

## 🔍 Overview

The Alpha Tower Sales System API is a RESTful API that provides endpoints for managing users, products, and authentication. All API responses are in JSON format.

## 🔐 Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifetime
- Default expiration: 24 hours
- Configurable via JWT_EXPIRES_IN environment variable

## 🌐 Base URL

```
http://localhost:8080
```

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200  | OK - Request successful |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid request data |
| 401  | Unauthorized - Authentication required |
| 404  | Not Found - Resource not found |
| 500  | Internal Server Error - Server error |

## ❌ Error Handling

All errors follow a consistent format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Common Error Messages

- `JWT Token is missing.` - No authorization header provided
- `Invalid JWT Token.` - Token is invalid or expired
- `Email address already used.` - Email already exists during registration
- `Incorrect email/password combination.` - Invalid login credentials

## 📚 Endpoints

### 🔑 Authentication Endpoints

#### Login User

Create a new session and receive a JWT token.

```http
POST /sessions
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "avatar-filename.jpg",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-string"
}
```

**Validation Rules:**
- `email`: Required, must be a valid email format
- `password`: Required

---

### 👥 Users Endpoints

#### List All Users

Retrieve a list of all users (authenticated route).

```http
GET /users
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "avatar-filename.jpg",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get User by ID

Retrieve a specific user by their ID (authenticated route).

```http
GET /users/:id
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `id` (UUID, required): User ID

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "avatar-filename.jpg",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

#### Create New User

Register a new user account.

```http
POST /users
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": null,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

**Validation Rules:**
- `name`: Required string
- `email`: Required, must be a valid email format, must be unique
- `password`: Required string

#### Update User

Update an existing user (authenticated route).

```http
PUT /users/:id
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `id` (UUID, required): User ID

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "John Updated",
  "email": "john.updated@example.com",
  "avatar": "avatar-filename.jpg",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T12:00:00.000Z"
}
```

**Validation Rules:**
- `name`: Required string
- `email`: Required, must be a valid email format
- `password`: Required string

#### Delete User

Delete a user account (authenticated route).

```http
DELETE /users/:id
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `id` (UUID, required): User ID

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

#### Upload User Avatar

Update a user's avatar image (authenticated route).

```http
PATCH /users/avatar
```

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `avatar`: Image file (jpg, png, gif)

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "new-avatar-filename.jpg",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T12:00:00.000Z"
}
```

---

### 📦 Products Endpoints

#### List All Products

Retrieve a list of all products (authenticated route).

```http
GET /products
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-string",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "quantity": 100,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get Product by ID

Retrieve a specific product by its ID (authenticated route).

```http
GET /products/:id
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `id` (UUID, required): Product ID

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "quantity": 100,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

#### Create New Product

Create a new product (authenticated route).

```http
POST /products
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "quantity": 50
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "quantity": 50,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

**Validation Rules:**
- `name`: Required string
- `description`: Optional string
- `price`: Required number with 2 decimal precision
- `quantity`: Required integer

#### Update Product

Update an existing product (authenticated route).

```http
PUT /products/:id
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `id` (UUID, required): Product ID

**Request Body:**
```json
{
  "name": "Updated Product",
  "description": "Updated description",
  "price": 129.99,
  "quantity": 75
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "Updated Product",
  "description": "Updated description",
  "price": 129.99,
  "quantity": 75,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T12:00:00.000Z"
}
```

**Validation Rules:**
- `name`: Required string
- `description`: Optional string
- `price`: Required number with 2 decimal precision
- `quantity`: Required integer

#### Delete Product

Delete a product (authenticated route).

```http
DELETE /products/:id
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `id` (UUID, required): Product ID

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## 📝 Request Examples

### Using cURL

#### Login
```bash
curl -X POST http://localhost:8080/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Create Product
```bash
curl -X POST http://localhost:8080/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "quantity": 50
  }'
```

#### Upload Avatar
```bash
curl -X PATCH http://localhost:8080/users/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@/path/to/image.jpg"
```

### Using JavaScript (Fetch API)

#### Login
```javascript
const response = await fetch('http://localhost:8080/sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data);
```

#### Get Products
```javascript
const response = await fetch('http://localhost:8080/products', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});

const products = await response.json();
console.log(products);
```

---

## 📋 Response Examples

### Successful Responses

#### User Creation Success
```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": null,
  "created_at": "2023-12-01T10:30:00.000Z",
  "updated_at": "2023-12-01T10:30:00.000Z"
}
```

#### Product List Success
```json
[
  {
    "id": "p1q2w3e4-r5t6-y7u8-i9o0-p1a2s3d4f5g6",
    "name": "Laptop Computer",
    "description": "High-performance laptop for professionals",
    "price": 1299.99,
    "quantity": 25,
    "created_at": "2023-12-01T09:00:00.000Z",
    "updated_at": "2023-12-01T09:00:00.000Z"
  },
  {
    "id": "z1x2c3v4-b5n6-m7q8-w9e0-r1t2y3u4i5o6",
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with long battery life",
    "price": 29.99,
    "quantity": 150,
    "created_at": "2023-12-01T08:30:00.000Z",
    "updated_at": "2023-12-01T08:30:00.000Z"
  }
]
```

### Error Responses

#### Validation Error
```json
{
  "status": "error",
  "message": "\"email\" must be a valid email"
}
```

#### Authentication Error
```json
{
  "status": "error",
  "message": "JWT Token is missing."
}
```

#### Not Found Error
```json
{
  "status": "error",
  "message": "User not found"
}
```

#### Duplicate Email Error
```json
{
  "status": "error",
  "message": "Email address already used."
}
```

---

## 📞 Testing the API

### Using Insomnia/Postman

1. Import the collection from `resource/Insomnia_2022-07-14.json`
2. Set up environment variables:
   - `base_url`: http://localhost:8080
   - `token`: Your JWT token after login

### Using HTTP Client

You can test all endpoints using any HTTP client by following the examples above. Make sure to:

1. Start the server: `yarn localhost`
2. Set up the database and run migrations
3. Use the correct Content-Type headers
4. Include Authorization headers for protected routes

---

## 🔧 Rate Limiting

Currently, there are no rate limiting restrictions implemented. This should be considered for production environments.

## 📄 Changelog

- **v1.0.0**: Initial API release with Users and Products modules
- Authentication with JWT tokens
- File upload for user avatars
- Complete CRUD operations for all resources

---

For more information about the project setup and configuration, see the main [README.md](../README.md) file.
