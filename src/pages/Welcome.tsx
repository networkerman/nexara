import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingData {
  fullName: string;
  companyName: string;
  companyDomain: string;
  numberOfEmployees: string;
  organizationSize: string;
  userRole: string;
}

const WelcomePage: React.FC = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve onboarding data from localStorage
    const savedData = localStorage.getItem('onboardingData');
    if (savedData) {
      setOnboardingData(JSON.parse(savedData));
    } else {
      // If no onboarding data, redirect to onboarding
      navigate('/onboarding');
    }
  }, [navigate]);

  const handleContinueToPricing = () => {
    navigate('/pricing');
  };

  const getFirstName = () => {
    if (!onboardingData?.fullName) return 'there';
    return onboardingData.fullName.split(' ')[0];
  };

  if (!onboardingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <img 
            src="/Nexara_logo.png" 
            alt="Nexara" 
            className="mx-auto h-12 w-auto"
          />
        </div>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-800">
              Welcome to Nexara, {getFirstName()}!
            </CardTitle>
            <CardDescription className="text-green-700">
              Your onboarding is complete. Let's get you started with the perfect plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-3">Your Profile Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <span className="ml-2 text-gray-900">{onboardingData.fullName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Company:</span>
                    <span className="ml-2 text-gray-900">{onboardingData.companyName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Domain:</span>
                    <span className="ml-2 text-gray-900">{onboardingData.companyDomain}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Role:</span>
                    <span className="ml-2 text-gray-900 capitalize">{onboardingData.userRole.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Company Size:</span>
                    <span className="ml-2 text-gray-900">{onboardingData.numberOfEmployees} employees</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Organization Type:</span>
                    <span className="ml-2 text-gray-900 capitalize">{onboardingData.organizationSize.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">What's Next?</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Choose a pricing plan that fits your needs and start building amazing campaigns with Nexara.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleContinueToPricing}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Pricing Plans
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomePage;
