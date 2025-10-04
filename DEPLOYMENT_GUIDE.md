# Vercel Deployment Guide for 12megablog

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Your project files ready
- Environment variables from your `.env` file

## Method 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate.

### Step 3: Deploy from your project directory
```bash
cd "e:/react project/12megablog"
vercel
```

### Step 4: Follow the prompts
- Set up and deploy? **Yes**
- Which scope? Choose your account
- Link to existing project? **No**
- Project name: `12megablog` (or your preferred name)
- In which directory is your code located? **./** (press Enter)
- Want to override the settings? **No**

### Step 5: Add Environment Variables
After initial deployment, add your environment variables:

```bash
vercel env add VITE_APPWRITE_URL
vercel env add VITE_APPWRITE_PROJECT_ID
vercel env add VITE_APPWRITE_DATABASE_ID
vercel env add VITE_APPWRITE_COLLECTION_ID
vercel env add VITE_APPWRITE_BUCKET_ID
vercel env add VITE_TINYMCE_API_KEY
```

For each variable, paste the value from your `.env` file when prompted, and select:
- Environment: **Production, Preview, and Development**

### Step 6: Redeploy with environment variables
```bash
vercel --prod
```

---

## Method 2: Deploy via Vercel Dashboard (Manual Upload)

### Step 1: Build your project locally
```bash
npm run build
```
This creates a `dist` folder with your production build.

### Step 2: Visit Vercel Dashboard
Go to https://vercel.com/new

### Step 3: Import Project
- Click **"Add New..."** → **"Project"**
- Choose **"Deploy without Git"**
- Or if you have Git: **"Import Git Repository"**

### Step 4: Configure Project
- **Project Name**: `12megablog`
- **Framework Preset**: Select **Vite**
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 5: Add Environment Variables
In the deployment settings, add these environment variables:

| Key | Value (from your .env) |
|-----|------------------------|
| `VITE_APPWRITE_URL` | `https://fra.cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID` | `68ba77310039c47a25c8` |
| `VITE_APPWRITE_DATABASE_ID` | `68ba7820002831e798ad` |
| `VITE_APPWRITE_COLLECTION_ID` | `articles` |
| `VITE_APPWRITE_BUCKET_ID` | `68ba7dcf0028e58d3142` |
| `VITE_TINYMCE_API_KEY` | `zwb7fsmr56bxs7td32p2b8r1be7d2lf2hhbdpluks63gq3n4` |

### Step 6: Deploy
Click **"Deploy"** button and wait for the build to complete.

---

## Method 3: Deploy via Git Integration (Best for Continuous Deployment)

### Step 1: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `12megablog`
3. Don't initialize with README (you already have files)

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/12megablog.git
git branch -M main
git push -u origin main
```

### Step 4: Import to Vercel
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository `12megablog`
4. Click **"Import"**

### Step 5: Configure Build Settings
- **Framework Preset**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 6: Add Environment Variables
Add all the environment variables as shown in Method 2.

### Step 7: Deploy
Click **"Deploy"** and wait for completion.

---

## Post-Deployment Steps

### 1. Update Appwrite Settings
After deployment, you need to update your Appwrite project settings:

1. Go to your Appwrite Console: https://cloud.appwrite.io
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your Vercel domain (e.g., `your-app.vercel.app`)
5. Update allowed origins in **Settings** → **Platforms**
   - Add: `https://your-app.vercel.app`

### 2. Test Your Deployment
Visit your deployed URL and test:
- ✅ Login/Signup functionality
- ✅ Creating posts
- ✅ Editing posts
- ✅ Deleting posts
- ✅ Image uploads
- ✅ Viewing all posts

### 3. Custom Domain (Optional)
To add a custom domain:
1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs for specific errors

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check variable names match exactly

### Appwrite Connection Issues
- Verify Appwrite URL is correct
- Check that Vercel domain is added to Appwrite allowed origins
- Ensure all Appwrite IDs are correct

### 404 Errors on Refresh
- The `vercel.json` file should handle this
- Check that rewrites are configured correctly

---

## Quick Deploy Command
For future deployments after making changes:

```bash
vercel --prod
```

Or if using Git integration, just push to your repository:
```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel will automatically deploy the changes.

---

## Important Notes

⚠️ **Security**: Never commit your `.env` file to Git. It's already in `.gitignore`.

✅ **Environment Variables**: Always set them in Vercel dashboard or CLI, not in code.

🔄 **Auto Deployments**: If using Git integration, every push to main branch triggers a deployment.

📊 **Analytics**: Vercel provides built-in analytics for your deployments.

---

## Need Help?
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Appwrite Documentation: https://appwrite.io/docs