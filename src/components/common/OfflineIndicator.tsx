import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, offlineQueueCount, isSyncing, syncOfflineQueue } = useData();
  const { t, isRtl } = useLanguage();

  if (isOnline && offlineQueueCount === 0) {
    return null;
  }

  return (
    <aside
      aria-label={isRtl ? "تنبيه حالة الاتصال والمزامنة" : "Connectivity and sync status"}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-auto z-50 flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-medium backdrop-blur-md transition-all duration-300 border ${
        !isOnline
          ? 'bg-amber-600/95 text-white border-amber-500 shadow-amber-900/20'
          : 'bg-[#183B56]/95 text-white border-[#0284C7]/40 shadow-blue-950/20'
      }"
    >
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>{t('offline.banner')}</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 text-teal-300" />
            <span>
              {isRtl
                ? `متصل بالشبكة — يوجد ${offlineQueueCount} طلب في الانتظار`
                : `Back online — ${offlineQueueCount} pending items`}
            </span>
          </>
        )}
      </div>

      {offlineQueueCount > 0 && isOnline && (
        <button
          onClick={syncOfflineQueue}
          disabled={isSyncing}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? (isRtl ? 'جاري المزامنة...' : 'Syncing...') : t('btn.syncNow')}</span>
        </button>
      )}
    </aside>
  );
};
