import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to campaigns page by default
    navigate('/engage/campaigns');
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Customer Engagement Platform</h1>
        <p className="text-xl text-muted-foreground">Redirecting to Campaigns...</p>
      </div>
    </div>
  );
};

export default Index;
