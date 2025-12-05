# ChatBot AI Platform

## Overview

ChatBot AI is a SaaS platform that enables users to create custom AI chatbots by scanning their websites and training chatbots on the extracted content. The platform provides a no-code solution for embedding intelligent chatbots on any website, offering 24/7 automated customer support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript
- Built using Vite as the build tool for fast development and optimized production builds
- Uses Wouter for lightweight client-side routing
- React Query (@tanstack/react-query) for server state management and caching

**UI Component System**: shadcn/ui components built on Radix UI
- Comprehensive component library including forms, dialogs, cards, buttons, and navigation
- Tailwind CSS for styling with custom design tokens
- Framer Motion for animations and transitions
- Theme support (light/dark mode) with localStorage persistence

**Design System**:
- Typography: Inter font family for UI and body text
- Color system: HSL-based with CSS custom properties for theming
- Spacing: Tailwind's 4px-based spacing scale
- Premium SaaS aesthetic inspired by Linear, Stripe, and Vercel
- Conversion-focused landing page with clear CTAs and trust-building elements

**Form Handling**:
- React Hook Form for form state management
- Zod for schema validation via @hookform/resolvers
- Type-safe form validation integrated with backend schemas

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- HTTP server with custom logging middleware
- RESTful API endpoints for lead capture
- Static file serving for production builds
- Development mode with Vite middleware integration

**Data Layer**:
- In-memory storage implementation (MemStorage class)
- Abstracted storage interface (IStorage) for easy database integration
- Currently stores users and leads in Map data structures

**API Structure**:
- `POST /api/leads` - Create new lead with validation
- `GET /api/leads` - Retrieve all leads
- Form validation using Zod schemas shared between client and server

### Data Storage Solutions

**Current Implementation**: In-memory storage using Map objects
- User storage with username uniqueness constraints
- Lead storage with support for email, name, company, and type fields

**Database Ready**: Drizzle ORM configuration present
- Configured for PostgreSQL via drizzle.config.ts
- Schema definitions in shared/schema.ts using Drizzle's pgTable
- Migration support configured but not yet connected to live database
- The application is structured to easily swap MemStorage for a database-backed implementation

**Schema Design**:
- Users table: id (UUID), username (unique), password
- Leads table: id (UUID), email, name, company, type
- Uses Drizzle-Zod for automatic schema validation generation

### Authentication and Authorization

**Current State**: Infrastructure prepared but not implemented
- User schema exists with username/password fields
- No active authentication middleware or session management
- Storage layer supports user creation and retrieval by username/id

**Dependencies Present**:
- express-session, passport, passport-local in package.json
- connect-pg-simple for PostgreSQL session storage
- Infrastructure ready for session-based authentication implementation

### Build and Deployment

**Development**:
- Vite dev server with HMR
- Express server running on Node.js
- TypeScript compilation without emit (type checking only)
- Replit-specific plugins for development banner and error overlay

**Production Build Process**:
- Client: Vite builds React app to dist/public
- Server: esbuild bundles server code to dist/index.cjs
- Selective dependency bundling (allowlist) to reduce cold start times
- Single-file server bundle with externalized non-critical dependencies

**Scripts**:
- `dev`: Development mode with tsx and NODE_ENV=development
- `build`: Runs custom build script (script/build.ts)
- `start`: Production mode running bundled server
- `db:push`: Drizzle kit schema push (ready for database integration)

## External Dependencies

### UI and Component Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible components (@radix-ui/react-*)
- **shadcn/ui**: Pre-built component patterns using Radix UI and Tailwind
- **Framer Motion**: Animation library for page transitions and component animations
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel/slider functionality

### Styling and Design
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx** and **tailwind-merge**: Conditional className utilities

### Data and Forms
- **React Hook Form**: Form state management
- **Zod**: Schema validation library
- **@hookform/resolvers**: Zod integration with React Hook Form
- **Drizzle ORM**: Type-safe ORM for PostgreSQL (configured, not yet active)
- **Drizzle-Zod**: Automatic Zod schema generation from Drizzle schemas

### Server and API
- **Express**: Web server framework
- **CORS**: Cross-origin resource sharing middleware
- **Express Rate Limit**: API rate limiting (dependency present)
- **Multer**: File upload handling (dependency present)

### Utilities
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **uuid**: UUID generation

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety across the stack
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundler for production server builds
- **Replit Plugins**: Development experience enhancements for Replit environment

### Authentication and Sessions (Ready for Implementation)
- **Passport**: Authentication middleware
- **passport-local**: Local username/password strategy
- **express-session**: Session middleware
- **connect-pg-simple**: PostgreSQL session store
- **jsonwebtoken**: JWT token generation (dependency present)

### Fonts
- **Google Fonts**: Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter (loaded via HTML)