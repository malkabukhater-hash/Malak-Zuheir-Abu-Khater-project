import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Shield, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SmartSearchSection: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = [
    { labelAr: 'تسرب مياه أمطار في الخيمة', labelEn: 'Rainwater leaking in tent', q: 'تسرب مياه في الخيمة وتلف الشادر' },
    { labelAr: 'صيانة إنفرتر طاقة شمسية', labelEn: 'Solar inverter repair', q: 'عطل في إنفرتر الطاقة الشمسية 1000 واط' },
    { labelAr: 'محطة مياه شرب قريبة', labelEn: 'Nearby drinking water', q: 'أين توجد محطة مياه شرب محلاة صالحة للشرب' },
    { labelAr: 'موقد طهي اقتصادي بحطب', labelEn: 'Biomass rocket stove', q: 'شراء موقد طهي اقتصادي بدون غاز' },
    { labelAr: 'مترجم تقارير طبية إنسانية', labelEn: 'Medical case translator', q: 'احتاج مترجم للتقارير الطبية الإنسانية' },
  ];

  const handleSearch = async (searchQuery = query) => {
    const q = searchQuery.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language: isRtl ? 'ar' : 'en' }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze request');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(isRtl ? 'تعذر الاتصال بالخادم، جاري التحويل للمساعد المحلي...' : 'Server unreachable, fallback active.');
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative my-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-white to-[#F0F9FF] p-6 sm:p-8 border border-sky-200/80 shadow-lg relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-48 h-48 bg-[#A9DDF5]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9F1FC] text-[#0284C7] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('ai.assistantTitle')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#183B56] mb-2">
            {isRtl ? 'ماذا تحتاج اليوم في مجتمعك؟' : 'What do you need today in your community?'}
          </h2>
          <p className="text-xs text-gray-600">
            {t('ai.assistantSubtitle')}
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative max-w-2xl mx-auto mb-4"
        >
          <div className="flex items-center rounded-2xl bg-white border-2 border-sky-300 focus-within:border-[#0284C7] shadow-sm p-1.5 transition-all">
            <div className="ps-3 text-gray-400">
              <Search className="w-5 h-5 text-[#0284C7]" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('ai.searchPlaceholder')}
              className="w-full px-3 py-2.5 text-xs sm:text-sm text-[#183B56] placeholder-gray-400 focus:outline-hidden bg-transparent"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#183B56] to-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 active:scale-95 transition disabled:opacity-50 shrink-0"
            >
              {loading ? (isRtl ? 'جاري التحليل...' : 'Analyzing...') : t('btn.search')}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="text-[11px] text-gray-500 font-medium">{isRtl ? 'اقتراحات شائعة:' : 'Common queries:'}</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p.q);
                handleSearch(p.q);
              }}
              className="text-[11px] bg-white border border-gray-200 hover:border-sky-300 hover:bg-sky-50 text-gray-700 px-2.5 py-1 rounded-xl transition"
            >
              {isRtl ? p.labelAr : p.labelEn}
            </button>
          ))}
        </div>

        {/* AI Result Card */}
        {result && (
          <div className="max-w-2xl mx-auto mt-6 rounded-2xl bg-white border border-sky-200 p-5 shadow-md animate-in fade-in slide-in-from-bottom-2">
            {/* Engine badge */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0284C7]">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>
                  {result.mode === 'gemini-live'
                    ? (isRtl ? 'تحليل ذكاء اصطناعي مباشر (Gemini 3.8 Flash)' : 'Live AI Analysis (Gemini 3.8 Flash)')
                    : (isRtl ? 'تحليل منطقي محلي دقيق (توفير كامل للبيانات)' : 'Local Gaza-Resilient Semantic Engine')}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  result.analysis.urgency === 'urgent'
                    ? 'bg-red-100 text-red-700'
                    : result.analysis.urgency === 'high'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {result.analysis.urgency}
              </span>
            </div>

            {/* Recommended Module */}
            <div className="mb-4">
              <span className="text-[11px] text-gray-500 block mb-1">{t('ai.recommendedModule')}:</span>
              <div className="flex items-center justify-between bg-[#F0F9FF] p-3 rounded-xl border border-sky-100">
                <span className="font-bold text-sm text-[#183B56]">
                  {isRtl ? result.analysis.moduleNameAr : result.analysis.moduleNameEn}
                </span>
                <button
                  onClick={() => onNavigate(result.analysis.recommendedModule, { initialQuery: query })}
                  className="flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:underline"
                >
                  <span>{isRtl ? 'الانتقال للقسم' : 'Go to Module'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Assessment Reason */}
            <div className="mb-4 text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl">
              <span className="font-bold text-gray-900 block mb-1">{t('ai.urgencyLevel')}:</span>
              <p>{isRtl ? result.analysis.urgencyReasonAr : result.analysis.urgencyReasonEn}</p>
            </div>

            {/* Alternatives */}
            {result.analysis.alternativeSolutionsAr && (
              <div className="mb-4">
                <span className="text-xs font-bold text-[#183B56] block mb-1.5">{t('ai.localAlternatives')}:</span>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
                  {(isRtl ? result.analysis.alternativeSolutionsAr : result.analysis.alternativeSolutionsEn).map(
                    (alt: string, i: number) => (
                      <li key={i}>{alt}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Safety Disclaimer */}
            {result.analysis.safetyDisclaimer && (
              <div className="flex items-center gap-2 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/70 mb-4">
                <Shield className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>{result.analysis.safetyDisclaimer}</span>
              </div>
            )}

            {/* Quick Action Button to Request Center */}
            <button
              onClick={() => onNavigate('request', { prefillQuery: query, module: result.analysis.recommendedModule })}
              className="w-full py-2.5 rounded-xl bg-[#183B56] text-white text-xs font-bold hover:bg-[#183B56]/90 transition flex items-center justify-center gap-2"
            >
              <span>{isRtl ? 'إنشاء طلب فوري في هذا القسم' : 'Create Request in this Module'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
