🌾 Krishi Bajar — Nepali Farmers Marketplace
A mobile-first community marketplace connecting Nepali farmers directly with buyers, wholesalers, and retailers.

Unsupported image
 
Unsupported image
 
Unsupported image
 
Unsupported image
 
Unsupported image

📖 Project Overview
Krishi Bajar (कृषि बजार — "Agricultural Market" in Nepali) is a full-stack web application that bridges the gap between Nepali farmers and their buyers. Farmers can list fresh produce, respond to bulk purchase tenders, join supply networks, participate in gamified farming missions, earn token rewards, and get smart farming tips — all in one place.

✨ Features
🛒 Marketplace
Browse and search fresh farm produce listings
Product detail pages with images (Cloudinary), price, unit, farming method, and certifications
Quantity selection and purchase flow with delivery address capture
🔐 Authentication
Google Sign-In via Firebase Authentication
Account setup onboarding flow for new users
Role separation: Farmer vs Buyer
📦 Orders & Payments
Place orders with quantity selection
Payment options: eSewa (digital wallet) and Cash on Delivery
Full order tracking with buyer delivery information
Order history per user
📢 Tenders
Buyers (Retail, Hospitality, Wholesale) can post bulk purchase requests
Farmers can browse and respond to open tenders
Tender details include quantity, budget, and deadline
💬 Community Chat
Real-time group community chat (Firebase Firestore)
Private 1-on-1 messaging between farmers and buyers
Online status tracking
🌱 Community Tips
Farmers share farming tips with the community
Like and engage with tips
One tip per day per user (rate-limited)
🎯 Missions & Gamification
Admin-managed missions with token rewards
XP (experience points) tracking and farmer level system
Mission progress tracked per user
🏪 Rewards Store
Exchange earned tokens for farming supplies (seeds, fertilizer, tools)
Token balance displayed in profile
📡 Smart Farm Assistant
IoT sensor data dashboard (soil moisture, temperature, pH)
AI-powered farming tips and recommendations
Data visualized with Recharts
🤝 Partner / Supply Network
Manage farmer-buyer supply relationships
Partner directory and connection management
🔔 Notifications
Real-time alerts for orders, tenders, and messages
👨‍💼 Admin Panel
Mission management (add/delete missions with token rewards)
Accessible only to admin@krishibajar.com
🏗️ Tech Stack
Layer	Technology
Frontend	React 19, TypeScript, Tailwind CSS v4, shadcn/ui
Routing	Wouter
State Management	TanStack React Query
Animations	Framer Motion
Charts	Recharts
Backend	Node.js, Express, TypeScript (ESM)
Database	PostgreSQL via Drizzle ORM
Real-time	Firebase Firestore
Auth	Firebase Authentication (Google)
Image Storage	Cloudinary
Build Tool	Vite (client), esbuild (server)
📁 Project Structure
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

🚀 Running Locally — Step by Step
Prerequisites
Make sure you have these installed:

Node.js v20 or higher
npm v10 or higher
PostgreSQL (local instance or cloud like Neon)
Git
Step 1 — Clone the Repository
git clone https://github.com/YOUR_USERNAME/krishi-bajar.git
cd krishi-bajar

Step 2 — Install Dependencies
npm install

Step 3 — Set Up Environment Variables
Create a .env file in the project root:

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

Note: Firebase config is embedded directly in client/src/lib/firebase.ts since it uses client-side keys. For production, move these to environment variables.

Step 4 — Set Up Firebase
Go to Firebase Console
Create a new project (or use existing)
Enable Authentication → Google Sign-In provider
Enable Firestore Database (start in test mode for development)
Enable Storage (optional, for file uploads)
Add your local URL to Authorized Domains: localhost
Copy your Firebase config into client/src/lib/firebase.ts
Step 5 — Set Up Cloudinary
Go to Cloudinary and create a free account
Create an Upload Preset named ReactApps (unsigned)
Note your Cloud Name and add it to .env
Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to your .env
Step 6 — Initialize the Database
Push the Drizzle schema to your PostgreSQL database:

npm run db:push

Step 7 — Start the Development Server
npm run dev

The app will be running at http://localhost:5000

Step 8 — Access Admin Features
To access the Admin Mission Panel:

Sign in with Google using the email: admin@krishibajar.com
The Admin panel will appear inside the Smart Assistant tab
🔑 Environment Variables Reference
Variable	Required	Description
DATABASE_URL	✅ Yes	PostgreSQL connection string
PORT	Optional	Server port (default: 5000)
NODE_ENV	Optional	development or production
CLOUDINARY_CLOUD_NAME	✅ Yes	Cloudinary cloud identifier
CLOUDINARY_API_KEY	✅ Yes	Cloudinary API key
CLOUDINARY_API_SECRET	✅ Yes	Cloudinary API secret
GOOGLE_MAPS_API_KEY	Optional	For map/location features
📦 Available Scripts
Command	Description
npm run dev	Start development server (port 5000)
npm run build	Build for production
npm start	Run production build
npm run db:push	Push schema changes to database
npm run check	TypeScript type checking
🌐 Deployment
This project is optimized for deployment on Replit, but can be deployed on any Node.js platform:

Set all environment variables on your hosting platform
Run npm run build to create the production bundle
Run npm start to serve the production app
Ensure your Firebase project's Authorized Domains includes your production domain
📱 Screenshots
Home Feed	Product Detail	Smart Assistant
Marketplace listings with category filters	Full product view with purchase flow	IoT sensor data + missions + rewards
🤝 Contributing
Fork the repository
Create a feature branch: git checkout -b feature/your-feature
Commit your changes: git commit -m 'Add some feature'
Push to the branch: git push origin feature/your-feature
Open a Pull Request
📄 License
MIT License — feel free to use and modify for your own projects.

👨‍🌾 About
Built to empower Nepali farmers with direct market access, eliminating middlemen and helping farmers get fair prices for their produce. Inspired by the agricultural community of Nepal.

Krishi Bajar — खेतबाट बजारसम्म (From Farm to Market)
