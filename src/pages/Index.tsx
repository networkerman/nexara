import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { userProfileService } from '@/services/userProfileService';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Index: loading:', loading, 'user:', user);
    
    // Don't redirect while authentication is loading
    if (loading) {
      console.log('Index: Still loading authentication...');
      return;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
      console.log('Index: No user, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('Index: User authenticated, checking onboarding data');
    // User is authenticated, check if they have completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const hasCompletedOnboarding = await userProfileService.hasCompletedOnboarding(user.id);
        
        if (!hasCompletedOnboarding) {
          console.log('Index: No onboarding data, redirecting to onboarding');
          navigate('/onboarding');
        } else {
          console.log('Index: Onboarding complete, redirecting to campaigns');
          navigate('/engage/campaigns');
        }
      } catch (error) {
        console.error('Index: Error checking onboarding status:', error);
        // On error, redirect to onboarding to be safe
        navigate('/onboarding');
      }
    };

    checkOnboardingStatus();
  }, [navigate, user, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Nexara</h1>
        <p className="text-xl text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
