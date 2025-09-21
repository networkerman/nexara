import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { userProfileService, UserProfile } from '@/services/userProfileService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const WelcomePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const profile = await userProfileService.getProfile(user.id);
        if (profile) {
          setUserProfile(profile);
        } else {
          // If no profile found, redirect to onboarding
          navigate('/onboarding');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load your profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, user]);

  const handleContinueToPricing = () => {
    navigate('/pricing');
  };

  const getFirstName = () => {
    if (!userProfile?.full_name) return 'there';
    return userProfile.full_name.split(' ')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
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
                    <span className="ml-2 text-gray-900">{userProfile.full_name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Company:</span>
                    <span className="ml-2 text-gray-900">{userProfile.company_name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Domain:</span>
                    <span className="ml-2 text-gray-900">{userProfile.company_domain}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Role:</span>
                    <span className="ml-2 text-gray-900 capitalize">{userProfile.user_role.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Company Size:</span>
                    <span className="ml-2 text-gray-900">{userProfile.number_of_employees} employees</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Organization Type:</span>
                    <span className="ml-2 text-gray-900 capitalize">{userProfile.organization_size.replace('-', ' ')}</span>
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
