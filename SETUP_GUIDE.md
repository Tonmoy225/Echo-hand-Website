# 🚀 EcoHand — Complete Setup & GitHub Deployment Guide

This guide walks you through everything, step by step, from zero to a live
website on the internet — even if you've never deployed an app before.

---

## PART 1 — Get Your Free Database (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Click **Build a Database** → choose the **Free (M0)** tier → choose any region close to you → click **Create**.
3. **Create a database user**: set a username and password (save these somewhere safe — you'll need them).
4. **Network Access**: click **Add IP Address** → choose **Allow Access from Anywhere** (0.0.0.0/0). This is fine for development/small projects.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your actual credentials, and add `/ecohand` before the `?` so it becomes:
   ```
   mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/ecohand?retryWrites=true&w=majority
   ```
   This will be your `MONGO_URI`.

---

## PART 2 — Get Free Image Hosting (Cloudinary)

1. Go to https://cloudinary.com/users/register/free and sign up free.
2. On your Dashboard you'll immediately see:
   - **Cloud name**
   - **API Key**
   - **API Secret**
3. Copy all three — you'll paste them into your `.env` file.

---

## PART 3 — Run the Project Locally

1. Install [Node.js](https://nodejs.org/) (LTS version) if you don't have it.
2. Open a terminal in the project folder.

```bash
# Backend setup
cd server
npm install
cp .env.example .env
```

3. Open `server/.env` in a text editor and fill in:
```
MONGO_URI=<paste your MongoDB connection string here>
JWT_SECRET=<type any long random string, e.g. mySuperSecretKey12345!>
CLOUDINARY_CLOUD_NAME=<from Cloudinary dashboard>
CLOUDINARY_API_KEY=<from Cloudinary dashboard>
CLOUDINARY_API_SECRET=<from Cloudinary dashboard>
```

4. Start the backend:
```bash
npm run dev
```
You should see: `✅ MongoDB Connected` and `🚀 EcoHand server running on port 5000`

5. Open a **new terminal window**, then:
```bash
cd client
npm install
npm run dev
```

6. Open your browser at **http://localhost:5173** — your site is now running! 🎉

---

## PART 4 — Push to GitHub

### Step 1: Create a GitHub repository
1. Go to https://github.com and log in (create a free account if needed).
2. Click the **+** icon top-right → **New repository**.
3. Name it `ecohand` → keep it **Public** or **Private** (your choice) → do **NOT** check "Add a README" (we already have one) → click **Create repository**.

### Step 2: Push your code

In your project's root folder (`ecohand/`), run:

```bash
git init
git add .
git commit -m "Initial commit - EcoHand marketplace"
git branch -M main
git remote add origin https://github.com/<your-username>/ecohand.git
git push -u origin main
```

Replace `<your-username>` with your actual GitHub username.

If asked to log in, GitHub may require a **Personal Access Token** instead of a password:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → check the `repo` scope → Generate
3. Use this token as your password when pushing

Your code is now safely on GitHub! ✅

---

## PART 5 — Deploy the Backend (Free — Render.com)

1. Go to https://render.com and sign up free (you can use your GitHub account to sign in).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select your `ecohand` repository.
4. Configure:
   - **Name**: `ecohand-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Under **Environment Variables**, add all the same variables from your `.env` file:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLIENT_URL` → set this to your frontend's URL (you'll get this in Part 6, can update later)
   - `NODE_ENV` → `production`
6. Click **Create Web Service**. Wait a few minutes for it to deploy.
7. Once live, copy your backend URL, e.g. `https://ecohand-api.onrender.com`

---

## PART 6 — Deploy the Frontend (Free — Vercel)

1. Go to https://vercel.com and sign up free using your GitHub account.
2. Click **Add New** → **Project** → import your `ecohand` repository.
3. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Before deploying, you need to tell the frontend where your backend lives. Since this project
   uses Vite's dev proxy only in development, for production add a rewrite rule:

   Create a file `client/vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/api/:path*", "destination": "https://ecohand-api.onrender.com/api/:path*" }
     ]
   }
   ```
   Replace the URL with your actual Render backend URL from Part 5, then commit and push this
   file to GitHub before deploying (or redeploy after adding it).

5. Click **Deploy**. Wait a minute — you'll get a live URL like `https://ecohand.vercel.app`

6. **Important**: go back to Render → your backend's Environment Variables → update `CLIENT_URL`
   to your new Vercel URL (e.g. `https://ecohand.vercel.app`) so CORS allows requests from your
   live frontend. Render will auto-redeploy.

---

## 🎉 You're Live!

Visit your Vercel URL — your EcoHand marketplace is now live on the internet, with:
- A real MongoDB database
- Real image uploads via Cloudinary
- Secure JWT authentication
- Free hosting for both frontend and backend

---

## Updating Your Site Later

Whenever you make changes:
```bash
git add .
git commit -m "Describe your change"
git push
```
Both Render and Vercel will automatically redeploy your changes within a minute or two.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "MongoDB connection error" | Double-check your `MONGO_URI`, and that your IP is whitelisted (0.0.0.0/0) in Atlas Network Access |
| Images won't upload | Verify your 3 Cloudinary env vars are correct and have no extra spaces |
| CORS error in browser console | Make sure `CLIENT_URL` in your Render backend matches your exact Vercel URL (no trailing slash) |
| "Cannot GET /api/..." on Vercel | Make sure `client/vercel.json` rewrite rule points to your correct Render backend URL |
| Render free tier sleeps after inactivity | First request after idle may take ~30s to wake up — this is normal on the free tier |

