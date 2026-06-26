
# 🌾 Krishi Bajar — Nepali Farmers Marketplace
---
## 📖 Project Overview

**Krishi Bajar** (कृषि बजार — "Agricultural Market" in Nepali) is a full-stack web application that bridges the gap between Nepali farmers and their buyers. Farmers can list fresh produce, respond to bulk purchase tenders, join supply networks, participate in gamified farming missions, earn token rewards, and get smart farming tips — all in one place.

---

## ✨ Features

### 🛒 Marketplace
- Browse and search fresh farm produce listings
- Product detail pages with images (Cloudinary), price, unit, farming method, and certifications
- Quantity selection and purchase flow with delivery address capture

### 🔐 Authentication
- Google Sign-In via Firebase Authentication
- Account setup onboarding flow for new users
- Role separation: Farmer vs Buyer

### 📦 Orders & Payments
- Place orders with quantity selection
- Payment options: **eSewa** (digital wallet) and **Cash on Delivery**
- Full order tracking with buyer delivery information
- Order history per user

### 📢 Tenders
- Buyers (Retail, Hospitality, Wholesale) can post bulk purchase requests
- Farmers can browse and respond to open tenders
- Tender details include quantity, budget, and deadline

### 💬 Community Chat
- Real-time group community chat (Firebase Firestore)
- Private 1-on-1 messaging between farmers and buyers
- Online status tracking

### 🌱 Community Tips
- Farmers share farming tips with the community
- Like and engage with tips
- One tip per day per user (rate-limited)

### 🎯 Missions & Gamification
- Admin-managed missions with token rewards
- XP (experience points) tracking and farmer level system
- Mission progress tracked per user

### 🏪 Rewards Store
- Exchange earned tokens for farming supplies (seeds, fertilizer, tools)
- Token balance displayed in profile

### 📡 Smart Farm Assistant
- IoT sensor data dashboard (soil moisture, temperature, pH)
- AI-powered farming tips and recommendations
- Data visualized with Recharts

### 🤝 Partner / Supply Network
- Manage farmer-buyer supply relationships
- Partner directory and connection management

### 🔔 Notifications
- Real-time alerts for orders, tenders, and messages

### 👨‍💼 Admin Panel
- Mission management (add/delete missions with token rewards)
- Accessible only to `admin@krishibajar.com`

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| **Routing** | Wouter |
| **State Management** | TanStack React Query |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Backend** | Node.js, Express, TypeScript (ESM) |
| **Database** | PostgreSQL via Drizzle ORM |
| **Real-time** | Firebase Firestore |
| **Auth** | Firebase Authentication (Google) |
| **Image Storage** | Cloudinary |
| **Build Tool** | Vite (client), esbuild (server) |

---

## 📁 Project Structure

```
krishi-bajar/
├── client/                   # Frontend React app
│   └── src/
│       ├── pages/            # All page components
│       │   ├── Home.tsx          # Main marketplace feed
│       │   ├── Post.tsx          # Create product listing
│       │   ├── ProductDetails.tsx # Product detail + purchase
│       │   ├── Chat.tsx          # Community + private chat
│       │   ├── Tenders.tsx       # Bulk purchase tenders
│       │   ├── SmartAssistant.tsx # IoT + AI tips + Missions
│       │   ├── Notifications.tsx # User alerts
│       │   ├── Profile.tsx       # User profile + rewards store
│       │   └── SetupAccount.tsx  # Onboarding flow
│       ├── components/
│       │   └── layout/
│       │       └── MobileLayout.tsx # Bottom nav shell
│       ├── hooks/
│       │   └── use-auth.tsx    # Firebase auth hook
│       └── lib/
│           ├── firebase.ts     # Firebase config + services
│           ├── cloudinary.ts   # Cloudinary helpers
│           └── mockData.ts     # Static seed data
├── server/                   # Express backend
│   ├── index.ts              # Entry point
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # Drizzle ORM storage interface
│   └── db.ts                 # PostgreSQL connection
├── shared/
│   └── schema.ts             # Drizzle schema + Zod types (shared)
├── migrations/               # Drizzle DB migrations
├── drizzle.config.ts         # Drizzle configuration
├── vite.config.ts            # Vite configuration
└── package.json
```

---

## 🚀 Running Locally — Step by Step

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) v20 or higher
- [npm](https://www.npmjs.com/) v10 or higher
- [PostgreSQL](https://www.postgresql.org/) (local instance or cloud like [Neon](https://neon.tech))
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone : https://github.com/lineo01/Farm_link
cd krishi-bajar
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Set Up Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/krishi_bajar

# Server
PORT=5000
NODE_ENV=development

# Cloudinary (for product image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Maps (optional, for location features)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

> **Note:** Firebase config is embedded directly in `client/src/lib/firebase.ts` since it uses client-side keys. For production, move these to environment variables.

---

### Step 4 — Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Google Sign-In provider
4. Enable **Firestore Database** (start in test mode for development)
5. Enable **Storage** (optional, for file uploads)
6. Add your local URL to **Authorized Domains**: `localhost`
7. Copy your Firebase config into `client/src/lib/firebase.ts`

---

### Step 5 — Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. Create an **Upload Preset** named `ReactApps` (unsigned)
3. Note your **Cloud Name** and add it to `.env`
4. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to your `.env`

---

### Step 6 — Initialize the Database

Push the Drizzle schema to your PostgreSQL database:

```bash
npm run db:push
```

---

### Step 7 — Start the Development Server

```bash
npm run dev
```

The app will be running at **http://localhost:5000**

---

### Step 8 — Access Admin Features

To access the Admin Mission Panel:
- Sign in with Google using the email: `admin@krishibajar.com`
- The Admin panel will appear inside the **Smart Assistant** tab

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `PORT` | Optional | Server port (default: 5000) |
| `NODE_ENV` | Optional | `development` or `production` |
| `CLOUDINARY_CLOUD_NAME` | ✅ Yes | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | ✅ Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ Yes | Cloudinary API secret |
| `GOOGLE_MAPS_API_KEY` | Optional | For map/location features |

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5000) |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run db:push` | Push schema changes to database |
| `npm run check` | TypeScript type checking |

---

## 🌐 Deployment

This project is optimized for deployment on **Replit**, but can be deployed on any Node.js platform:

1. Set all environment variables on your hosting platform
2. Run `npm run build` to create the production bundle
3. Run `npm start` to serve the production app
4. Ensure your Firebase project's **Authorized Domains** includes your production domain

---

## 📱 Screenshots

# 📱 Application Preview

Explore the core features of the application through the screenshots below.

---

## 🏠 Home Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/021cc3cd-d6a7-4a1c-a694-ccd5d9029cde" width="85%" alt="Home Dashboard"/>
</p>

> The main application dashboard providing quick access to AI features, marketplace, analytics, and farming tools.

---

## 👨‍🌾 Farmer Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/5dbacd59-6373-4585-8a9f-e61da6f0edf4" width="45%" alt="Farmer Dashboard"/>
  <img src="https://github.com/user-attachments/assets/8f472600-1de7-43b4-8d94-92268c902735" width="45%" alt="Farmer Details"/>
</p>

Features:
- 📊 Farm Analytics
- 🌱 Crop Monitoring
- 📈 Production Overview
- 🤖 AI Insights

---

## 🛒 Easy product upload section

<p align="center">
  <img src="https://github.com/user-attachments/assets/a5360b23-a3e1-4053-ad52-cc13ab5dbf17" width="46%" alt="Marketplace"/>
</p>

Sell agricultural products directly through the integrated marketplace.

---

## 👥 Community

<p align="center">
  <img src="https://github.com/user-attachments/assets/0d084748-99dd-48e1-8f85-b114f9ed8e17" width="95%" alt="Community"/>
</p>

Community-driven knowledge sharing where farmers exchange tips, ask questions, and collaborate.

---

## 🎯 Missions

<p align="center">
  <img src="https://github.com/user-attachments/assets/5c764c81-0dd5-4c51-83f2-e2aa3540af88" width="95%" alt="Missions"/>
</p>

Gamified daily and weekly farming missions to encourage engagement.

---

## 🏆 Rewards

<p align="center">
  <img src="https://github.com/user-attachments/assets/bdda3282-92f2-477c-b7cf-855c7837be21" width="95%" alt="Rewards"/>
</p>

Earn points, badges, and rewards by completing missions and participating in the platform.

---

## 🌡️ IoT Monitoring

<p align="center">
  <img src="https://github.com/user-attachments/assets/142d6118-cbc7-42da-8b58-951190ed97cd" width="95%" alt="IoT Dashboard"/>
</p>

Real-time monitoring of farm sensors including:

- 🌡️ Temperature
- 💧 Soil Moisture
- 💦 Humidity
- ☀️ Weather Data
- 📊 Live Sensor Analytics

---
---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`<img width="655" height="649" alt="image (6)" src="https://github.com/user-attachments/assets/30160aa7-b17e-4b71-99b8-3054c08f3361" />

3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use and modify for your own projects.

---

## 👨‍🌾 About

Built to empower Nepali farmers with direct market access, eliminating middlemen and helping farmers get fair prices for their produce. Inspired by the agricultural community of Nepal.

---

*Krishi Bajar — खेतबाट बजारसम्म (From Farm to Market)*
