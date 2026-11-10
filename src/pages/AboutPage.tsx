import React from 'react';
import { Sparkles, Heart, ShieldCheck, Users, Globe, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 text-xs sm:text-sm">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-[#0284C7] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('brand.founder')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#183B56] leading-tight">
          {isRtl ? 'قصة تأسيس مَدَار' : 'The Story & Vision Behind MADAR'}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {isRtl
            ? '«من كل احتياج نصنع فرصة، ومن كل مورد نصنع حلاً» — مبادرة مجتمعية ذكية ولدت من قلب المعاناة في قطاع غزة.'
            : '“From Every Need, We Create an Opportunity.” An intelligent community ecosystem born out of Gaza resilience.'}
        </p>
      </div>

      {/* Founder Malak Profile Card */}
      <div className="bg-gradient-to-br from-[#183B56] to-[#0A2234] text-white rounded-3xl p-8 shadow-md flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#A9DDF5] to-[#2DD4BF] text-[#183B56] flex items-center justify-center font-black text-4xl shadow-lg shrink-0">
          م
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-white">{isRtl ? 'ملاك | المؤسس وصاحب العلامة' : 'Malak | Founder & Brand Owner'}</h2>
            <span className="text-[11px] bg-[#2DD4BF] text-[#183B56] px-2.5 py-0.5 rounded-full font-bold">
              Founder & Architect
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A9DDF5] leading-relaxed">
            {isRtl
              ? 'أسست ملاك منظومة مدار استجابة للتحديات القاسية التي يواجهها أهلنا في قطاع غزة؛ حيث ينعدم التيار الكهربائي وتتعطل شبكات الاتصال وتتشتت الموارد الأساسية. رؤية ملاك هي تحويل كل مشكلة ميدانية إلى حلقة ربط تكافلية تعيد تدوير الموارد المتاحة وتسهل الوصول للماء والمأوى والطاقة الشمسية والمهارات الحرة بكرامة واستقلالية.'
              : 'Malak established MADAR in response to the severe infrastructural constraints in Gaza—frequent electricity cuts, unstable networks, and fragmented aid. Her vision transforms every community obstacle into a dignified, self-reliant mutual aid loop.'}
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#183B56] text-center">{isRtl ? 'ركائز المنظومة' : 'Core Operational Principles'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-sm text-[#183B56]">{isRtl ? 'الصمود في ظل انقطاع الاتصال' : 'Offline-First Gaza Resilience'}</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              {isRtl ? 'تطبيق ويب تقدمي (PWA) يخزن البيانات محلياً على هاتفك ويسمح لك بتسجيل الطلبات حتى بدون اتصال بالإنترنت.' : 'PWA architecture that operates locally on low data and syncs automatically when connectivity returns.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-teal-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-sm text-[#183B56]">{isRtl ? 'راحة العين والوصول الشامل' : 'Dedicated MADAR EyeCare'}</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              {isRtl ? 'وضع راحة العين مخصص لحماية الأبصار المجهدة من قضاء ساعات طويلة أمام الشاشات تحت أشعة الشمس أو في الخيام المظلمة.' : 'Engineered for screen fatigue, light sensitivity, and dry eyes without distracting animations.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-sm text-[#183B56]">{isRtl ? 'العدالة والشفافية التامة' : 'Transparent Priority Scoring'}</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              {isRtl ? 'خوارزمية ذكية غير منحازة تعطي الأولوية القصوى للعائلات التي تغمر خيامها السيول أو لديها أطفال رضع ومرضى.' : 'Open scoring algorithm that transparently prioritizes flooded shelters, infants, and chronic patients.'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => onNavigate('request')}
          className="px-6 py-3 rounded-2xl bg-[#183B56] text-white font-bold text-xs shadow-md hover:bg-[#183B56]/90 transition"
        >
          {isRtl ? 'انضم إلى المنظومة وسجل احتياجك' : 'Join the Ecosystem & Submit Need'}
        </button>
      </div>
    </div>
  );
};
