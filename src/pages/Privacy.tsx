import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Eye, Trash2, Lock } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            We value your privacy. Here's how we handle your data:
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Eye className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Information Collected</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We collect your name, email, company details, and usage metrics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-green-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Data Usage</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Data is used to personalize your experience, improve our services, and provide support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Third-Party Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We use Supabase for authentication and data storage. Your data is stored securely.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Trash2 className="h-6 w-6 text-red-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Opt-Out</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                You may request deletion of your data at any time by contacting us.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Lock className="h-6 w-6 text-green-600" />
                <CardTitle className="text-xl font-semibold text-green-800">Data Protection Commitment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 font-medium">
                Your data is never sold. We comply with applicable data protection laws.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default PrivacyPage;
