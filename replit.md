# Krishi Bajar - Nepali Farmers Marketplace

## Overview

Krishi Bajar is a mobile-first marketplace application connecting Nepali farmers directly with buyers. The platform enables farmers to list their produce, respond to bulk purchase tenders, manage supply networks, and access smart farming assistance. The app features real-time chat, notifications, AI-powered farming tips, and gamified missions to encourage engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style)
- **Animations**: Framer Motion for micro-interactions
- **Charts**: Recharts for data visualization (IoT sensor data)

The frontend follows a mobile-first design with a responsive layout that adapts for larger screens. The `MobileLayout` component provides the main navigation shell with bottom tabs on mobile and a horizontal nav on desktop.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **Build Tool**: Vite for client, esbuild for server bundling
- **Development**: tsx for running TypeScript directly

The server serves both the API and static files. In development, Vite middleware handles HMR and client bundling. In production, pre-built static files are served from the `dist/public` directory.

### Data Storage
- **Primary Database**: PostgreSQL via Drizzle ORM
- **Real-time Features**: Firebase Firestore for chat messages and real-time product updates
- **File Storage**: Firebase Storage (configured but implementation pending)
- **Authentication**: Firebase Auth (configured, basic setup in place)

The application uses a hybrid data approach:
- PostgreSQL (via Drizzle) handles structured data: users, products, tenders, supply networks, missions
- Firebase handles real-time collaborative features: chat, live product feeds

### Database Schema (PostgreSQL)
Key tables defined in `shared/schema.ts`:
- `users` - Farmer profiles with ratings, XP, location
- `products` - Product listings with farming methods, certifications
- `tenders` - Bulk purchase requests from buyers
- `supplyNetworks` - Farmer-buyer relationships
- `missions` - Gamification tasks
- `userMissions` - User progress on missions
- `tips` - Farming tips content

### API Structure
Routes are registered in `server/routes.ts`. The storage interface in `server/storage.ts` provides CRUD operations for all entities. API endpoints should be prefixed with `/api`.

### Key Design Patterns
- **Storage Interface**: Abstraction layer for database operations allowing easy testing and potential database swapping
- **Shared Schema**: Types and schemas shared between client and server via `@shared/*` alias
- **Component Composition**: shadcn/ui components are copied into the project for full customization
- **Path Aliases**: `@/*` for client code, `@shared/*` for shared code, `@assets/*` for static assets

## External Dependencies

### Firebase Services
- **Firestore**: Real-time database for chat and live updates
- **Authentication**: User authentication (Google Auth configured)
- **Storage**: File uploads for product images
- Configuration in `client/src/lib/firebase.ts`

### PostgreSQL Database
- Connection via `DATABASE_URL` environment variable
- Managed through Drizzle ORM with migrations in `/migrations`
- Schema push available via `npm run db:push`

### Third-Party Libraries
- **Google Fonts**: DM Sans and Merriweather for typography
- **Lucide Icons**: Icon library used throughout the UI
- **Radix UI**: Headless UI primitives underlying shadcn components
- **Vaul**: Drawer component for mobile interactions
- **embla-carousel**: Carousel functionality
- **date-fns**: Date formatting utilities
- **zod**: Schema validation for forms and API

### Development Tools
- **Replit Plugins**: Cartographer, dev banner, runtime error overlay (development only)
- **Meta Images Plugin**: Custom Vite plugin for OpenGraph images