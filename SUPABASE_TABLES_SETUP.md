# Supabase Tables Setup Guide

This guide will help you set up the required Supabase tables for the Nexara application.

## 🚀 Quick Setup

### 1. Run the SQL Script
1. Go to your Supabase project dashboard: https://htqhqkmwpqrgvqbrhzwd.supabase.co
2. Navigate to the **SQL Editor**
3. Copy and paste the contents of `supabase-tables-setup.sql`
4. Click **Run** to execute the script

### 2. Verify the Setup
After running the script, you should see:
- ✅ `clients` table created
- ✅ `campaigns` table created
- ✅ Row Level Security (RLS) enabled for both tables
- ✅ Proper policies for user-scoped access
- ✅ Indexes for better performance

## 📊 Database Schema

### Clients Table (`clients`)
Stores user-specific onboarding data collected after signup.

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users.id, UNIQUE)
- full_name (TEXT)
- company_name (TEXT)
- company_domain (TEXT)
- employee_count (INTEGER)
- organization_size (TEXT, ENUM: 'small', 'medium', 'large')
- user_role (TEXT)
- created_at (TIMESTAMPTZ)
```

### Campaigns Table (`campaigns`)
Stores WhatsApp campaign information created by users.

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users.id)
- name (TEXT)
- audience_size (INTEGER)
- template_count (INTEGER)
- status (TEXT, ENUM: 'draft', 'scheduled', 'sent')
- scheduled_at (TIMESTAMPTZ, NULLABLE)
- created_at (TIMESTAMPTZ)
```

## 🔒 Security Features

### Row Level Security (RLS)
- **Enabled on both tables** for maximum security
- **User-scoped policies**: Users can only access their own data
- **Automatic user_id enforcement**: All operations are scoped to the authenticated user

### Policies Created
- **SELECT**: Users can view their own data
- **INSERT**: Users can create their own records
- **UPDATE**: Users can modify their own data
- **DELETE**: Users can delete their own records

## 🛠️ API Usage

### Clients Service
```typescript
import { clientsService } from '@/services/supabaseServices';

// Create client profile
const client = await clientsService.createClient({
  user_id: userId,
  full_name: 'John Doe',
  company_name: 'Acme Corp',
  company_domain: 'acme.com',
  employee_count: 50,
  organization_size: 'medium',
  user_role: 'CEO'
});

// Get client by user ID
const client = await clientsService.getClientByUserId(userId);

// Update client
await clientsService.updateClient(userId, { company_name: 'New Corp' });

// Check if onboarding is complete
const isComplete = await clientsService.hasCompletedOnboarding(userId);
```

### Campaigns Service
```typescript
import { campaignsService } from '@/services/supabaseServices';

// Create campaign
const campaign = await campaignsService.createCampaign({
  user_id: userId,
  name: 'Welcome Campaign',
  audience_size: 1000,
  template_count: 5,
  status: 'draft'
});

// Get user campaigns
const campaigns = await campaignsService.getCampaignsByUserId(userId);

// Update campaign
await campaignsService.updateCampaign(campaignId, { status: 'scheduled' });

// Get campaign statistics
const stats = await campaignsService.getCampaignStats(userId);
```

## 🔄 Migration from Old Tables

If you have existing data in the old `user_profiles` table, you can migrate it:

```sql
-- Migrate from user_profiles to clients
INSERT INTO public.clients (
  user_id, 
  full_name, 
  company_name, 
  company_domain, 
  employee_count, 
  organization_size, 
  user_role, 
  created_at
)
SELECT 
  user_id,
  full_name,
  company_name,
  company_domain,
  CASE 
    WHEN number_of_employees = '1-10' THEN 5
    WHEN number_of_employees = '11-50' THEN 30
    WHEN number_of_employees = '51-200' THEN 125
    WHEN number_of_employees = '201-500' THEN 350
    WHEN number_of_employees = '501-1000' THEN 750
    WHEN number_of_employees = '1000+' THEN 2000
    ELSE 10
  END as employee_count,
  CASE 
    WHEN organization_size = 'startup' THEN 'small'
    WHEN organization_size = 'small-business' THEN 'small'
    WHEN organization_size = 'medium-business' THEN 'medium'
    WHEN organization_size = 'enterprise' THEN 'large'
    ELSE 'small'
  END as organization_size,
  user_role,
  created_at
FROM public.user_profiles
ON CONFLICT (user_id) DO NOTHING;
```

## ✅ Testing

After setup, test the functionality:

1. **Create a test user** through the signup flow
2. **Complete onboarding** and verify data is saved to `clients` table
3. **Create a campaign** and verify it's saved to `campaigns` table
4. **Test RLS policies** by trying to access another user's data (should fail)

## 🚨 Important Notes

- **1:1 Relationship**: Each user can have only one client profile
- **User Scoping**: All data is automatically scoped to the authenticated user
- **Type Safety**: Full TypeScript support with generated types
- **Performance**: Indexes on frequently queried columns
- **Security**: RLS policies prevent unauthorized access

The new table structure provides better organization, type safety, and security for the Nexara application!
