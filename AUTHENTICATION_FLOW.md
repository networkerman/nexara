# Authentication-Gated Onboarding and Pricing Flow

This implementation provides a complete authentication-gated onboarding and pricing flow for the Nexara application.

## Features Implemented

### 1. Authentication System
- **Supabase Integration**: Full Supabase Auth integration for user management
- **Hardcoded Admin Credentials**: 
  - Email: `admin@admin.com`
  - Password: `admin`
- **Session Management**: Persistent sessions with automatic refresh
- **Protected Routes**: All main application routes require authentication

### 2. Authentication Pages
- **Login Page** (`/login`): 
  - Email/password authentication
  - Hardcoded admin credentials support
  - Password visibility toggle
  - Demo credentials display
- **Signup Page** (`/signup`):
  - User registration with Supabase
  - Password strength validation
  - Email verification flow
  - Real-time password requirements

### 3. Onboarding Flow
- **Multi-step Form** (`/onboarding`):
  - Step 1: Personal Information (Full Name)
  - Step 2: Company Details (Company Name, Domain)
  - Step 3: Organization Size (Employee Count, Organization Type)
  - Step 4: User Role (Position in Organization)
- **Progress Tracking**: Visual progress indicator
- **Data Persistence**: Onboarding data stored in localStorage
- **Navigation**: Previous/Next buttons with validation

### 4. Welcome Page
- **Personalized Greeting** (`/welcome`): "Hi, [First Name]"
- **Profile Summary**: Displays collected onboarding information
- **Next Steps**: Clear call-to-action to pricing page

### 5. Pricing Page
- **Three Pricing Tiers**:
  - **Free Tier**: ₹0/month
    - 3 campaigns
    - 1,000 audience max per campaign
    - 5 WhatsApp templates
  - **Pro Tier**: ₹2,000/month
    - 10 campaigns
    - 10,000 audience max per campaign
    - 100 WhatsApp templates
    - Advanced features
  - **Enterprise Tier**: Custom pricing
    - Unlimited everything
    - Custom integrations
    - Dedicated support

### 6. Route Protection
- **ProtectedRoute Component**: Wraps all authenticated routes
- **Authentication Guards**: Automatic redirect to login for unauthenticated users
- **Session Persistence**: Maintains login state across browser sessions

## User Flow

1. **Unauthenticated User** → Redirected to `/login`
2. **Login/Signup** → Redirected to `/onboarding`
3. **Onboarding Complete** → Redirected to `/welcome`
4. **Welcome Page** → Redirected to `/pricing`
5. **Pricing Selection** → Redirected to main application (`/engage/campaigns`)

## Technical Implementation

### Authentication Context
- Centralized authentication state management
- Supabase client integration
- Mock session support for admin credentials
- Automatic session refresh

### Route Structure
```
/login (public)
/signup (public)
/onboarding (protected)
/welcome (protected)
/pricing (protected)
/engage/campaigns (protected)
... (all other routes protected)
```

### Data Flow
1. User authentication → AuthContext
2. Onboarding data → localStorage
3. Route protection → ProtectedRoute component
4. Session management → Supabase Auth

## Usage

1. Start the development server: `npm run dev`
2. Navigate to the application
3. Use admin credentials (`admin@admin.com`/`admin`) or create a new account
4. Complete the onboarding flow
5. Select a pricing plan
6. Access the main application

## Security Notes

- Admin credentials are hardcoded for demo purposes only
- In production, implement proper admin user management
- All routes are protected by authentication
- Session tokens are managed securely by Supabase
- Onboarding data is stored locally (consider database storage for production)
