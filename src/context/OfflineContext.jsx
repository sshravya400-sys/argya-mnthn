import { createContext, useContext, useEffect, useState } from 'react';

const OfflineContext = createContext(null);

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncPending, setSyncPending] = useState(() => {
    return JSON.parse(localStorage.getItem('mv_syncPending') || 'false');
  });
  const [justCameOnline, setJustCameOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustCameOnline(true);
      setTimeout(() => setJustCameOnline(false), 4000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncPending(true);
      localStorage.setItem('mv_syncPending', 'true');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const markSynced = () => {
    setSyncPending(false);
    localStorage.setItem('mv_syncPending', 'false');
  };

  const status = !isOnline ? 'offline' : syncPending ? 'syncPending' : 'online';

  return (
    <OfflineContext.Provider value={{ isOnline, syncPending, setSyncPending, markSynced, justCameOnline, status }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const ctx = useContext(OfflineContext);
  if (!ctx) throw new Error('useOffline must be used within OfflineProvider');
  return ctx;
}
