import React from 'react';
import { ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TermsPage: React.FC = () => {
  const { isRtl } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-xs sm:text-sm">
      <div className="space-y-2 border-b border-gray-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-[#0284C7] text-xs font-bold">
          <Scale className="w-3.5 h-3.5" />
          <span>{isRtl ? 'ميثاق التكافل والمجتمع' : 'Community Covenant'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#183B56]">
          {isRtl ? 'شروط الخدمة والتعامل المجتمعي' : 'MADAR Terms of Community Service'}
        </h1>
        <p className="text-gray-500 text-xs">
          {isRtl ? 'قواعد النزاهة والتعاون التكافلي بين أفراد المجتمع في قطاع غزة' : 'Integrity and mutual aid protocols'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6 text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-base text-[#183B56]">{isRtl ? '1. الغاية التكافلية غير الربحية' : '1. Mutual Aid Purpose'}</h2>
          <p>
            {isRtl
              ? 'صممت منظومة مدار لتسهيل وصول المحتاجين للموارد الأساسية وربطهم بالفنيين ومحطات المياه المعتمدة. يحظر استغلال المنصة للمضاربة في الأسعار أو احتكار المواد الإغاثية.'
              : 'MADAR is established to streamline emergency community access. Exploiting the platform for price gouging, false scarcity hoarding, or monopoly is strictly barred.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-[#183B56]">{isRtl ? '2. دقة البلاغات الميدانية' : '2. Field Reporting Accuracy'}</h2>
          <p>
            {isRtl
              ? 'يلتزم المستخدمون بتقديم معلومات صحيحة ودقيقة عند الإبلاغ عن انقطاع مياه أو تسرب خيام لتفادي هدر جهود فرق الطوارئ وتوجيه الدعم للأسر الأشد استحقاقاً.'
              : 'Users must provide truthful details when flagging water outages or tent damage to ensure rapid deployment to households in greatest peril.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-[#183B56]">{isRtl ? '3. إخلاء المسؤولية الصحية والفنية' : '3. Medical & Water Quality Disclaimers'}</h2>
          <p>
            {isRtl
              ? 'تصنيفات مياه الشرب وميزات راحة العين (EyeCare) تقدم لأغراض إرشادية وتسهيلية فقط، ولا تحل محل استشارة الكوادر الطبية والمخبرية المختصة.'
              : 'Water status listings and EyeCare comfort settings are ergonomic and field-level operational guides, not replacements for clinical or certified laboratory testing.'}
          </p>
        </section>
      </div>
    </div>
  );
};
