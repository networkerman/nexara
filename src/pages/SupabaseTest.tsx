import { AppLayout } from '@/components/layout/AppLayout';
import { SupabaseConnectionTest } from '@/components/SupabaseConnectionTest';

const SupabaseTest = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Supabase Integration</h1>
            <p className="text-muted-foreground mt-2">
              Test and verify your Supabase database connection for the campaign management system.
            </p>
          </div>
          
          <SupabaseConnectionTest />
          
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium">1. Database Setup</h3>
                <p className="text-muted-foreground">
                  Run the SQL script in <code className="bg-muted px-1 rounded">supabase-setup.sql</code> in your Supabase SQL Editor to create the campaigns table and set up proper security policies.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">2. Environment Variables</h3>
                <p className="text-muted-foreground">
                  Create a <code className="bg-muted px-1 rounded">.env.local</code> file with:
                </p>
                <pre className="bg-muted p-2 rounded mt-2 text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=https://dkrwwortllgdhazvtwds.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrcnd3b3J0bGxnZGhhenZ0d2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDc2NzIsImV4cCI6MjA3MzA4MzY3Mn0.GTbkli6T63Syk-L8QRv3mXAJY9PALAq1-jrP2e11VJk`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium">3. Authentication (Optional)</h3>
                <p className="text-muted-foreground">
                  If you want to use authentication, enable it in your Supabase project settings and configure the auth providers you need.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">4. Switch to Supabase Data</h3>
                <p className="text-muted-foreground">
                  Once the database is set up, you can switch the campaigns page to use Supabase data by replacing <code className="bg-muted px-1 rounded">useCampaigns</code> with <code className="bg-muted px-1 rounded">useSupabaseCampaigns</code> in the CampaignsPageNew component.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SupabaseTest;
