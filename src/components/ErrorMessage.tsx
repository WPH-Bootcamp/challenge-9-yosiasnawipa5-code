// src/components/ErrorMessage.tsx
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'Failed to load data. Please check your API key or try again.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-900/30 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
