# UserFlowX Frontend

A modern Next.js 14 frontend for the UserFlowX user onboarding system with authentication, email verification, and role-based access control.

## Features

- ✨ Modern UI built with React 18 and Tailwind CSS
- 🔐 Secure authentication with JWT tokens
- 📧 Email verification flow
- 🔑 Password reset via email
- 👥 Role-based access control (RBAC)
- 📱 Fully responsive design
- ⚡ Next.js 14 App Router
- 🎯 Client and Server Components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API
- **Authentication**: JWT + HTTP-only Cookies

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd userflowx-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your backend URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

## Running the Application

### Development
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
userflowx-frontend/
├── app/
│   ├── (public)/              # Public pages
│   │   ├── register/
│   │   ├── login/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (protected)/           # Protected/authenticated pages
│   │   ├── dashboard/
│   │   ├── admin/
│   │   └── admin/users/
│   ├── layout.tsx             # Root layout with AuthProvider
│   ├── page.jsx               # Home page
│   └── globals.css
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── TextField.jsx
│   │   ├── Button.jsx
│   │   └── Loader.jsx
│   └── auth/                  # Auth-related components
│       ├── AuthGuard.jsx
│       └── AdminGuard.jsx
├── context/
│   └── AuthContext.js         # Authentication context & hook
├── lib/
│   └── api.js                 # Axios API client
├── public/                    # Static assets
├── .env.example
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

## Pages Overview

### Public Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page with feature overview |
| `/register` | User registration |
| `/login` | User login |
| `/verify-email` | Email verification (from link) |
| `/forgot-password` | Password reset request |
| `/reset-password` | Password reset form (from link) |

### Protected Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/dashboard` | Authenticated users | User dashboard |
| `/admin` | Admin only | Admin dashboard |
| `/admin/users` | Admin only | User management |

## Authentication Flow

1. User registers at `/register`
2. Verification email sent to user
3. User clicks email link (with JWT token)
4. Email verified, user can now login
5. Login at `/login` with credentials
6. JWT token stored in HTTP-only cookie
7. Authenticated requests include token automatically
8. Admin users can access `/admin` pages

## Key Components

### AuthProvider
Wraps the entire app, manages authentication state and provides auth methods via `useAuth()` hook.

```jsx
const { user, login, register, logout, isAuthenticated, isAdmin } = useAuth();
```

### API Client
Configured Axios client with automatic token injection and error handling.

```jsx
import { authAPI, userAPI } from '@/lib/api';
```

### Guards
- `<AuthGuard>` - Protects routes that require authentication
- `<AdminGuard>` - Protects routes that require admin role

## Environment Variables

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development Workflow

1. **Create a form component**:
   ```jsx
   <TextField 
     label="Email" 
     type="email" 
     value={email} 
     onChange={handleChange}
     error={errors.email}
   />
   ```

2. **Use authentication**:
   ```jsx
   const { login, user } = useAuth();
   await login(email, password);
   ```

3. **Protect routes**:
   ```jsx
   export default function AdminPage() {
     return (
       <AdminGuard>
         <AdminContent />
       </AdminGuard>
     );
   }
   ```

4. **Call API**:
   ```jsx
   import { userAPI } from '@/lib/api';
   const response = await userAPI.getProfile();
   ```

## Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Verify email via link
- [ ] Login with verified account
- [ ] View user dashboard
- [ ] Logout successfully
- [ ] Request password reset
- [ ] Reset password via email link
- [ ] Login with new password
- [ ] Admin can access admin panel
- [ ] Admin can manage users
- [ ] Admin can change user roles

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

```bash
# Manual deployment
vercel --prod
```

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Google Cloud Run

## Security Considerations

- ✅ Passwords hashed server-side with bcryptjs
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Automatic token injection in API requests
- ✅ CORS protection enabled
- ✅ Input validation on forms
- ✅ Protected routes with auth guards
- ✅ Automatic logout on token expiration

## Troubleshooting

### CORS Errors
Ensure backend CORS is configured correctly:
```javascript
cors({
  origin: 'http://localhost:3000',
  credentials: true,
})
```

### Token Not Being Sent
Check:
- Cookies are enabled in browser
- `withCredentials: true` is set in axios
- Backend is setting cookies correctly

### Pages Not Loading
- Check that AuthProvider wraps all pages
- Verify useAuth() is called in correct context
- Check browser console for errors

## License

MIT

## Support

For issues or questions, refer to the main project documentation or create an issue in the repository.
