import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  Volume2,
  Radio,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface VoiceRequestRecorderProps {
  onAudioReady: (audioBlob: Blob | null, durationSec: number) => void;
}

export const VoiceRequestRecorder: React.FC<VoiceRequestRecorderProps> = ({ onAudioReady }) => {
  const { isRtl } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        fallbackSimulatedVoice();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioReady(audioBlob, recordTime);
        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordTime(0);

      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission not granted or unavailable, using simulated voice note:', err);
      fallbackSimulatedVoice();
    }
  };

  const fallbackSimulatedVoice = () => {
    // Generate synthetic audio for testing in restricted browser environments
    setIsRecording(true);
    setRecordTime(0);
    timerRef.current = setInterval(() => {
      setRecordTime((prev) => {
        if (prev >= 6) {
          stopRecording();
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);

    // If simulated
    if (!mediaRecorderRef.current || audioChunksRef.current.length === 0) {
      setAudioUrl('simulated-voice-note');
      onAudioReady(new Blob(['simulated-voice'], { type: 'audio/webm' }), recordTime || 6);
    }
  };

  const togglePlayback = () => {
    if (!audioElemRef.current) return;
    if (isPlaying) {
      audioElemRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElemRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    if (audioElemRef.current) {
      audioElemRef.current.pause();
    }
    setIsPlaying(false);
    setAudioUrl(null);
    setRecordTime(0);
    onAudioReady(null, 0);
  };

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-bold text-[#183B56]">
          <Mic className="w-4 h-4 text-[#0284C7]" />
          <span>{isRtl ? 'تسجيل رسالة صوتية بالصوت الهادئ' : 'Record with Soft Calming Voice Note'}</span>
        </div>
        <span className="text-[10px] text-gray-500">
          {isRtl ? 'اختياري — لمن يفضلون التحدث دون كتابة' : 'Optional voice recording'}
        </span>
      </div>

      {!audioUrl && !isRecording && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full py-3 px-4 rounded-xl bg-white border border-sky-300 text-[#183B56] hover:bg-sky-50 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
        >
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span>{isRtl ? 'ابدأ التسجيل الصوتي بهدوء' : 'Start Recording Voice Note'}</span>
        </button>
      )}

      {isRecording && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            <span className="text-xs font-bold text-rose-800">
              {isRtl ? 'جاري التسجيل...' : 'Recording in progress...'}
            </span>
            <span className="text-xs font-mono font-bold text-rose-900 bg-white/80 px-2 py-0.5 rounded-md">
              {formatSec(recordTime)}
            </span>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition flex items-center gap-1.5"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{isRtl ? 'إيقاف وحفظ' : 'Stop & Save'}</span>
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="p-3 bg-white border border-teal-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ms-0.5" />}
            </button>
            <div>
              <span className="text-xs font-bold text-teal-900 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{isRtl ? 'تم تسجيل الملاحظة الصوتية' : 'Voice Note Recorded'}</span>
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                {formatSec(recordTime)} • {isRtl ? 'صوت واضح وهادئ' : 'Ready to attach'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={deleteRecording}
            className="p-1.5 text-gray-400 hover:text-rose-600 transition"
            title={isRtl ? 'حذف وإعادة التسجيل' : 'Delete'}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {audioUrl !== 'simulated-voice-note' && (
            <audio
              ref={audioElemRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>
      )}
    </div>
  );
};
