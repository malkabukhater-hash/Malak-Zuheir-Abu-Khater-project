import React from 'react';
import {
  Eye,
  Sun,
  Moon,
  Sparkles,
  Type,
  Volume2,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Heart,
  Sliders,
  Wind,
  CloudRain,
  VolumeX,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useEyeComfort } from '../context/EyeComfortContext';
import { EyeMode, TextScale } from '../types';

export const EyeCarePage: React.FC = () => {
  const { isRtl, t } = useLanguage();
  const {
    settings,
    setMode,
    setTextScale,
    toggleReducedMotion,
    toggleReadingFocus,
    toggleBreakReminder20,
    toggleBlinkReminder,
    setAmbientSound,
    setAmbientVolume,
    softVoiceRate,
    setSoftVoiceRate,
    softVoicePitch,
    setSoftVoicePitch,
    speakText,
    stopSpeaking,
    isSpeaking,
  } = useEyeComfort();

  const modes: { id: EyeMode; titleAr: string; titleEn: string; descAr: string; descEn: string; icon: any }[] = [
    {
      id: 'soft-sky',
      titleAr: 'السماء الهادئة (Soft Sky)',
      titleEn: 'Soft Sky',
      descAr: 'خلفية زرقاء رقيقة ومريحة مستوحاة من ألوان مدار الهادئة توازن الضوء المنبعث.',
      descEn: 'Gentle pale blue and soft neutral tones balancing screen emission.',
      icon: Sparkles,
    },
    {
      id: 'warm',
      titleAr: 'القراءة الدافئة (Warm Amber)',
      titleEn: 'Warm Amber Reading',
      descAr: 'تدرج كهرماني دافئ يحاكي ورق الكتب القديمة لتقليل إجهاد القرنية ليلاً.',
      descEn: 'Warm amber tones simulating matte paper to ease night reading fatigue.',
      icon: Sun,
    },
    {
      id: 'dim',
      titleAr: 'الواجهة الخافتة (Dim Night)',
      titleEn: 'Dim Night Mode',
      descAr: 'تقليل سطوع الشاشة بنسبة 15% إضافية للحفاظ على راحة العين في الظلام الدامس.',
      descEn: 'Subtle luminance reduction preserving dark adaptation in unlit tents.',
      icon: Moon,
    },
    {
      id: 'high-contrast',
      titleAr: 'الوضوح فائق التباين',
      titleEn: 'High Contrast Mode',
      descAr: 'خطوط سوداء واضحة على خلفية بيضاء نقية لأصحاب حساسية ضعف الإبصار.',
      descEn: 'Stark black-and-white readability for low-vision comfort.',
      icon: Eye,
    },
    {
      id: 'default',
      titleAr: 'الوضع الأصلي',
      titleEn: 'Default System',
      descAr: 'الألوان الأصلية لمنظومة مدار.',
      descEn: 'Standard balanced MADAR color scheme.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#183B56] via-[#1E4565] to-[#0284C7] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-3">
            <Eye className="w-3.5 h-3.5" />
            <span>{isRtl ? 'بيئة إبصار مريحة' : 'Visual Ergonomics'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('eye.title')}</h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl leading-relaxed">
            {t('eye.subtitle')}
          </p>
        </div>
      </div>

      {/* Mandatory Medical Safety Card */}
      <div className="rounded-3xl bg-amber-50 border-2 border-amber-200 p-6 text-amber-950 text-xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <span>{isRtl ? 'إشعار المسؤولية الصحية والسلامة الطبية' : 'Important Medical Safety Notice'}</span>
        </div>
        <div className="leading-relaxed space-y-2 text-amber-900/90 text-xs">
          <p>
            {isRtl
              ? '• ميزات «راحة العين من مدار» هي أدوات إرجونومية رقمية مصممة لتخفيف إجهاد القراءة وحساسية الوهج الناتج عن الشاشات، ولكنها ليست علاجاً طبياً لمتلازمة جفاف العين أو أي مرض عيني سريري.'
              : '• MADAR Eye Comfort features are digital ergonomic tools engineered to mitigate screen glare and reading strain. They are NOT a clinical treatment or medical cure for Dry Eye Disease.'}
          </p>
          <p>
            {isRtl
              ? '• المنظومة لا تشخّص المستخدمين ولا تراقب العين بالكاميرا ولا تدعي أن فلاتر الضوء تشفي الحالات المرضية.'
              : '• MADAR does not diagnose eye disorders, monitor blinks via camera, or claim that color shifts cure underlying conditions.'}
          </p>
          <p className="font-bold text-amber-950 pt-1">
            {isRtl
              ? '• في حال المعاناة من ألم مستمر، احمرار حاد، زغللة بصرية، أو جفاف شديد، يجب فوراً مراجعة طبيب عيون مختص.'
              : '• Persistent eye pain, redness, blurred vision, or severe discomfort strictly requires professional ophthalmic evaluation.'}
          </p>
        </div>
      </div>

      {/* 1. Theme Selection */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-[#183B56] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#0284C7]" />
          <span>{isRtl ? 'اختر نمط الألوان المريح لبصرك' : '1. Eye-Comfort Color Palette'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = settings.mode === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-[#0284C7] bg-[#F0F9FF] shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-sky-100 text-[#0284C7] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-[#183B56]">{isRtl ? m.titleAr : m.titleEn}</h3>
                    {isSelected && (
                      <span className="text-[10px] bg-[#0284C7] text-white px-2 py-0.5 rounded-full font-bold">
                        {isRtl ? 'مفعّل' : 'Active'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{isRtl ? m.descAr : m.descEn}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Typography Scaling */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-[#183B56] flex items-center gap-2">
          <Type className="w-4 h-4 text-[#0284C7]" />
          <span>{isRtl ? 'تكبير وضبط حجم الخطوط (Typography Scaling)' : '2. Typography Scaling'}</span>
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'normal', labelAr: 'طبيعي (100%)', labelEn: '100% Normal', sample: 'حجم الخط القياسي' },
            { id: 'large', labelAr: 'مريح وكبير (115%)', labelEn: '115% Large', sample: 'حجم خط مكبر مريح' },
            { id: 'xlarge', labelAr: 'كبير جداً (130%)', labelEn: '130% Extra Large', sample: 'أكبر حجم للقراءة بدون إجهاد' },
          ].map((ts) => {
            const isSelected = settings.textScale === ts.id;
            return (
              <button
                key={ts.id}
                onClick={() => setTextScale(ts.id as TextScale)}
                className={`p-4 rounded-2xl border-2 text-center transition ${
                  isSelected
                    ? 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7] font-bold'
                    : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="block text-xs font-bold mb-1">{isRtl ? ts.labelAr : ts.labelEn}</span>
                <span className="text-[11px] text-gray-400 block">{ts.sample}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Toggles: 20-20-20, Reduced Motion, Reading Focus */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-[#183B56] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0284C7]" />
          <span>{isRtl ? 'إعدادات الاستراحة والحركة' : '3. Rest & Ergonomic Controls'}</span>
        </h2>

        <div className="space-y-4 text-xs">
          {/* 20-20-20 */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <span className="font-bold text-gray-800 text-sm block">
                {isRtl ? 'تذكير قاعدة 20-20-20' : '20-20-20 Break Reminder'}
              </span>
              <span className="text-gray-500 text-xs">
                {isRtl
                  ? 'كل 20 دقيقة، يظهر لك تنبيه لطيف للنظر لمسافة 20 قدماً (6 أمتار) لمدة 20 ثانية لإراحة عضلات التكيف البصري.'
                  : 'Every 20 minutes, a gentle prompt reminds you to look 20 feet away for 20 seconds.'}
              </span>
            </div>
            <button
              onClick={toggleBreakReminder20}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                settings.breakReminder20 ? 'bg-[#0284C7]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.breakReminder20 ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <span className="font-bold text-gray-800 text-sm block">
                {isRtl ? 'تعطيل الحركات السريعة (Reduced Motion)' : 'Disable Animations'}
              </span>
              <span className="text-gray-500 text-xs">
                {isRtl
                  ? 'إلغاء جميع التأثيرات الحركية والانتقالات المفاجئة لتوفير استقرار بصري تام.'
                  : 'Disables fast transitions to eliminate motion sensitivity and visual dizziness.'}
              </span>
            </div>
            <button
              onClick={toggleReducedMotion}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                settings.reducedMotion ? 'bg-[#0284C7]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.reducedMotion ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reading Focus */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <span className="font-bold text-gray-800 text-sm block">
                {isRtl ? 'وضع تركيز القراءة بدون مشتتات' : 'Reading Focus Mode'}
              </span>
              <span className="text-gray-500 text-xs">
                {isRtl
                  ? 'توسيط النصوص وزيادة المسافات بين السطور وتخفيف العناصر الجانبية.'
                  : 'Centers content column and maximizes line height for comfortable reading.'}
              </span>
            </div>
            <button
              onClick={toggleReadingFocus}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                settings.readingFocus ? 'bg-[#0284C7]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.readingFocus ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Synthesized Calming Audio (0 KB Data) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-[#183B56] flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#0284C7]" />
          <span>{isRtl ? 'أصوات الطبيعة المهدئة (توليد داخلي بدون استهلاك إنترنت)' : '4. Synthesized Ambient Sounds'}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'off', labelAr: 'مغلق', labelEn: 'Off', icon: VolumeX },
            { id: 'rain', labelAr: 'صوت مطر خفيف على الشادر', labelEn: 'Gentle Rain', icon: CloudRain },
            { id: 'breeze', labelAr: 'نسيم ساحلي هادئ', labelEn: 'Coastal Breeze', icon: Wind },
            { id: 'night', labelAr: 'سكينة المساء', labelEn: 'Quiet Night', icon: Moon },
          ].map((snd) => {
            const Icon = snd.icon;
            const isSelected = settings.ambientSound === snd.id;
            return (
              <button
                key={snd.id}
                onClick={() => setAmbientSound(snd.id as any)}
                className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7] font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{isRtl ? snd.labelAr : snd.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Soft Voice Narration Settings */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-[#183B56] flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#0284C7]" />
              <span>{isRtl ? 'قارئ مدار الصوتي الرقيق (Soft Voice Engine)' : '5. Soft Voice Audio Narration'}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isRtl
                ? 'قارئ ناطق بنبرة هادئة ورتيبة مريحة للأعصاب لتمكينك من تصفح المحتوى والخدمات دون إرهاق العينين.'
                : 'Gentle, soothing speech synthesizer designed for effortless listening without eye strain.'}
            </p>
          </div>

          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speakText(
                  isRtl
                    ? 'مرحباً بك في منصة مَدَار. هذه تجربة للقارئ الصوتي الهادئ. تم ضبط نبرة الصوت وسرعة الإلقاء لتوفير أقصى درجات الراحة النفسية والبصرية.'
                    : 'Welcome to MADAR. This is a preview of the Soft Voice reader. Tone and pacing are calibrated for psychological comfort and zero visual fatigue.',
                  isRtl ? 'ar-SA' : 'en-US'
                );
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              isSpeaking
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-[#183B56] text-white hover:bg-[#183B56]/90'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? (isRtl ? 'إيقاف الصوت' : 'Stop Audio') : (isRtl ? 'تجربة الصوت الهادئ' : 'Test Soft Voice')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          {/* Speed slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>{isRtl ? 'سرعة التلاوة الصوتية:' : 'Reading Speed:'}</span>
              <span className="text-[#0284C7] font-bold">{softVoiceRate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.70"
              max="1.20"
              step="0.05"
              value={softVoiceRate}
              onChange={(e) => setSoftVoiceRate(parseFloat(e.target.value))}
              aria-label={isRtl ? 'سرعة التلاوة' : 'Reading speed'}
              className="w-full accent-[#0284C7] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>{isRtl ? 'هادئ وبطيء (0.7x)' : 'Slow & Calming (0.7x)'}</span>
              <span>{isRtl ? 'معتدل (0.9x)' : 'Balanced (0.9x)'}</span>
              <span>{isRtl ? 'سريع (1.2x)' : 'Brisk (1.2x)'}</span>
            </div>
          </div>

          {/* Pitch slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>{isRtl ? 'طبقة ونبرة الصوت (Pitch):' : 'Voice Pitch & Tone:'}</span>
              <span className="text-teal-700 font-bold">{softVoicePitch.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="1.15"
              step="0.03"
              value={softVoicePitch}
              onChange={(e) => setSoftVoicePitch(parseFloat(e.target.value))}
              aria-label={isRtl ? 'طبقة الصوت' : 'Voice pitch'}
              className="w-full accent-[#2DD4BF] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>{isRtl ? 'دافئ وعميق' : 'Warm & Deep'}</span>
              <span>{isRtl ? 'طبيعي ومريح' : 'Natural & Soothing'}</span>
              <span>{isRtl ? 'واضح وعالٍ' : 'Clear & High'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
