# UserFlowX - Deployment Guide

Complete guide to deploying UserFlowX to production.

## Production Architecture

```
┌─────────────────┐
│   Vercel        │
│  (Frontend)     │
│  Next.js App    │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼─────────────┐
│   User's Browser     │
└────────┬─────────────┘
         │
         │ HTTPS
         │
┌────────▼─────────────────┐
│   Render/Railway        │
│   (Backend)             │
│   Express API           │
└────────┬─────────────────┘
         │
         │
┌────────▼─────────────────┐
│   MongoDB Atlas         │
│   (Database)            │
└─────────────────────────┘
```

## Prerequisites

- Backend and frontend running locally
- GitHub account with code pushed
- MongoDB Atlas account
- Email service configured

## Step 1: Prepare for Production

### Backend Preparation

1. Create `.env.production` with production values:
```bash
cd userflowx-backend
cp .env.example .env.production
```

2. Edit `.env.production`:
```env
MONGODB_URI=mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/userflowx
JWT_SECRET=<64_character_random_string>
JWT_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@yourdomain.com
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=5000
NODE_ENV=production
```

3. Test production build locally:
```bash
npm run build 2>&1 || echo "Check for build errors"
```

### Frontend Preparation

1. Create `.env.production` with production values:
```bash
cd userflowx-frontend
cp .env.example .env.production
```

2. Edit `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

3. Test production build:
```bash
npm run build
npm start
```

### Git Preparation

1. Push code to GitHub:
```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

## Step 2: Deploy Backend (Render)

### Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize GitHub access

### Deploy Node.js Service

1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Configure:
   - **Name**: `userflowx-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Select closest to users

4. Add Environment Variables:
   - Click "Advanced" → "Add Environment Variable"
   - Add each variable from `.env.production`:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `SMTP_HOST`
     - `SMTP_PORT`
     - `SMTP_USER`
     - `SMTP_PASS`
     - `SMTP_FROM`
     - `FRONTEND_URL` (to be updated)
     - `NODE_ENV=production`

5. Click "Create Web Service"

6. Wait for deployment (2-3 minutes)

7. Copy the backend URL (e.g., `https://userflowx-backend.onrender.com`)

### Update CORS

The backend is now live! You'll update the frontend's `NEXT_PUBLIC_API_URL` to point here.

## Step 3: Deploy Frontend (Vercel)

### Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize GitHub access

### Deploy Next.js App

1. Click "Add New..." → "Project"
2. Select your frontend repository
3. Configure:
   - **Project Name**: `userflowx-frontend`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL=<your_render_backend_url>`
   
   Example: `https://userflowx-backend.onrender.com`

5. Click "Deploy"

6. Wait for deployment (1-2 minutes)

7. Copy the frontend URL (e.g., `https://userflowx-frontend.vercel.app`)

### Update Backend CORS

1. Go back to Render dashboard
2. Select your backend service
3. Go to "Environment" → Edit the `FRONTEND_URL` variable
4. Set it to your Vercel frontend URL
5. Click "Save" and wait for redeploy

## Step 4: Update MongoDB Atlas

### Create Production Database

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (M0 Free or paid):
   - **Cloud Provider**: AWS
   - **Region**: Choose closest to users
   - **Cluster Tier**: M0 (free) or higher

3. Create database user:
   - **Username**: `prod_user`
   - **Password**: Generate strong password
   - Save the connection string

4. Whitelist IP:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (allow all) or specific IPs
   - Click "Confirm"

5. Test connection:
```bash
# Test with MongoDB CLI or compass
mongosh "mongodb+srv://prod_user:password@cluster.mongodb.net/userflowx"
```

## Step 5: Email Service Setup

### Gmail (Recommended for testing)

1. Enable 2-factor authentication on Gmail account
2. Create an app password:
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Click "App passwords" (appears after 2FA)
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
   - Add to Render environment variables

### SendGrid (Recommended for production)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Update backend `.env` with SendGrid credentials:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your_sendgrid_api_key>
SMTP_FROM=noreply@yourdomain.com
```

## Step 6: Verify Deployment

### Test Backend Health

```bash
curl https://userflowx-backend.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Test Frontend

1. Open `https://userflowx-frontend.vercel.app`
2. Should load without errors
3. Check browser console for API errors

### Test Registration Flow

1. Register new account
2. Check email for verification link
3. Click link to verify
4. Login
5. View dashboard

## Step 7: Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain (e.g., `userflowx.com`)
4. Follow DNS configuration instructions
5. DNS should point to Vercel

### Render Custom Domain

1. Go to Render service settings
2. Click "Custom Domain"
3. Enter domain (e.g., `api.userflowx.com`)
4. Follow DNS instructions

## Step 8: SSL/HTTPS

Both Vercel and Render automatically provide SSL certificates via Let's Encrypt.

- Vercel: Automatic for all deployments
- Render: Automatic for all deployments

No additional configuration needed!

## Monitoring & Logging

### Backend Logging

Render provides logs in the dashboard:
1. Go to Render service
2. Click "Logs"
3. View real-time logs

### Frontend Errors

Vercel provides analytics:
1. Go to Vercel project
2. Click "Analytics"
3. View performance metrics

### Database Monitoring

MongoDB Atlas monitoring:
1. Go to cluster
2. Click "Monitoring"
3. View performance metrics

## Performance Optimization

### Backend

1. Enable compression:
```javascript
const compression = require('compression');
app.use(compression());
```

2. Add caching headers:
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

3. Database indexing:
```javascript
// Add to User model
userSchema.index({ email: 1 });
```

### Frontend

Already optimized with:
- Next.js automatic code splitting
- Image optimization
- CSS minimization
- Vercel's edge caching

## Scaling Considerations

### As traffic grows:

1. **Backend**: Upgrade Render plan (Performance tier)
2. **Database**: Upgrade MongoDB tier
3. **Frontend**: Vercel automatically scales

### Rate Limiting

Add rate limiting to backend:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
```

## Maintenance

### Regular Tasks

1. **Weekly**: Check logs for errors
2. **Monthly**: Review database usage
3. **Quarterly**: Update dependencies

```bash
# Check for security updates
npm audit

# Update packages
npm update

# View outdated packages
npm outdated
```

### Backup Database

MongoDB Atlas automatically backs up your data:
- Retention: 3-90 days depending on plan
- Restore: Click "Backup" in Atlas dashboard

Manual backup:
```bash
mongodump --uri "mongodb+srv://user:pass@cluster/db"
```

## Troubleshooting

### Backend not connecting to DB

```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Ensure production credentials are correct
```

### Email not sending

```bash
# Check SMTP credentials
# Verify sender email in SMTP_FROM
# Check email spam folder
# Review Render logs for errors
```

### CORS errors

```bash
# Verify FRONTEND_URL in backend .env
# Ensure CORS is configured:
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

### Vercel builds failing

```bash
# Check build logs in Vercel dashboard
# Verify .env.local variables
# Run build locally: npm run build
```

## Security Checklist

- ✅ Use strong JWT_SECRET (64+ characters)
- ✅ Enable 2FA on email and MongoDB accounts
- ✅ Use strong MongoDB passwords
- ✅ Whitelist specific IPs (not 0.0.0.0/0) in production
- ✅ Use environment variables (not hardcoded secrets)
- ✅ Enable HTTPS (automatic on Vercel/Render)
- ✅ Configure CORS correctly
- ✅ Keep dependencies updated
- ✅ Monitor logs regularly
- ✅ Use production-grade email service

## Rollback Procedure

### If deployment breaks:

**Vercel**:
1. Go to "Deployments" tab
2. Find last working deployment
3. Click "Redeploy"

**Render**:
1. Go to "Deploys" tab
2. Find last working deployment
3. Click "Redeploy"

## DNS Configuration Example

If using custom domain with Route53/Namecheap:

```
CNAME  userflowx.com           → cname.vercel-dns.com
CNAME  api.userflowx.com       → cname.onrender.com
MX     userflowx.com  priority 10  → your-mail-server
```

## CI/CD Pipeline (Optional)

Set up automated tests and deployment:

```bash
# Create GitHub Actions workflow
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy on Push

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Deploy
        if: success()
        run: npm run deploy
```

## Cost Estimation (Monthly)

- **Vercel**: Free for hobby projects, $20+/mo for pro
- **Render**: $7/mo (web service), $57/mo (PostgreSQL)
- **MongoDB Atlas**: Free M0 cluster (limited), $57+/mo for shared
- **SendGrid**: $25/mo for 20k emails

**Total**: ~$90-150/month for small-medium project

## Support Resources

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Render Docs: [render.com/docs](https://render.com/docs)
- MongoDB Atlas: [docs.mongodb.com](https://docs.mongodb.com)
- Express Security: [expressjs.com/security](https://expressjs.com/security)

---

🚀 **Your app is now live in production!**

Monitor logs regularly and keep dependencies updated for best performance and security.
