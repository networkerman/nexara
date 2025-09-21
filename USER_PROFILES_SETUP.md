# User Profiles Setup for Supabase

This guide will help you set up the user profiles table in your Supabase database to store onboarding data.

## 🚀 Quick Setup

### 1. Run the SQL Script
1. Go to your Supabase project dashboard: https://htqhqkmwpqrgvqbrhzwd.supabase.co
2. Navigate to the **SQL Editor**
3. Copy and paste the contents of `user-profiles-setup.sql`
4. Click **Run** to execute the script

### 2. Verify the Setup
After running the script, you should see:
- ✅ `user_profiles` table created
- ✅ Row Level Security (RLS) enabled
- ✅ Proper policies for user data access
- ✅ Indexes for better performance
- ✅ Automatic timestamp updates

## 📊 Database Schema

The `user_profiles` table includes:

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- full_name (TEXT)
- company_name (TEXT)
- company_domain (TEXT)
- number_of_employees (TEXT)
- organization_size (TEXT)
- user_role (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

## 🔒 Security Features

- **Row Level Security (RLS)** enabled
- **User-specific policies**: Users can only access their own profile data
- **Automatic user_id assignment**: Profiles are automatically linked to authenticated users
- **Cascade deletion**: When a user is deleted, their profile is automatically removed

## 🔄 How It Works

### Signup Flow:
1. User signs up → Supabase Auth creates user in `auth.users`
2. User completes onboarding → Profile saved to `user_profiles` table
3. User data persists across sessions

### Authentication Flow:
1. User logs in → AuthContext checks Supabase session
2. Index page checks if user has profile in `user_profiles`
3. If no profile → Redirect to onboarding
4. If profile exists → Redirect to campaigns

## 🛠️ API Usage

The `userProfileService` provides these methods:

```typescript
// Create a new profile
await userProfileService.createProfile(profileData, userId);

// Get user profile
const profile = await userProfileService.getProfile(userId);

// Update profile
await userProfileService.updateProfile(userId, updates);

// Check if onboarding is complete
const isComplete = await userProfileService.hasCompletedOnboarding(userId);
```

## ✅ Testing

After setup, test the flow:
1. Sign up with a new email
2. Complete the onboarding process
3. Check your Supabase dashboard → `user_profiles` table
4. Verify your data is stored correctly

## 🚨 Important Notes

- **Every signup now creates a real user** in Supabase Auth
- **Onboarding data is stored in the database** (not localStorage)
- **User sessions are maintained** across browser refreshes
- **Data is secure** with proper RLS policies

The authentication flow now fully integrates with Supabase for both user management and data persistence!
