# Sweetwater Parking — Setup Guide

## 1. Install Node.js
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install --lts
```

## 2. Install dependencies

### Frontend
```bash
# In the project root
npm install -g pnpm
pnpm install
```

### Backend
```bash
cd server
npm install
```

## 3. Set up environment variables
```bash
cp .env.example server/.env
# Edit server/.env with your real values
```

You need:
- **DATABASE_URL** — free PostgreSQL from https://neon.tech
- **JWT_SECRET** — run: `openssl rand -base64 32`
- **STRIPE_SECRET_KEY** — from https://dashboard.stripe.com/apikeys (use test keys to start)

## 4. Set up the database
```bash
cd server
npx prisma db push
```

## 5. Run the app

In two terminals:

**Terminal 1 — Frontend:**
```bash
pnpm dev
# Opens at http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
cd server
npm run dev
# Runs at http://localhost:3001
```
