# Supabase Integration Setup

This guide will help you set up Supabase integration for the HDFC Netcore campaign management system.

## 🚀 Quick Start

### 1. Install Dependencies
The Supabase client is already installed. If you need to reinstall:
```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables
Create a `.env.local` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://dkrwwortllgdhazvtwds.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrcnd3b3J0bGxnZGhhenZ0d2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDc2NzIsImV4cCI6MjA3MzA4MzY3Mn0.GTbkli6T63Syk-L8QRv3mXAJY9PALAq1-jrP2e11VJk
```

### 3. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the script to create the campaigns table and security policies

### 4. Test Connection
1. Start your development server: `npm run dev`
2. Navigate to `/supabase-test` in your browser
3. Click "Test Connection" to verify everything is working

## 📁 File Structure

```
src/
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── services/
│   └── supabaseCampaignService.ts # Database operations
├── hooks/
│   └── useSupabaseCampaigns.ts   # React hook for Supabase data
├── components/
│   └── SupabaseConnectionTest.tsx # Connection test component
└── pages/
    └── SupabaseTest.tsx          # Test page
```

## 🔧 Configuration

### Supabase Client (`src/lib/supabase.ts`)
- Configured with your project URL and anon key
- Includes helper functions for authentication
- TypeScript types for the campaigns table

### Campaign Service (`src/services/supabaseCampaignService.ts`)
- CRUD operations for campaigns
- Filtering and search functionality
- Statistics and analytics queries

### React Hook (`src/hooks/useSupabaseCampaigns.ts`)
- State management for campaign data
- Loading and error states
- Real-time updates capability

## 🔄 Switching from Mock Data to Supabase

To use Supabase data instead of mock data in your campaigns page:

1. Open `src/components/campaigns/CampaignsPageNew.tsx`
2. Replace the import:
   ```typescript
   // Change this:
   import { useCampaigns } from '@/hooks/useCampaigns';
   
   // To this:
   import { useSupabaseCampaigns as useCampaigns } from '@/hooks/useSupabaseCampaigns';
   ```

## 🛡️ Security

### Row Level Security (RLS)
The setup script automatically configures RLS policies so users can only access their own campaigns.

### Authentication
- Optional: Enable authentication in Supabase dashboard
- Users will need to sign in to create/view campaigns
- Anonymous access is supported for testing

## 📊 Database Schema

### Campaigns Table
```sql
campaigns (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('DRAFT', 'SENT', 'SCHEDULED', 'SUSPENDED', 'RUNNING', 'FAILED')),
  channel TEXT CHECK (channel IN ('WhatsApp', 'Email', 'SMS', 'Push')),
  sent_on TIMESTAMPTZ,
  published INTEGER DEFAULT 0,
  sent INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  clicked INTEGER DEFAULT 0,
  bounce TEXT DEFAULT 'NA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
)
```

## 🚨 Troubleshooting

### Connection Issues
1. Verify your Supabase URL and API key
2. Check that the campaigns table exists
3. Ensure RLS policies are properly configured
4. Visit `/supabase-test` to diagnose connection issues

### Authentication Issues
1. Make sure authentication is enabled in Supabase
2. Check that users are properly signed in
3. Verify RLS policies allow the current user access

### Performance Issues
1. Indexes are automatically created for common queries
2. Consider adding pagination for large datasets
3. Use the campaign stats view for analytics

## 🔮 Future Enhancements

- Real-time subscriptions for live updates
- Advanced filtering and search
- Campaign analytics and reporting
- Bulk operations
- Export/import functionality

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your Supabase project is active
3. Test the connection using the test page
4. Review the setup script for any missing steps
