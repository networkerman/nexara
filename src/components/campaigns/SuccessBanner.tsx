import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { SuccessBannerState } from '@/types/campaign';

interface SuccessBannerProps {
  bannerState: SuccessBannerState;
  onHide?: () => void;
}

export function SuccessBanner({ bannerState }: SuccessBannerProps) {
  if (!bannerState.show) return null;

  return (
    <div className="px-4 sm:px-6 pt-4">
      <Alert className="border-success bg-success/10">
        <Info className="h-4 w-4 text-success" />
        <AlertDescription className="text-success-foreground">
          <strong>Published.</strong> {bannerState.message || 'Campaign published successfully.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}
