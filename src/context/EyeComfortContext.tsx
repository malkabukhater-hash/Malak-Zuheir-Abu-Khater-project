import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { EyeMode, TextScale, EyeComfortSettings } from '../types';

interface EyeComfortContextType {
  settings: EyeComfortSettings;
  setMode: (mode: EyeMode) => void;
  setTextScale: (scale: TextScale) => void;
  toggleReducedMotion: () => void;
  toggleReadingFocus: () => void;
  toggleBreakReminder20: () => void;
  toggleBlinkReminder: () => void;
  toggleAudioNav: () => void;
  setAmbientSound: (sound: 'off' | 'rain' | 'breeze' | 'night') => void;
  setAmbientVolume: (vol: number) => void;
  speakText: (text: string, lang?: string) => void;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  currentSpeakingText: string;
  softVoiceRate: number;
  softVoicePitch: number;
  setSoftVoiceRate: (rate: number) => void;
  setSoftVoicePitch: (pitch: number) => void;
  showBreakModal: boolean;
  dismissBreakModal: () => void;
}

const defaultSettings: EyeComfortSettings = {
  mode: 'soft-sky',
  textScale: 'normal',
  reducedMotion: false,
  readingFocus: false,
  breakReminder20: true,
  blinkReminder: false,
  audioNavEnabled: true,
  ambientSound: 'off',
  ambientVolume: 0.25,
};

const EyeComfortContext = createContext<EyeComfortContextType | undefined>(undefined);

export const EyeComfortProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<EyeComfortSettings>(() => {
    try {
      const saved = localStorage.getItem('madar_eye_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState('');
  const [softVoiceRate, setSoftVoiceRate] = useState(0.90);
  const [softVoicePitch, setSoftVoicePitch] = useState(0.98);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Apply visual settings to DOM
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-eye-mode', settings.mode);
    root.setAttribute('data-text-scale', settings.textScale);

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    try {
      localStorage.setItem('madar_eye_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save eye settings to localStorage:', e);
    }
  }, [settings]);

  // 20-20-20 Rule Timer: Every 20 minutes (or shorter demo 2 min if requested, let's set 20 min interval)
  useEffect(() => {
    if (!settings.breakReminder20) return;
    const interval = setInterval(() => {
      setShowBreakModal(true);
      playGentleChime();
    }, 20 * 60 * 1000); // 20 minutes

    return () => clearInterval(interval);
  }, [settings.breakReminder20]);

  // Web Audio Synthesizer for low-bandwidth Calming Nature Ambient
  useEffect(() => {
    if (settings.ambientSound === 'off') {
      stopAmbient();
      return;
    }

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      if (audioContextRef.current) {
        stopAmbient();
        const ctx = audioContextRef.current;
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate gentle pink noise
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.08;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        if (settings.ambientSound === 'rain') {
          filter.type = 'lowpass';
          filter.frequency.value = 850;
        } else if (settings.ambientSound === 'breeze') {
          filter.type = 'bandpass';
          filter.frequency.value = 400;
          filter.Q.value = 1.2;
        } else {
          filter.type = 'lowpass';
          filter.frequency.value = 350;
        }

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(settings.ambientVolume, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start(0);
        noiseNodeRef.current = whiteNoise;
        gainNodeRef.current = gainNode;
      }
    } catch (e) {
      console.warn('Ambient Web Audio not initialized yet (requires user gesture):', e);
    }

    return () => {
      stopAmbient();
    };
  }, [settings.ambientSound, settings.ambientVolume]);

  const stopAmbient = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as AudioBufferSourceNode).stop();
        noiseNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      noiseNodeRef.current = null;
    }
  };

  const playGentleChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // Solfeggio frequency 528Hz (calming)
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {
      // AudioCtx not allowed without user gesture
    }
  };

  // Web Speech API for Text-to-Speech with gentle, soothing voice
  const speakText = (text: string, lang = 'ar') => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    if (!text.trim()) return;

    setCurrentSpeakingText(text);
    setIsPaused(false);

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLangPrefix = lang === 'en' ? 'en' : 'ar';
    utterance.lang = lang === 'en' ? 'en-US' : 'ar-SA';
    utterance.rate = softVoiceRate; // Calm, gentle, steady cadence
    utterance.pitch = softVoicePitch; // Warm, soothing tone

    // Choose the softest, most natural voice available
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(targetLangPrefix));
        const softVoice =
          matching.find(
            (v) =>
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('laila') ||
              v.name.toLowerCase().includes('maged') ||
              v.name.toLowerCase().includes('tarik') ||
              v.name.toLowerCase().includes('google') ||
              v.name.toLowerCase().includes('siri')
          ) || matching[0];

        if (softVoice) {
          utterance.voice = softVoice;
        }
      }
    } catch (e) {
      // voice selection fallback
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpeakingText('');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpeakingText('');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpeakingText('');
    }
  };

  const pauseSpeaking = () => {
    if ('speechSynthesis' in window && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeaking = () => {
    if ('speechSynthesis' in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const setMode = (mode: EyeMode) => {
    setSettings((prev) => ({ ...prev, mode }));
  };

  const setTextScale = (textScale: TextScale) => {
    setSettings((prev) => ({ ...prev, textScale }));
  };

  const toggleReducedMotion = () => {
    setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const toggleReadingFocus = () => {
    setSettings((prev) => ({ ...prev, readingFocus: !prev.readingFocus }));
  };

  const toggleBreakReminder20 = () => {
    setSettings((prev) => ({ ...prev, breakReminder20: !prev.breakReminder20 }));
  };

  const toggleBlinkReminder = () => {
    setSettings((prev) => ({ ...prev, blinkReminder: !prev.blinkReminder }));
  };

  const toggleAudioNav = () => {
    setSettings((prev) => ({ ...prev, audioNavEnabled: !prev.audioNavEnabled }));
  };

  const setAmbientSound = (ambientSound: 'off' | 'rain' | 'breeze' | 'night') => {
    setSettings((prev) => ({ ...prev, ambientSound }));
  };

  const setAmbientVolume = (vol: number) => {
    setSettings((prev) => ({ ...prev, ambientVolume: vol }));
  };

  const dismissBreakModal = () => {
    setShowBreakModal(false);
  };

  return (
    <EyeComfortContext.Provider
      value={{
        settings,
        setMode,
        setTextScale,
        toggleReducedMotion,
        toggleReadingFocus,
        toggleBreakReminder20,
        toggleBlinkReminder,
        toggleAudioNav,
        setAmbientSound,
        setAmbientVolume,
        speakText,
        stopSpeaking,
        pauseSpeaking,
        resumeSpeaking,
        isSpeaking,
        isPaused,
        currentSpeakingText,
        softVoiceRate,
        softVoicePitch,
        setSoftVoiceRate,
        setSoftVoicePitch,
        showBreakModal,
        dismissBreakModal,
      }}
    >
      {children}
    </EyeComfortContext.Provider>
  );
};

export function useEyeComfort() {
  const context = useContext(EyeComfortContext);
  if (!context) {
    throw new Error('useEyeComfort must be used within an EyeComfortProvider');
  }
  return context;
}
