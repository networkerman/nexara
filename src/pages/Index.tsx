import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingData = localStorage.getItem('onboardingData');
    
    if (!onboardingData) {
      // User hasn't completed onboarding, redirect to onboarding
      navigate('/onboarding');
    } else {
      // User has completed onboarding, redirect to campaigns
      navigate('/engage/campaigns');
    }
  }, [navigate]);

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
