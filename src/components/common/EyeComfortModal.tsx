import React from 'react';
import { Eye, Sun, Moon, Sparkles, Volume2, VolumeX, ShieldAlert, X, Type, Wind, CloudRain, Check } from 'lucide-react';
import { useEyeComfort } from '../../context/EyeComfortContext';
import { useLanguage } from '../../context/LanguageContext';
import { EyeMode, TextScale } from '../../types';

export const EyeComfortModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const {
    settings,
    setMode,
    setTextScale,
    toggleReducedMotion,
    toggleReadingFocus,
    toggleBreakReminder20,
    setAmbientSound,
    setAmbientVolume,
  } = useEyeComfort();
  const { t, isRtl } = useLanguage();

  if (!isOpen) return null;

  const modeOptions: { id: EyeMode; labelAr: string; labelEn: string; icon: any; color: string }[] = [
    { id: 'soft-sky', labelAr: 'السماء الهادئة', labelEn: 'Soft Sky', icon: Sparkles, color: 'bg-sky-100 text-sky-700' },
    { id: 'warm', labelAr: 'القراءة الدافئة', labelEn: 'Warm Amber', icon: Sun, color: 'bg-amber-100 text-amber-800' },
    { id: 'dim', labelAr: 'الواجهة الخافتة', labelEn: 'Dim Night', icon: Moon, color: 'bg-slate-800 text-slate-200' },
    { id: 'high-contrast', labelAr: 'فائق التباين', labelEn: 'High Contrast', icon: Eye, color: 'bg-black text-white' },
    { id: 'default', labelAr: 'الوضع الافتراضي', labelEn: 'Default', icon: Sparkles, color: 'bg-gray-100 text-gray-700' },
  ];

  const textScales: { id: TextScale; labelAr: string; labelEn: string; sizeClass: string }[] = [
    { id: 'normal', labelAr: '100% عادي', labelEn: '100% Normal', sizeClass: 'text-xs' },
    { id: 'large', labelAr: '115% مريح', labelEn: '115% Large', sizeClass: 'text-sm' },
    { id: 'xlarge', labelAr: '130% مكبّر', labelEn: '130% XL', sizeClass: 'text-base font-semibold' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-sky-100 text-[#183B56] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D9F1FC] text-[#0284C7] rounded-2xl">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#183B56]">{t('eye.title')}</h2>
              <p className="text-xs text-gray-500">{t('eye.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Theme Mode Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-2.5">
            {isRtl ? 'نمط الألوان المريح للعين' : 'Eye-Comfort Color Palette'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {modeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = settings.mode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition-all text-start ${
                    isSelected
                      ? 'border-[#0284C7] bg-[#F0F9FF] ring-2 ring-[#0284C7]/20 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl ${opt.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1 truncate">{isRtl ? opt.labelAr : opt.labelEn}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0284C7]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Text Scaling */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{t('eye.textSize')}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {textScales.map((ts) => {
              const isSelected = settings.textScale === ts.id;
              return (
                <button
                  key={ts.id}
                  onClick={() => setTextScale(ts.id)}
                  className={`p-2.5 rounded-2xl border text-center transition ${ts.sizeClass} ${
                    isSelected
                      ? 'border-[#0284C7] bg-[#F0F9FF] font-bold text-[#0284C7]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                  }`}
                >
                  {isRtl ? ts.labelAr : ts.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Toggles: 20-20-20, Reduced Motion, Reading Focus */}
        <div className="space-y-3 mb-6 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
          {/* 20-20-20 Break */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-800 block">
                {isRtl ? 'تذكير قاعدة 20-20-20' : '20-20-20 Break Reminder'}
              </span>
              <span className="text-[11px] text-gray-500">
                {isRtl ? 'تنبيه كل 20 دقيقة للنظر بعيداً 20 ثانية' : 'Prompt every 20m to look 20ft away for 20s'}
              </span>
            </div>
            <button
              onClick={toggleBreakReminder20}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.breakReminder20 ? 'bg-[#0284C7]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.breakReminder20 ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
            <div>
              <span className="text-xs font-semibold text-gray-800 block">
                {isRtl ? 'تعطيل الحركات السريعة (Reduced Motion)' : 'Disable Animations'}
              </span>
              <span className="text-[11px] text-gray-500">
                {isRtl ? 'يقلل تشتت النظر والدوخة البصرية' : 'Reduces visual dizziness & rapid movement'}
              </span>
            </div>
            <button
              onClick={toggleReducedMotion}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.reducedMotion ? 'bg-[#0284C7]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.reducedMotion ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reading Focus */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
            <div>
              <span className="text-xs font-semibold text-gray-800 block">
                {isRtl ? 'تركيز القراءة بدون مشتتات' : 'Reading Focus Mode'}
              </span>
              <span className="text-[11px] text-gray-500">
                {isRtl ? 'توسيط النصوص وتبسيط الهوامش' : 'Centers content & expands line height'}
              </span>
            </div>
            <button
              onClick={toggleReadingFocus}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.readingFocus ? 'bg-[#0284C7]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.readingFocus ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4. Synthesized Calming Ambient Sounds (0 Bandwidth) */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{isRtl ? 'أصوات طبيعية مهدئة (توليد برمجي 0 كيلوبايت)' : 'Synthesized Calming Audio (0 KB Data)'}</span>
          </label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { id: 'off', labelAr: 'مغلق', labelEn: 'Off', icon: VolumeX },
              { id: 'rain', labelAr: 'مطر خفيف', labelEn: 'Rain', icon: CloudRain },
              { id: 'breeze', labelAr: 'نسيم هادئ', labelEn: 'Breeze', icon: Wind },
              { id: 'night', labelAr: 'سكينة الليل', labelEn: 'Night', icon: Moon },
            ].map((snd) => {
              const Icon = snd.icon;
              const isSelected = settings.ambientSound === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => setAmbientSound(snd.id as any)}
                  className={`p-2 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7] font-bold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{isRtl ? snd.labelAr : snd.labelEn}</span>
                </button>
              );
            })}
          </div>

          {settings.ambientSound !== 'off' && (
            <div className="flex items-center gap-3 px-2">
              <span className="text-[11px] text-gray-500">{isRtl ? 'مستوى الصوت:' : 'Volume:'}</span>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={settings.ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-full accent-[#0284C7] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 5. Health & Medical Disclaimer */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 text-amber-950 text-[11px] leading-relaxed flex items-start gap-2.5 mb-5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>{t('eye.medicalDisclaimer')}</p>
        </div>

        {/* Footer Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#183B56] hover:bg-[#183B56]/90 text-white font-semibold text-xs transition"
        >
          {isRtl ? 'حفظ وإغلاق الإعدادات' : 'Save & Close Settings'}
        </button>
      </div>
    </div>
  );
};
