#!/bin/bash

echo "🚀 Nexara Database Setup Script"
echo "================================"
echo ""
echo "This script will help you set up the user_profiles table in Supabase."
echo ""
echo "📋 Steps to follow:"
echo "1. Open your browser and go to: https://htqhqkmwpqrgvqbrhzwd.supabase.co"
echo "2. Click on 'SQL Editor' in the left sidebar"
echo "3. Click 'New Query'"
echo "4. Copy and paste the SQL script below"
echo "5. Click 'Run' to execute"
echo ""
echo "📄 SQL Script to copy:"
echo "======================"
echo ""

cat << 'EOF'
-- Complete User Profiles Setup for Nexara
-- This script creates the user_profiles table with all necessary components

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the handle_updated_at function first (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_domain TEXT NOT NULL,
    number_of_employees TEXT NOT NULL,
    organization_size TEXT NOT NULL,
    user_role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_name ON public.user_profiles(company_name);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;

-- Create RLS policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON public.user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Drop existing trigger if it exists (to avoid conflicts)
DROP TRIGGER IF EXISTS handle_user_profiles_updated_at ON public.user_profiles;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

-- Success message
SELECT 'User profiles table created successfully!' as message;
EOF

echo ""
echo "======================"
echo ""
echo "✅ After running the SQL script:"
echo "1. You should see 'User profiles table created successfully!' message"
echo "2. The onboarding error will be fixed"
echo "3. Users can complete onboarding successfully"
echo ""
echo "🔗 Direct link to Supabase SQL Editor:"
echo "https://htqhqkmwpqrgvqbrhzwd.supabase.co/project/default/sql"
echo ""
echo "Press any key to open the Supabase dashboard..."
read -n 1

# Try to open the browser (works on macOS)
if command -v open &> /dev/null; then
    open "https://htqhqkmwpqrgvqbrhzwd.supabase.co/project/default/sql"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://htqhqkmwpqrgvqbrhzwd.supabase.co/project/default/sql"
else
    echo "Please manually open: https://htqhqkmwpqrgvqbrhzwd.supabase.co/project/default/sql"
fi
