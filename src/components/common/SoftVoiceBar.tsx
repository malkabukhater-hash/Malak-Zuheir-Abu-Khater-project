import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useEyeComfort } from '../../context/EyeComfortContext';
import { useLanguage } from '../../context/LanguageContext';

export const SoftVoiceBar: React.FC = () => {
  const {
    isSpeaking,
    isPaused,
    currentSpeakingText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    softVoiceRate,
    setSoftVoiceRate,
    softVoicePitch,
    setSoftVoicePitch,
  } = useEyeComfort();
  const { isRtl } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);

  if (!isSpeaking && !isPaused) return null;

  return (
    <div className="fixed bottom-4 start-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-3xl bg-gradient-to-r from-[#183B56] via-[#1E4565] to-[#0A2234] text-white p-3.5 sm:p-4 shadow-xl border border-sky-300/30 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          {/* Voice Wave & Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-300/40 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isRtl ? 'القارئ بالصوت الهادئ مفعّل' : 'Soft Voice Reader Active'}</span>
                </span>
                <span className="text-[10px] text-white/50">• {isRtl ? 'راحة للعين' : 'Eye Comfort'}</span>
              </div>
              <p className="text-xs text-white/90 truncate font-medium">
                {currentSpeakingText || (isRtl ? 'جاري القراءة بصوت ناعم ومريح...' : 'Reading with gentle calming voice...')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isPaused ? (
              <button
                onClick={resumeSpeaking}
                className="p-2 rounded-xl bg-[#2DD4BF] text-[#183B56] hover:bg-[#2DD4BF]/90 transition"
                title={isRtl ? 'استئناف' : 'Resume'}
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={pauseSpeaking}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                title={isRtl ? 'إيقاف مؤقت' : 'Pause'}
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            )}

            <button
              onClick={stopSpeaking}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/80 text-white transition"
              title={isRtl ? 'إيقاف تام' : 'Stop'}
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title={isRtl ? 'إعدادات النبرة والسرعة' : 'Tone Settings'}
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Tone & Speed Settings */}
        {showSettings && (
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>{isRtl ? 'سرعة الصوت (هدوء)' : 'Reading Speed'}</span>
                <span className="font-mono text-amber-300">{softVoiceRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.1"
                step="0.05"
                value={softVoiceRate}
                onChange={(e) => setSoftVoiceRate(parseFloat(e.target.value))}
                className="w-full accent-amber-300"
              />
            </div>
            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>{isRtl ? 'طبقة النبرة (دفء)' : 'Voice Pitch'}</span>
                <span className="font-mono text-amber-300">{softVoicePitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={softVoicePitch}
                onChange={(e) => setSoftVoicePitch(parseFloat(e.target.value))}
                className="w-full accent-[#2DD4BF]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
