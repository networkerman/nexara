import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';
import { supabaseHelpers } from '@/lib/supabase';
import { SupabaseCampaignService } from '@/services/supabaseCampaignService';

export function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean | null;
    message: string;
    isLoading: boolean;
  }>({
    isConnected: null,
    message: 'Not tested yet',
    isLoading: false
  });

  const [campaignStats, setCampaignStats] = useState<any>(null);

  const testConnection = async () => {
    setConnectionStatus(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Test basic connection
      const result = await supabaseHelpers.testConnection();
      
      if (result.success) {
        // If connected, try to get campaign stats
        try {
          const stats = await SupabaseCampaignService.getCampaignStats();
          setCampaignStats(stats);
        } catch (err) {
          console.log('Campaign stats not available yet (table might not exist)');
        }
      }
      
      setConnectionStatus({
        isConnected: result.success,
        message: result.message,
        isLoading: false
      });
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        message: `Connection failed: ${error}`,
        isLoading: false
      });
    }
  };

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Supabase Connection Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {connectionStatus.isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
            ) : connectionStatus.isConnected === true ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : connectionStatus.isConnected === false ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : (
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
            )}
            <span className="font-medium">Database Connection</span>
          </div>
          <Badge 
            variant={
              connectionStatus.isConnected === true ? 'default' : 
              connectionStatus.isConnected === false ? 'destructive' : 
              'secondary'
            }
            className={
              connectionStatus.isConnected === true ? 'bg-green-500' : ''
            }
          >
            {connectionStatus.isLoading ? 'Testing...' :
             connectionStatus.isConnected === true ? 'Connected' :
             connectionStatus.isConnected === false ? 'Failed' :
             'Unknown'}
          </Badge>
        </div>

        {/* Connection Message */}
        <Alert className={
          connectionStatus.isConnected === true ? 'border-green-200 bg-green-50' :
          connectionStatus.isConnected === false ? 'border-red-200 bg-red-50' :
          ''
        }>
          <AlertDescription>
            {connectionStatus.message}
          </AlertDescription>
        </Alert>

        {/* Campaign Stats (if available) */}
        {campaignStats && (
          <div className="space-y-2">
            <h4 className="font-medium">Campaign Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-lg font-bold">{campaignStats.all}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-lg font-bold">{campaignStats.sent}</div>
                <div className="text-xs text-gray-600">Sent</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-lg font-bold">{campaignStats.drafts}</div>
                <div className="text-xs text-gray-600">Drafts</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-lg font-bold">{campaignStats.running}</div>
                <div className="text-xs text-gray-600">Running</div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div><strong>URL:</strong> https://dkrwwortllgdhazvtwds.supabase.co</div>
          <div><strong>Project:</strong> dkrwwortllgdhazvtwds</div>
          <div><strong>Status:</strong> {connectionStatus.isConnected ? 'Ready for use' : 'Setup required'}</div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            onClick={testConnection} 
            disabled={connectionStatus.isLoading}
            variant="outline"
          >
            {connectionStatus.isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Test Connection
          </Button>
        </div>

        {/* Setup Instructions */}
        {connectionStatus.isConnected === false && (
          <Alert>
            <AlertDescription>
              <strong>Setup Required:</strong> To use Supabase, you need to:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Create the campaigns table in your Supabase database</li>
                <li>Set up proper Row Level Security (RLS) policies</li>
                <li>Configure authentication if needed</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
