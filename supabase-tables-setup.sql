-- Supabase Tables Setup for Nexara
-- This script creates the clients and campaigns tables with proper RLS policies

-- ==============================================
-- 1. CLIENTS TABLE (User Metadata/Onboarding)
-- ==============================================

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_domain TEXT NOT NULL,
    employee_count INTEGER NOT NULL,
    organization_size TEXT NOT NULL CHECK (organization_size IN ('small', 'medium', 'large')),
    user_role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for clients table
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_company_name ON public.clients(company_name);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- Enable Row Level Security (RLS) for clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients table
-- Users can only see their own client data
CREATE POLICY "Users can view own client data" ON public.clients
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own client data
CREATE POLICY "Users can insert own client data" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own client data
CREATE POLICY "Users can update own client data" ON public.clients
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own client data
CREATE POLICY "Users can delete own client data" ON public.clients
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================
-- 2. CAMPAIGNS TABLE (WhatsApp Campaigns)
-- ==============================================

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    audience_size INTEGER NOT NULL DEFAULT 0,
    template_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
    scheduled_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for campaigns table
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON public.campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled_at ON public.campaigns(scheduled_at);

-- Enable Row Level Security (RLS) for campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for campaigns table
-- Users can only see their own campaigns
CREATE POLICY "Users can view own campaigns" ON public.campaigns
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own campaigns
CREATE POLICY "Users can insert own campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own campaigns
CREATE POLICY "Users can update own campaigns" ON public.campaigns
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own campaigns
CREATE POLICY "Users can delete own campaigns" ON public.campaigns
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================
-- 3. GRANT PERMISSIONS
-- ==============================================

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.clients TO authenticated;
GRANT ALL ON public.campaigns TO authenticated;

-- Grant permissions to service role (for admin operations)
GRANT ALL ON public.clients TO service_role;
GRANT ALL ON public.campaigns TO service_role;

-- ==============================================
-- 4. HELPER FUNCTIONS AND TRIGGERS
-- ==============================================

-- Create a function to automatically update the updated_at timestamp (if needed)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 5. SAMPLE DATA (Optional - for testing)
-- ==============================================

-- Insert sample client data (will only work if you have a user)
-- Note: Replace 'your-user-id-here' with an actual user ID from auth.users
/*
INSERT INTO public.clients (user_id, full_name, company_name, company_domain, employee_count, organization_size, user_role)
VALUES 
    ('your-user-id-here', 'John Doe', 'Acme Corp', 'acme.com', 50, 'medium', 'CEO')
ON CONFLICT (user_id) DO NOTHING;
*/

-- Insert sample campaign data (will only work if you have a user)
/*
INSERT INTO public.campaigns (user_id, name, audience_size, template_count, status, scheduled_at)
VALUES 
    ('your-user-id-here', 'Welcome Campaign', 1000, 5, 'draft', NULL),
    ('your-user-id-here', 'Product Launch', 5000, 10, 'scheduled', NOW() + INTERVAL '1 day'),
    ('your-user-id-here', 'Holiday Sale', 2000, 3, 'sent', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;
*/

-- ==============================================
-- 6. SUCCESS MESSAGE
-- ==============================================

SELECT 'Supabase tables created successfully! 
- clients table: User metadata and onboarding data
- campaigns table: WhatsApp campaign information
- RLS policies: Secure user-scoped access
- Indexes: Optimized for performance
- Permissions: Granted to authenticated users' as message;
