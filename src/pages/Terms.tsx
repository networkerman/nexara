import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, AlertTriangle, FileText } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600">
            By accessing or using our platform, you agree to the following terms:
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Account Responsibility</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-green-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Usage Limits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Free and paid tiers come with usage limits as documented on our pricing page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Termination</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account for violation of our terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Modifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                These terms may be updated periodically. Continued use implies acceptance of changes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-800 font-medium">
                Please review these terms carefully before using our services.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default TermsPage;
