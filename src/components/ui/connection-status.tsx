import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  className?: string;
  onReconnect?: () => void;
}

export function ConnectionStatus({ className, onReconnect }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setReconnectAttempts(0);
      setShowStatus(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show status if initially offline
    if (!navigator.onLine) {
      setShowStatus(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleReconnect = () => {
    setReconnectAttempts(prev => prev + 1);
    onReconnect?.();
  };

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={cn(
            "fixed top-4 right-4 z-50 bg-card border rounded-lg shadow-lg p-4 max-w-sm",
            !isOnline && "border-destructive/20 bg-destructive/5",
            className
          )}
        >
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-destructive" />
            )}
            
            <div className="flex-1">
              <h4 className="font-semibold text-sm">
                {isOnline ? 'Connection Restored' : 'Connection Lost'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isOnline 
                  ? 'Your changes will sync automatically'
                  : reconnectAttempts > 0 
                    ? `Reconnect attempt ${reconnectAttempts}`
                    : 'Unable to save changes'
                }
              </p>
            </div>

            {!isOnline && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleReconnect}
                className="h-8 px-3"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}