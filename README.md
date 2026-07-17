# 🌱 EcoHand — Second-Hand Electronics Marketplace

A full-stack MERN application for buying and selling second-hand electronics,
built to reduce e-waste through reuse.

**Tech Stack:** React (Vite) · Node.js · Express.js · MongoDB · Mongoose · JWT Auth · Cloudinary

---

## Features

- 🔐 Authentication — Register / Login / Logout with JWT
- 👤 Profile — edit details, upload avatar, link social accounts (Facebook, Instagram, X, LinkedIn, WhatsApp)
- 🛒 Cart — save items you're interested in buying
- 📦 My Posts — manage your own listings (edit / mark sold / delete)
- 🔖 Saved Posts — bookmark listings for later
- 🔔 Notifications — get notified on likes, comments
- 🔍 Category search & filtering
- 📰 News feed — like, comment, share, save posts
- 🖼️ Multi-image upload (Cloudinary)
- 📜 Terms of Policy, Feedback, Report a Problem
- 🎨 Purple / black professional dark theme

See `/server` and `/client` for the backend and frontend respectively.

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js v18+ installed
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account
- A free [Cloudinary](https://cloudinary.com/users/register/free) account (for image uploads)

### 2. Clone and install

```bash
git clone https://github.com/<your-username>/ecohand.git
cd ecohand

# Install backend
cd server
npm install

# Install frontend
cd ../client
npm install
```

### 3. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and fill in:
- `MONGO_URI` — from MongoDB Atlas → Connect → Drivers
- `JWT_SECRET` — any long random string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard

### 4. Run the app

In one terminal:
```bash
cd server
npm run dev
```

In a second terminal:
```bash
cd client
npm run dev
```

Visit **http://localhost:5173** — the frontend talks to the backend automatically via Vite's dev proxy.

---

## Full GitHub + Deployment Guide

See `SETUP_GUIDE.md` for complete step-by-step instructions on:
1. Setting up MongoDB Atlas (free)
2. Setting up Cloudinary (free)
3. Pushing this project to GitHub
4. Deploying backend to Render (free)
5. Deploying frontend to Vercel/Netlify (free)

