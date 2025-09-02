import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Cloud, CloudOff, Wifi, WifiOff, Loader2 } from 'lucide-react';

interface CloudSyncBadgeProps {
  messageCount?: number;
  lastSyncAt?: number | null;
  canLinkNow?: boolean;
  linking?: boolean;
  onLinkNow?: () => void;
}

export default function CloudSyncBadge({ 
  messageCount = 0, 
  lastSyncAt, 
  canLinkNow = false, 
  linking = false, 
  onLinkNow 
}: CloudSyncBadgeProps) {
  const { user, loading } = useAuth();
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs">Checking auth...</span>
      </div>
    );
  }

  const isCloudSyncActive = user && isOnline;
  const statusColor = isCloudSyncActive 
    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : user && !isOnline
    ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-gray-600 bg-gray-50 border-gray-200';

  const StatusIcon = isCloudSyncActive 
    ? Cloud 
    : user && !isOnline 
    ? CloudOff 
    : isOnline 
    ? Wifi 
    : WifiOff;

  const statusText = isCloudSyncActive
    ? 'Cloud sync active'
    : user && !isOnline
    ? 'Offline (local only)'
    : 'Local storage only';

  const tooltip = isCloudSyncActive
    ? `Messages sync across devices. ${messageCount} messages stored.`
    : user && !isOnline
    ? 'You\'re offline. Messages saved locally and will sync when online.'
    : 'Sign in to enable cloud sync and access your chats on any device.';

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs ${statusColor}`}
        title={tooltip}
      >
        <StatusIcon className="h-3 w-3" />
        <span className="hidden sm:inline">{statusText}</span>
        {lastSyncAt && isCloudSyncActive && (
          <span className="hidden md:inline text-[10px] opacity-70">
            • Synced {new Date(lastSyncAt).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {/* Link now button */}
      {user && canLinkNow && (
        <button
          onClick={onLinkNow}
          disabled={linking}
          className="text-xs rounded-md border px-2 py-1 hover:bg-muted disabled:opacity-60 text-muted-foreground hover:text-primary"
          title="Upload local chat history to your account now"
        >
          {linking ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1 inline" />
              Linking...
            </>
          ) : (
            'Link now'
          )}
        </button>
      )}
    </div>
  );
}