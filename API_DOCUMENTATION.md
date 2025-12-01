# UserFlowX API Documentation

Complete REST API reference for the UserFlowX backend.

## Base URL

```
Development:  http://localhost:5000
Production:   https://your-backend-url.com
```

## Authentication

### JWT Token Storage
Tokens are stored in HTTP-only cookies automatically by the backend. Include cookies in requests:

```
Cookie: token=<jwt_token>
```

Or in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Token Format
```javascript
{
  userId: "user_id",
  role: "user" | "admin",
  iat: 1234567890,
  exp: 1234654290
}
```

---

## Authentication Endpoints

### Register User

**Endpoint:** `POST /auth/register`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**Verification Email:**
- Sent automatically to user's email
- Contains verification link with JWT token
- Link format: `https://yourapp.com/verify-email?token=<jwt>`
- Valid for 24 hours (configurable)

---

### Verify Email

**Endpoint:** `GET /auth/verify-email?token=<jwt_token>`

**Description:** Verify user's email address

**Query Parameters:**
- `token` (required): JWT verification token from email link

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid verification token"
}
```

**Notes:**
- Can only verify once per account
- Token must be valid JWT format
- Subsequent calls with same token return success

---

### Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Validation Rules:**
- `email`: Required, valid format
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response (401/403):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

```json
{
  "success": false,
  "message": "Please verify your email before logging in"
}
```

**Notes:**
- JWT token valid for 7 days
- Token automatically stored in HTTP-only cookie
- Email must be verified before login
- Password comparison done securely with bcryptjs

---

### Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Description:** Request password reset email

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Validation Rules:**
- `email`: Required, valid format

**Success Response (200):**
```json
{
  "success": true,
  "message": "If the email exists in our system, a password reset link will be sent"
}
```

**Notes:**
- Always returns 200 for security (doesn't reveal if email exists)
- Reset link sent via email if account exists
- Reset token valid for 1 hour
- Token sent in email URL

---

### Reset Password

**Endpoint:** `POST /auth/reset-password?token=<jwt_token>`

**Description:** Reset user password with valid token

**Query Parameters:**
- `token` (required): JWT token from password reset email

**Request Body:**
```json
{
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Validation Rules:**
- `password`: Required, minimum 6 characters
- `confirmPassword`: Required, must match password
- Token must not be expired

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Reset token has expired"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Passwords must match"
}
```

---

### Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout current user

**Authentication:** Required (JWT token)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Notes:**
- Clears token cookie
- Frontend should also clear localStorage user data
- Token becomes invalid immediately

---

## User Endpoints

### Get Profile

**Endpoint:** `GET /users/profile`

**Description:** Get current authenticated user's profile

**Authentication:** Required (JWT token)

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "No token provided. Please login first."
}
```

---

### Get All Users

**Endpoint:** `GET /users/all?page=1&limit=10`

**Description:** Get all users in the system (admin only)

**Authentication:** Required (JWT token with admin role)

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Users per page, default 10

**Success Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Required role(s): admin"
}
```

---

### Update User Role

**Endpoint:** `PUT /users/:userId/role`

**Description:** Update a user's role (admin only)

**Authentication:** Required (JWT token with admin role)

**Path Parameters:**
- `userId`: MongoDB ObjectId of user

**Request Body:**
```json
{
  "role": "admin"
}
```

**Validation Rules:**
- `role`: Required, must be "user" or "admin"

**Success Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid role. Must be \"user\" or \"admin\""
}
```

---

### Delete User

**Endpoint:** `DELETE /users/:userId`

**Description:** Delete a user account (admin only)

**Authentication:** Required (JWT token with admin role)

**Path Parameters:**
- `userId`: MongoDB ObjectId of user

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot delete your own account"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Required role(s): admin"
}
```

---

## Error Handling

### Standard Error Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

### Authentication Errors

| Status | Message |
|--------|---------|
| 401 | No token provided. Please login first. |
| 401 | Invalid token. |
| 401 | Token expired. Please login again. |

### Validation Errors

Response with status 400 and detailed error messages:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## Request Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'

# Get Profile (with token in header)
curl -X GET http://localhost:5000/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

### Using JavaScript/Fetch

```javascript
// Register
const registerResponse = await fetch('http://localhost:5000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123'
  })
});

// Login
const loginResponse = await fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'Password123'
  })
});

const { token } = await loginResponse.json();

// Get Profile
const profileResponse = await fetch('http://localhost:5000/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include' // Include cookies
});
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Register
await api.post('/auth/register', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'Password123'
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'john@example.com',
  password: 'Password123'
});

const { token } = data;

// Get Profile
await api.get('/users/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Rate Limiting (Optional Future Feature)

Currently not implemented but recommended for production:

- `/auth/register`: 5 requests per hour per IP
- `/auth/login`: 10 requests per hour per IP
- `/auth/forgot-password`: 5 requests per hour per email

---

## Data Models

### User Model

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  isVerified: Boolean,
  resetPasswordToken: String (optional),
  resetPasswordExpire: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Response Format

Success:
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## CORS Configuration

The API is configured to accept requests from:

```
http://localhost:3000      (Development)
https://your-frontend-url  (Production)
```

**Credentials Mode**: Enabled (for cookies)

---

## Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** in HTTP-only cookies
3. **Validate all inputs** on frontend before sending
4. **Never expose sensitive data** in error messages
5. **Use CORS properly** to prevent unauthorized access
6. **Rotate JWT secrets** regularly
7. **Monitor API logs** for suspicious activity
8. **Rate limit** authentication endpoints
9. **Implement request timeouts** (30-60 seconds)
10. **Use environment variables** for configuration

---

## Webhook Events (Future Feature)

Planned webhook events:
- `user.registered`
- `user.verified`
- `user.password_reset`
- `user.deleted`

---

## Changelog

### Version 1.0.0 (Current)
- ✅ User registration and email verification
- ✅ Authentication with JWT
- ✅ Password reset functionality
- ✅ Role-based access control
- ✅ User management endpoints
- ✅ Input validation with Joi
- ✅ Comprehensive error handling

---

For issues or questions, refer to the main README or contact support.
