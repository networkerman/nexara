import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
    const onboardingData = localStorage.getItem('onboardingData');
    
    if (!onboardingData) {
      console.log('Index: No onboarding data, redirecting to onboarding');
      // User hasn't completed onboarding, redirect to onboarding
      navigate('/onboarding');
    } else {
      console.log('Index: Onboarding complete, redirecting to campaigns');
      // User has completed onboarding, redirect to campaigns
      navigate('/engage/campaigns');
    }
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
