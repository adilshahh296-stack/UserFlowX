# UserFlowX Backend

A comprehensive MERN stack backend for user onboarding with authentication, email verification, and role-based access control.

## Features

- User registration with email verification
- JWT-based authentication
- Password reset via email
- Role-based access control (RBAC)
- Admin user management
- Secure password hashing with bcryptjs
- HTTP-only cookies for token storage
- Input validation with Joi
- Email notifications with Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- SMTP email service (Gmail, SendGrid, etc.)

## Installation

1. Clone the repository and navigate to the backend folder:
   ```bash
   cd userflowx-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT (minimum 32 characters)
   - `SMTP_*` - Email service credentials
   - `FRONTEND_URL` - Frontend application URL

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## API Endpoints

### Authentication Routes (`/auth`)

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Verify Email
```
GET /auth/verify-email?token=<jwt_token>
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Forgot Password
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```
POST /auth/reset-password?token=<jwt_token>
Content-Type: application/json

{
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### Logout
```
POST /auth/logout
```

### User Routes (`/users`)

All user routes require authentication via JWT token in Authorization header or cookies.

#### Get Profile
```
GET /users/profile
Authorization: Bearer <jwt_token>
```

#### Get All Users (Admin only)
```
GET /users/all?page=1&limit=10
Authorization: Bearer <jwt_token>
```

#### Update User Role (Admin only)
```
PUT /users/:userId/role
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "role": "admin"
}
```

#### Delete User (Admin only)
```
DELETE /users/:userId
Authorization: Bearer <jwt_token>
```

## Project Structure

```
userflowx-backend/
├── src/
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── mailer.js       # Nodemailer setup
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   └── role.js         # Role-based access control
│   ├── models/
│   │   └── User.js         # Mongoose User schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── validation.js   # Input validation
│   │   └── tokenUtils.js   # Token generation
│   └── server.js           # Express app entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Error Handling

All endpoints return JSON responses with the following format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens expire after 7 days by default
- HTTP-only cookies prevent XSS attacks
- Input validation with Joi
- Role-based access control
- CORS protection
- Email verification required for login

## Testing with Postman/Thunder Client

1. Register a new user
2. Check email for verification link
3. Verify email using the link
4. Login with credentials
5. Use returned JWT token for authenticated requests

## Deployment

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas
2. Get connection string
3. Add to `.env` as `MONGODB_URI`

### Render/Railway
1. Connect your GitHub repository
2. Set environment variables in the platform
3. Deploy

## License

MIT
