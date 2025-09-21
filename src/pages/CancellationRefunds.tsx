import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Clock } from 'lucide-react';

const CancellationRefundsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cancellation & Refunds</h1>
          <p className="text-lg text-gray-600">
            We strive to provide the best experience possible. However, if you are unsatisfied with our service, here's our refund and cancellation policy:
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Subscription Cancellations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                You may cancel your subscription at any time from your account dashboard. Your access will remain active until the end of the billing period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We do not offer partial refunds for unused time. However, if you believe you were charged in error, please contact us within 7 days of the charge.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-800">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                For any billing concerns, reach out to us:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">networker.udayan@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">9823329163</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CancellationRefundsPage;
