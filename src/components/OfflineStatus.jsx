import { motion, AnimatePresence } from 'framer-motion';
import { FaWifi, FaExclamationTriangle, FaSync, FaCheckCircle } from 'react-icons/fa';
import { useOffline } from '../context/OfflineContext';
import { useLanguage } from '../context/LanguageContext';

export default function OfflineStatus({ compact = false }) {
  const { isOnline, syncPending, justCameOnline, status } = useOffline();
  const { t } = useLanguage();

  const statusConfig = {
    online: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      text: 'text-emerald-700 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      icon: FaWifi,
      label: t('online'),
      pulse: false,
    },
    offline: {
      bg: 'bg-red-100 dark:bg-red-900/40',
      text: 'text-red-700 dark:text-red-400',
      dot: 'bg-red-500',
      icon: FaExclamationTriangle,
      label: t('offline'),
      pulse: true,
    },
    syncPending: {
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
      icon: FaSync,
      label: t('syncPending'),
      pulse: false,
    },
  };

  const cfg = statusConfig[status];
  const Icon = cfg.icon;

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${cfg.bg} ${cfg.text}`}>
        <motion.div
          className={`w-2 h-2 rounded-full ${cfg.dot}`}
          animate={cfg.pulse ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        <span className="text-xs font-semibold hidden sm:block">{cfg.label}</span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {(!isOnline || syncPending || justCameOnline) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-16 left-0 right-0 z-40 px-4 py-2 ${cfg.bg} border-b border-current/10`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className={`flex items-center gap-2 ${cfg.text}`}>
              {justCameOnline ? (
                <>
                  <FaCheckCircle className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{t('backOnline')}</span>
                </>
              ) : (
                <>
                  <Icon className={status === 'syncPending' ? 'animate-spin' : ''} />
                  <span className="text-sm font-semibold">{cfg.label}</span>
                  <span className="text-xs opacity-75 hidden sm:inline">{t('offlineMessage')}</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
