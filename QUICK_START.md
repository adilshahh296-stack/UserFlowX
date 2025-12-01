# UserFlowX - Quick Start Guide

Get the UserFlowX application running in 10 minutes!

## Prerequisites

- Node.js 16+ with npm
- MongoDB Atlas account (free tier available)
- Gmail account or SMTP service for email verification

## Step 1: MongoDB Setup (2 minutes)

1. Go to [mongodb.com](https://www.mongodb.com)
2. Sign up for free (or login)
3. Create a cluster (select "M0 Free")
4. Click "Connect" → "Connect to your application"
5. Copy the connection string with your username/password
6. Save this for later

## Step 2: Gmail Setup for Email (1 minute)

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Copy the generated 16-character password
4. Save this for later

## Step 3: Backend Setup (3 minutes)

```bash
# Navigate to backend
cd userflowx-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Open `.env` and fill in:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/userflowx
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
```

Start the server:
```bash
npm run dev
```

✅ Backend running on `http://localhost:5000`

## Step 4: Frontend Setup (2 minutes)

In a new terminal:

```bash
# Navigate to frontend
cd userflowx-frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
```

`.env.local` is already configured, start the app:
```bash
npm run dev
```

✅ Frontend running on `http://localhost:3000`

## Step 5: Test the Application (2 minutes)

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Get Started"
3. Register a new account
4. **For testing**: Check backend console for verification link (or check email)
5. Copy the verification URL and open it in browser
6. Login with your credentials
7. View your dashboard

## Testing the Full Flow

### Registration → Email Verification → Login

```
1. Register at /register
   - Check backend console for verification link
   - Example: http://localhost:3000/verify-email?token=eyJhbGc...

2. Click verification link in browser
   - Should show success message

3. Login at /login
   - Use registered email and password
   - Should redirect to dashboard

4. View dashboard
   - See your profile information
   - Option to change password
```

### Testing Admin Features

To test admin features, you need to manually update a user in MongoDB:

```javascript
// 1. Open MongoDB Atlas in browser
// 2. Click "Collections" in your cluster
// 3. Find the "users" collection
// 4. Edit a user document and change role from "user" to "admin"
// 5. Logout and login again
// 6. You should now see "Admin Panel" link in dashboard
```

Or use curl:

```bash
# Get user token first, then update another user:
curl -X PUT http://localhost:5000/users/{userId}/role \
  -H "Authorization: Bearer {your_jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

## Common Issues & Solutions

### "Cannot find module 'express'"
```bash
# In backend folder:
npm install
```

### "CORS error" when trying to login
- Make sure backend is running on `http://localhost:5000`
- Check `.env` has correct URLs

### "Email not sending"
- Verify Gmail app password is correct (16 characters)
- Check if "Less secure app access" is needed for your Gmail account
- Make sure SMTP settings in `.env` are correct

### "MongoDB connection refused"
- Verify connection string in `.env`
- Make sure IP address is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for development)
- Check if network connection is enabled in MongoDB Atlas

### Port already in use
```bash
# Backend uses port 5000, frontend uses port 3000
# Kill processes if needed:

# Windows:
netstat -ano | findstr :5000
taskkill /PID {PID} /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

## API Testing with Postman

1. Import `POSTMAN_COLLECTION.json` into Postman
2. Set variables:
   - `api_url`: `http://localhost:5000`
3. Test each endpoint in order:
   - Register
   - Get the token from Login response
   - Use token in subsequent requests

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String ('user' | 'admin'),
  isVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## File Structure

```
userflowx/
├── userflowx-backend/
│   ├── src/
│   │   ├── config/       # DB & email config
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # MongoDB schemas
│   │   ├── middleware/   # Auth & role middleware
│   │   ├── routes/       # API endpoints
│   │   ├── utils/        # Helpers
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── userflowx-frontend/
│   ├── app/              # Next.js pages
│   │   ├── (public)/     # Public pages
│   │   ├── (protected)/  # Protected pages
│   │   └── layout.tsx
│   ├── components/       # React components
│   ├── context/          # Auth context
│   ├── lib/              # API client
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── README.md             # Main documentation
├── API_DOCUMENTATION.md  # API reference
└── POSTMAN_COLLECTION.json
```

## Next Steps

1. ✅ Application is running
2. ✅ Create test accounts
3. ✅ Verify the flow works
4. 📖 Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API
5. 🚀 Deploy to Vercel (frontend) and Render (backend)
6. 🎨 Customize styling and branding
7. 📊 Add analytics and logging

## Deployment Quick Links

- **MongoDB**: [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- **Vercel**: [vercel.com](https://vercel.com) - Deploy frontend
- **Render**: [render.com](https://render.com) - Deploy backend
- **Railway**: [railway.app](https://railway.app) - Alternative for backend

## Need Help?

1. Check the main [README.md](./README.md)
2. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. Review backend or frontend README
4. Check console for error messages

## Key Endpoints Quick Reference

```
// Auth
POST   /auth/register              ← Register new user
GET    /auth/verify-email?token=   ← Verify email
POST   /auth/login                 ← Login
POST   /auth/forgot-password       ← Reset password
POST   /auth/reset-password?token= ← Set new password

// Users
GET    /users/profile              ← Get user info
GET    /users/all                  ← Get all users (admin)
PUT    /users/:id/role             ← Update role (admin)
DELETE /users/:id                  ← Delete user (admin)
```

## Environment Variables Summary

**Backend (.env):**
```
MONGODB_URI=<your_mongo_string>
JWT_SECRET=<32+ character secret>
SMTP_USER=<your_gmail>
SMTP_PASS=<app_password>
FRONTEND_URL=http://localhost:3000
PORT=5000
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

**Ready to go!** 🎉

Open [http://localhost:3000](http://localhost:3000) and start exploring UserFlowX!
