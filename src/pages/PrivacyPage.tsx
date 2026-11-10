import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyPage: React.FC = () => {
  const { isRtl } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-xs sm:text-sm">
      <div className="space-y-2 border-b border-gray-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>{isRtl ? 'حماية صارمة للخصوصية' : 'Strict Data Privacy'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#183B56]">
          {isRtl ? 'سياسة الخصوصية وحماية بيانات المستفيدين' : 'MADAR Privacy & Data Protection Policy'}
        </h1>
        <p className="text-gray-500 text-xs">
          {isRtl ? 'آخر تحديث: 2026 • مبادئ مدروسة لحماية الأسر والمخيمات في قطاع غزة' : 'Updated 2026 • Tailored for community safety in Gaza'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6 text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-base text-[#183B56] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0284C7]" />
            <span>{isRtl ? '1. مبدأ تقليل البيانات إلى أدنى حد (Data Minimization)' : '1. Data Minimization by Default'}</span>
          </h2>
          <p>
            {isRtl
              ? 'تلتزم منظومة مدار بجمع أقل قدر ممكن من البيانات الشخصية اللازمة لإنجاز الخدمة الميدانية (مثل الحي ونوع الاحتياج فقط). لا نطلب أي أرقام هويات رسمية أو وثائق حساسة قد تعرض خصوصية الأسر للخطر.'
              : 'MADAR collects only the bare operational minimum necessary for task routing (neighborhood sector and need category). We never solicit national ID numbers or sensitive familial registries.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-[#183B56] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0F766E]" />
            <span>{isRtl ? '2. حظر البيع والتسييل التجاري للبيانات' : '2. Absolute Prohibition of Data Monetization'}</span>
          </h2>
          <p>
            {isRtl
              ? 'يحظر قطعياً بيع أو مقايضة أو مشاركة بيانات المستخدمين أو سجلات الاحتياجات الإنسانية مع أي جهات تسويقية أو تجارية خارجية تحت أي ظرف.'
              : 'Personal household data and request records are strictly prohibited from being sold, rented, or traded with third-party advertisers.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-[#183B56] flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-700" />
            <span>{isRtl ? '3. خصوصية ميزات راحة العين (EyeCare)' : '3. EyeCare Accessibility Privacy'}</span>
          </h2>
          <p>
            {isRtl
              ? 'جميع تفضيلات راحة العين (نمط الألوان، حجم الخط، تذكير الاستراحة، الصوت المهدئ) تخزن محلياً فقط في متصفحك (Local Storage) ولا تُرسل أو تُحلل عبر خوادم مركزية.'
              : 'All eye comfort configurations (palette, typography scale, 20-20-20 timers, synthesized ambient sound) are processed entirely client-side via Local Storage.'}
          </p>
        </section>
      </div>
    </div>
  );
};
