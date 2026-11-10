import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Smartphone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t, isRtl } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if running as installed standalone app
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>{isRtl ? 'التطبيق مثبت' : 'App Installed'}</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General instructions
      alert(isRtl ? 'لتثبيت مدار، اضغط على خيارات المتصفح (⋮) ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".' : 'To install MADAR, tap browser menu (⋮) and select "Install App" or "Add to Home Screen".');
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title={t('btn.installApp')}
        className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#183B56] to-[#0284C7] text-white text-xs font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all ${
          compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
        }`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t('btn.installApp')}</span>
      </button>

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-[#183B56] border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#D9F1FC] text-[#0284C7] rounded-xl">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">{isRtl ? 'تثبيت مدار على الآيفون / الآيباد' : 'Install MADAR on iOS Safari'}</h3>
                <p className="text-xs text-gray-500">{isRtl ? 'يعمل بدون إنترنت بعد التثبيت' : 'Works offline after install'}</p>
              </div>
            </div>

            <ol className="text-xs text-gray-700 space-y-2.5 list-decimal list-inside bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <li>{isRtl ? 'اضغط زر المشاركة (Share) في أسفل متصفح Safari.' : 'Tap the Share icon in the Safari toolbar.'}</li>
              <li>{isRtl ? 'مرر للأسفل واضغط على "إضافة إلى الصفحة الرئيسية" (Add to Home Screen).' : 'Scroll down and tap "Add to Home Screen".'}</li>
              <li>{isRtl ? 'اضغط "إضافة" (Add) في الزاوية العلوية.' : 'Tap "Add" in the top right corner.'}</li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#183B56] text-white py-2 text-xs font-semibold hover:bg-[#183B56]/90 transition"
            >
              {isRtl ? 'حسناً، فهمت' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
