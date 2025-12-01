# UserFlowX - Complete MERN User Onboarding System

A production-ready, full-stack user onboarding system built with the MERN stack (MongoDB, Express, React, Node.js) using Next.js 14 for the frontend.

## Project Overview

UserFlowX is a modular user onboarding feature demonstrating full-stack expertise with:

- **User Registration & Email Verification**
- **Secure Authentication (JWT + HTTP-only Cookies)**
- **Password Reset via Email**
- **Role-Based Access Control (RBAC)**
- **Admin User Management Dashboard**
- **Responsive Mobile-First UI**
- **Production-Ready Architecture**

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Passwords**: bcryptjs
- **Email**: Nodemailer
- **Validation**: Joi
- **Environment**: dotenv

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API
- **Cookie Management**: js-cookie

### Tools & DevOps
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **API Testing**: Postman / Thunder Client

## Project Structure

```
userflowx/
├── userflowx-backend/          # Node.js + Express backend
│   ├── src/
│   │   ├── config/             # Database & email config
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Mongoose schemas
│   │   ├── middleware/         # Auth & role middleware
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Helpers & validators
│   │   └── server.js           # Entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── userflowx-frontend/         # Next.js 14 frontend
│   ├── app/                    # App Router pages
│   │   ├── (public)/           # Public pages
│   │   ├── (protected)/        # Protected pages
│   │   └── layout.tsx
│   ├── components/             # Reusable components
│   ├── context/                # Auth context
│   ├── lib/                    # Utilities & API
│   ├── public/                 # Static assets
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
├── API_DOCUMENTATION.md        # Detailed API docs
├── POSTMAN_COLLECTION.json     # Postman API collection
└── README.md                   # This file
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)
- SMTP email service (Gmail, SendGrid, etc.)

### Backend Setup

```bash
cd userflowx-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# - MONGODB_URI
# - JWT_SECRET
# - SMTP credentials
# - FRONTEND_URL

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd userflowx-frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Configure environment variables
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features & Functionality

### 1. Authentication Module

#### Registration
- User registration with validation
- Password hashing with bcrypt
- Email verification link sent
- User created with `isVerified: false`

#### Email Verification
- Token-based verification links
- JWT token in email URL
- Updates `isVerified: true` on success
- Automatic redirect on email click

#### Login
- Email & password validation
- Email verification required
- JWT token generated and stored in HTTP-only cookie
- User data returned with token

#### Password Reset
- Email verification via Nodemailer
- Token-based reset links
- 1-hour token expiration
- Secure password update

### 2. Role-Based Access Control (RBAC)

**Roles:**
- `user` - Standard user access
- `admin` - Full system access

**Protected Routes:**
- `/users/profile` - Authenticated users only
- `/users/all` - Admin only
- `/admin` - Admin only
- `/admin/users` - Admin only

**Middleware:**
- `authMiddleware` - Verifies JWT token
- `roleMiddleware(['admin'])` - Restricts to specific roles

### 3. Frontend Pages

#### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Home page with feature overview |
| `/register` | User registration form |
| `/login` | User login form |
| `/verify-email?token=` | Email verification page |
| `/forgot-password` | Password reset request |
| `/reset-password?token=` | Password reset form |

#### Protected Pages
| Route | Role | Description |
|-------|------|-------------|
| `/dashboard` | User+ | User dashboard & profile |
| `/admin` | Admin | Admin panel |
| `/admin/users` | Admin | User management table |

### 4. API Endpoints

#### Authentication Routes

```
POST   /auth/register              - Register new user
GET    /auth/verify-email?token=   - Verify email
POST   /auth/login                 - User login
POST   /auth/forgot-password       - Request password reset
POST   /auth/reset-password?token= - Reset password
POST   /auth/logout                - Logout user
```

#### User Routes (Protected)

```
GET    /users/profile              - Get user profile
GET    /users/all?page=&limit=     - Get all users (admin)
PUT    /users/:userId/role         - Update user role (admin)
DELETE /users/:userId              - Delete user (admin)
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API specifications.

## Security Features

✅ **Password Security**
- Bcryptjs hashing with 10 salt rounds
- Never returned in API responses
- Minimum 6 characters enforced

✅ **Authentication**
- JWT tokens with 7-day expiration
- HTTP-only cookies prevent XSS attacks
- Token verification on protected routes
- Automatic logout on token expiration

✅ **Email Verification**
- Token-based verification links
- 24-hour token expiration (configurable)
- Email confirmation required before login

✅ **Input Validation**
- Joi schema validation
- Email format validation
- Password strength requirements
- XSS prevention

✅ **Authorization**
- Role-based access control
- Middleware-enforced permissions
- Admin-only endpoints protected

✅ **CORS Protection**
- Configured for specific origins
- Credentials allowed only from trusted domains

## Environment Configuration

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/userflowx

# JWT
JWT_SECRET=your_super_secret_key_min_32_characters
JWT_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@userflowx.com

# URLs
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Testing

### Manual Testing with Postman/Thunder Client

1. **Import Collection**: Import `POSTMAN_COLLECTION.json` into Postman
2. **Configure Variables**: Update `api_url` to match your backend
3. **Test Workflow**:
   - Register → Verify Email → Login → Access Protected Routes

### Recommended Test Cases

```
✓ Register with valid data
✓ Register with duplicate email
✓ Register with invalid email
✓ Verify email with valid token
✓ Verify email with expired token
✓ Login with verified account
✓ Login without verification
✓ Login with wrong password
✓ Request password reset
✓ Reset password with valid token
✓ Reset password with mismatched passwords
✓ Access protected route without token
✓ Access admin route as regular user
✓ Update user role as admin
✓ Logout and verify token invalidated
```

## Deployment

### MongoDB Atlas Setup
1. Create account at mongodb.com
2. Create cluster (free tier available)
3. Create database user
4. Copy connection string
5. Add to backend `.env`

### Backend Deployment (Render)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Render
# - New Web Service
# - Connect GitHub repo
# - Build Command: npm install
# - Start Command: npm start
# - Add environment variables
# - Deploy
```

### Frontend Deployment (Vercel)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
# - Import project from GitHub
# - Configure environment variables
# - Deploy automatically

# Or use Vercel CLI:
vercel --prod
```

## Project Timeline & Milestones

### Phase 1: Backend Foundation ✅
- [x] Project structure & setup
- [x] MongoDB connection
- [x] User model with password hashing
- [x] Authentication controller

### Phase 2: Email & Security ✅
- [x] Email verification system
- [x] Password reset flow
- [x] JWT middleware
- [x] Role-based middleware

### Phase 3: Frontend Core ✅
- [x] Next.js 14 setup with TailwindCSS
- [x] Authentication context
- [x] Register & login pages
- [x] Email verification flow

### Phase 4: Protected Features ✅
- [x] Dashboard page
- [x] Admin panel
- [x] User management
- [x] Auth & admin guards

### Phase 5: Polish & Documentation ✅
- [x] API documentation
- [x] Postman collection
- [x] README files
- [x] Environment examples
- [x] Error handling

## Performance Optimization

- ✅ Next.js App Router (automatic code splitting)
- ✅ Image optimization
- ✅ CSS-in-JS (Tailwind)
- ✅ Database indexing on emails
- ✅ JWT caching in cookies
- ✅ Axios request caching

## Future Enhancements

- [ ] Social OAuth (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Activity logging & audit trails
- [ ] Advanced admin analytics dashboard
- [ ] User profile customization
- [ ] Email notification preferences
- [ ] Rate limiting on auth endpoints
- [ ] Session management
- [ ] Dark mode support

## Troubleshooting

### Backend Issues

**CORS errors:**
- Verify `FRONTEND_URL` matches frontend origin
- Check `credentials: true` in CORS config

**Email not sending:**
- Verify SMTP credentials
- Check firewall/security settings
- Enable "Less secure apps" for Gmail

**MongoDB connection fails:**
- Verify connection string
- Check IP whitelist in Atlas
- Ensure network access enabled

### Frontend Issues

**API calls failing:**
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL`
- Verify CORS configuration

**Token not persisting:**
- Check browser cookie settings
- Verify `withCredentials: true` in axios

**Auth guards not working:**
- Ensure AuthProvider wraps app in layout.tsx
- Verify useAuth() called within provider

## Code Quality

- **Linting**: ESLint configured for code consistency
- **Formatting**: Prettier for automatic code formatting
- **Error Handling**: Try-catch blocks and proper error responses
- **Validation**: Input validation on all routes
- **Comments**: Inline documentation for complex logic

## Git Workflow

```bash
# Feature branch
git checkout -b feature/new-feature
git add .
git commit -m "feat: Add new feature"
git push origin feature/new-feature

# Merge to main
git checkout main
git pull
git merge feature/new-feature
git push origin main
```

## License

MIT - Feel free to use this project for learning or as a template for your own projects.

## Contributing

Contributions are welcome! Please follow the code style and submit pull requests to the main branch.

## Support & Questions

For questions or issues:
1. Check the README in each folder
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. Test with [POSTMAN_COLLECTION.json](./POSTMAN_COLLECTION.json)
4. Review error messages in console

## Author

Built as a demonstration of full-stack MERN expertise with modern best practices.

---

**Project Status**: Complete and Production-Ready ✅

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
