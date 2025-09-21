import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Smartphone, Zap, Package } from 'lucide-react';

const ShippingPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
          <p className="text-lg text-gray-600">
            As our platform provides digital services, no physical goods are shipped.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Template Access</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Upon subscription or activation, you will receive access to digital tools immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Smartphone className="h-6 w-6 text-green-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">Campaign Delivery</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Campaigns are delivered via integrated platforms (e.g. WhatsApp) and are not subject to shipping logistics.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl font-semibold text-blue-800">Digital Service Delivery</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                If you have questions about service delivery timelines, contact us:
              </p>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-medium">networker.udayan@gmail.com</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ShippingPage;
