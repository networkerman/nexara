import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

interface PremiumGateProps {
  feature?: string;
}

export default function PremiumGate({ feature: propFeature }: PremiumGateProps) {
  const { feature: paramFeature } = useParams<{ feature: string }>();
  const feature = propFeature || paramFeature || 'This feature';
  
  const subject = encodeURIComponent(`Premium Access Request - ${feature}`);
  const mailto = `mailto:networker.udayan@gmail.com?subject=${subject}`;

  // Add noindex meta tag for SEO
  useEffect(() => {
    const metaTag = document.createElement('meta');
    metaTag.name = 'robots';
    metaTag.content = 'noindex';
    document.head.appendChild(metaTag);

    return () => {
      document.head.removeChild(metaTag);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-3">
          {feature} is part of our Premium SaaS subscription
        </h1>
        <p className="mt-3 text-muted-foreground">
          To enable {feature}, please contact:{' '}
          <a 
            className="underline text-primary hover:text-primary/80" 
            href={mailto}
          >
            networker.udayan@gmail.com
          </a>
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <a 
            href={mailto} 
            className="rounded-2xl bg-primary px-5 py-2 text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
          <Link 
            to="/engage/campaigns" 
            className="rounded-2xl border border-border px-4 py-2 text-foreground hover:bg-muted transition-colors"
          >
            Back to Campaigns
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          If you believe you're seeing this in error, try signing out and back in.
        </p>
      </div>
    </div>
  );
}
