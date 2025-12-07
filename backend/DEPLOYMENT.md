# Deployment Guide for Render

This guide walks you through deploying the eBookify backend to Render.

## Prerequisites

- ✅ MongoDB Atlas connection string (already configured in `.env`)
- ✅ GitHub repository: `khyatibatra0316/finalebookify`
- ✅ Render account

---

## Render Dashboard Configuration

### 1. Basic Settings

| Setting | Value |
|---------|-------|
| **Name** | `finalebookify` (or your preferred name) |
| **Language** | Node |
| **Branch** | `main` |
| **Region** | Virginia (US East) or your preferred region |
| **Root Directory** | `backend` |

### 2. Build & Start Commands

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

> [!IMPORTANT]
> Make sure to use `npm install` (not `yarn`) since this project uses npm.

### 3. Environment Variables

Add these environment variables in the Render dashboard under **Environment**:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://khyatibatra364_db_user:jf0Rf42thB9UQmbO@ebookify.vg9f1ir.mongodb.net/?appName=Ebookify` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `yourSecretKey` | Your JWT secret (consider using a stronger secret for production) |
| `NODE_ENV` | `production` | Sets the environment to production |

> [!WARNING]
> **Security Note**: Never commit your `.env` file to git. The values above should be entered directly in Render's dashboard.

---

## CORS Configuration

### Important: Update Frontend URL

Once your backend is deployed, you'll need to update the CORS configuration in [`server.js`](file:///Users/khyatibatra/ADVANCE%20CAPSTONE/capstone-ap/backend/server.js#L26) to allow your production frontend URL.

**Current configuration (local development):**
```javascript
origin: "http://localhost:5173"
```

**For production, update to:**
```javascript
origin: process.env.FRONTEND_URL || "http://localhost:5173"
```

Then add `FRONTEND_URL` as an environment variable in Render with your deployed frontend URL (e.g., `https://your-frontend.vercel.app`).

Alternatively, if deploying both frontend and backend on Render:
```javascript
origin: [
  "http://localhost:5173",           // Local development
  "https://your-frontend.onrender.com"  // Production
]
```

---

## Deployment Steps

### Step 1: Push Changes to GitHub

Make sure all your changes are committed and pushed:
```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `khyatibatra0316/finalebookify`
4. Configure settings as shown in the table above
5. Add environment variables
6. Click **"Create Web Service"**

### Step 3: Monitor Deployment

- Render will automatically build and deploy your service
- Watch the logs for any errors
- The deployment typically takes 2-5 minutes

### Step 4: Verify Deployment

Once deployed, your backend will be available at:
```
https://finalebookify.onrender.com
```

Test the API:
```bash
curl https://finalebookify.onrender.com/
```

Expected response:
```
API working
```

---

## Local Development

For local development, use the `dev` script which uses nodemon for auto-reloading:

```bash
npm run dev
```

For production-like testing locally:
```bash
npm start
```

---

## Troubleshooting

### Build Fails

**Issue**: Build command fails with module errors

**Solution**: 
- Ensure `package.json` is in the `backend` directory
- Verify Root Directory is set to `backend` in Render settings
- Check that all dependencies are listed in `package.json`

### Server Won't Start

**Issue**: Server fails to start or crashes immediately

**Solution**:
- Check Render logs for error messages
- Verify all environment variables are set correctly
- Ensure `MONGODB_URI` is accessible from Render's IP addresses (MongoDB Atlas should allow connections from anywhere by default)

### MongoDB Connection Fails

**Issue**: "MongoServerError: Authentication failed"

**Solution**:
- Verify `MONGODB_URI` is correct in Render environment variables
- Check MongoDB Atlas Network Access settings
- Ensure database user has correct permissions

### CORS Errors

**Issue**: Frontend can't connect to backend

**Solution**:
- Update CORS origin in `server.js` to include your frontend URL
- Add `FRONTEND_URL` environment variable in Render
- Redeploy the service after changes

### Port Issues

**Issue**: Server not binding to correct port

**Solution**:
- Render automatically sets the `PORT` environment variable
- Your code already uses `process.env.PORT || 4000`, which is correct
- No action needed unless you're overriding the PORT variable

---

## Free Tier Limitations

> [!NOTE]
> Render's free tier has some limitations:
> - Services spin down after 15 minutes of inactivity
> - First request after spin-down may take 30-60 seconds (cold start)
> - 750 hours/month of free usage
> 
> For production apps with consistent traffic, consider upgrading to a paid plan.

---

## Next Steps

After deploying the backend:

1. ✅ Update frontend API URL to point to your Render backend
2. ✅ Update CORS settings with production frontend URL
3. ✅ Test all API endpoints from your frontend
4. ✅ Monitor Render logs for any issues
5. ✅ Consider setting up custom domain (optional)

---

## Useful Commands

**View logs:**
```bash
# In Render dashboard, go to Logs tab
```

**Trigger manual deploy:**
```bash
# In Render dashboard, click "Manual Deploy" → "Deploy latest commit"
```

**Environment variables:**
```bash
# In Render dashboard, go to Environment tab to add/edit variables
```

---

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community Forum](https://community.render.com/)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
