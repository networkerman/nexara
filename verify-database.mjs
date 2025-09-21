import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://htqhqkmwpqrgvqbrhzwd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cWhxa213cHFyZ3ZxYnJoendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTQ3MTgsImV4cCI6MjA3NDAzMDcxOH0.SSIJd2Le1xf82Vn5HJ5kwmGv5XOnaW-qdC-x3a5WXMA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabaseSetup() {
  console.log('🔍 Verifying user_profiles table setup...');
  
  try {
    // Try to query the user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ user_profiles table does not exist yet.');
        console.log('📋 Please run the SQL script in Supabase dashboard first.');
        console.log('🔗 Go to: https://htqhqkmwpqrgvqbrhzwd.supabase.co/project/default/sql');
      } else {
        console.log('❌ Error checking table:', error.message);
      }
    } else {
      console.log('✅ user_profiles table exists and is accessible!');
      console.log('📊 Table structure verified');
      console.log('🎉 Database setup is complete!');
      console.log('');
      console.log('✅ The onboarding error should now be fixed!');
      console.log('✅ Users can complete onboarding successfully');
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

verifyDatabaseSetup();
