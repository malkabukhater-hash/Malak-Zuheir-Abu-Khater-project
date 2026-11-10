import React, { useState, useEffect } from 'react';
import { Eye, Clock, Check, X, Sparkles } from 'lucide-react';
import { useEyeComfort } from '../../context/EyeComfortContext';
import { useLanguage } from '../../context/LanguageContext';

export const TwentyTwentyModal: React.FC = () => {
  const { showBreakModal, dismissBreakModal } = useEyeComfort();
  const { isRtl } = useLanguage();
  const [countdown, setCountdown] = useState(20);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!showBreakModal) {
      setCountdown(20);
      setIsFinished(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showBreakModal]);

  if (!showBreakModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-sky-100 text-[#183B56] text-center">
        {/* Dismiss Button */}
        <button
          onClick={dismissBreakModal}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#A9DDF5] to-[#D9F1FC] text-[#0284C7] flex items-center justify-center mb-4 shadow-sm">
          <Eye className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold mb-1.5">
          {isRtl ? 'استراحة راحة العين (قاعدة 20-20-20)' : '20-20-20 Eye Comfort Break'}
        </h3>
        <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto">
          {isRtl
            ? 'انظر بعيداً عن الشاشة نحو نقطة تبعد حوالي 6 أمتار (20 قدماً) لإرخاء عضلات التركيز في العين.'
            : 'Look away from the screen at an object ~20 feet (6m) away to relax ocular ciliary muscles.'}
        </p>

        {/* Circular Countdown Progress */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#E2E8F0"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#0284C7"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={301.6}
              strokeDashoffset={301.6 - (301.6 * (20 - countdown)) / 20}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            {isFinished ? (
              <Check className="w-9 h-9 text-teal-600 animate-bounce" />
            ) : (
              <>
                <span className="text-3xl font-extrabold text-[#183B56]">{countdown}</span>
                <span className="text-[10px] text-gray-400 font-medium">{isRtl ? 'ثانية' : 'sec'}</span>
              </>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="bg-[#F0F9FF] border border-[#A9DDF5]/60 rounded-2xl p-3.5 mb-6 text-xs text-[#183B56]/90 flex items-center gap-2.5 text-start">
          <Sparkles className="w-4 h-4 text-[#0284C7] shrink-0" />
          <span>
            {isFinished
              ? isRtl
                ? 'أحسنت! أغمض عينيك لثوانٍ وتنفس بعمق قبل العودة لمتابعة القراءة.'
                : 'Excellent! Blink gently and take a deep breath before resuming.'
              : isRtl
                ? 'ارمش بعينيك برفق وتنفس بهدوء أثناء توجيه بصرك للأفق البعيد.'
                : 'Blink gently and breathe naturally while looking into the distance.'}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={dismissBreakModal}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#183B56] to-[#0284C7] text-white font-semibold text-xs shadow-md hover:opacity-95 transition"
        >
          {isFinished
            ? isRtl ? 'العودة لتصفح مدار' : 'Resume Browsing MADAR'
            : isRtl ? 'تخطي الاستراحة مؤقتاً' : 'Dismiss Break'}
        </button>

        {/* Medical disclaimer note */}
        <p className="mt-4 text-[10px] text-gray-400 leading-relaxed">
          {isRtl
            ? 'تنويه: ميزة استراحة العين هي إرشاد وقائي لتقليل الإجهاد وليست علاجاً سريرياً لجفاف العين.'
            : 'Notice: This break timer is an ergonomic visual guideline, not a clinical treatment.'}
        </p>
      </div>
    </div>
  );
};
