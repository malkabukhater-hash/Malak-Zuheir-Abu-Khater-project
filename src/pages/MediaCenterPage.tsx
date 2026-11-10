import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sun,
  CloudRain,
  Droplets,
  BatteryCharging,
  Sparkles,
  FileText,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useEyeComfort } from '../context/EyeComfortContext';

export const MediaCenterPage: React.FC = () => {
  const { isRtl, t } = useLanguage();
  const { speakText, isSpeaking, stopSpeaking } = useEyeComfort();
  const [activeGuide, setActiveGuide] = useState<string>('solar');

  const guides = [
    {
      id: 'solar',
      titleAr: 'كيف ترفع كفاءة ألواح الطاقة الشمسية 40% في ظل الغبار؟',
      titleEn: 'Boosting Solar Panel Efficiency by 40% in Dusty Air',
      categoryAr: 'طاقة وبدائل',
      categoryEn: 'Solar & Power',
      icon: Sun,
      color: 'from-amber-500 to-orange-600',
      duration: '4 دقائق قراءة / استماع',
      contentAr: `
1. تأثير الغبار: يؤدي تراكم الغبار ودخان المواقد على الألواح الشمسية إلى خفض إنتاج الكهرباء بنسبة تصل إلى 40%، مما يمنع شحن البطاريات بالكامل.
2. الطريقة الصحيحة للتنظيف بأقل كمية ماء:
   - امسح اللوح في الصباح الباكر أو بعد غروب الشمس فقط، حيث يكون الزجاج بارداً (تنظيف الزجاج وهو ساخن بالماء قد يسبب تشققات حرارية).
   - استخدم قطعة قماش قطنية ناعمة مبللة بقليل من الماء النظيف، وتجنب استخدام المنظفات الكيماوية أو الفرك العنيف لمنع خدش الطبقة العاكسة.
3. زاوية الميل المناسبة: اضبط ميل اللوح بزاوية 30-35 درجة نحو الجنوب لتحقيق أقصى استفادة شمسية ومساعدة قطرات الندى على غسل الأتربة ذاتياً.
      `,
      contentEn: `
1. Dust Impact: Dust and smoke accumulation reduce solar wattage by up to 40%, preventing deep battery charging cycles.
2. Water-efficient Cleaning:
   - Clean only in early morning or after sunset when glass is cool to prevent thermal cracking.
   - Use a soft damp cotton rag with minimal clean water. Never use harsh abrasives.
3. Optimal Angle: Tilt panels 30-35 degrees facing south to maximize solar gain and allow morning dew to help slide dust off.
      `,
    },
    {
      id: 'shelter',
      titleAr: 'الدليل الميداني لتدعيم خيام الإيواء ومنع غرق الفرشات',
      titleEn: 'Field Guide: Stormproofing Tents & Preventing Flooding',
      categoryAr: 'إيواء وحماية',
      categoryEn: 'Shelter',
      icon: CloudRain,
      color: 'from-blue-600 to-sky-700',
      duration: '5 دقائق قراءة / استماع',
      contentAr: `
1. الخندق المحيطي (Trenching): احفر خندقاً بعمق 20 سم وعرض 15 سم حول محيط الخيمة بمسافة نصف متر، مع توجيه مجرى الخندق نحو منحدر طبيعي لتفريغ مياه الأمطار.
2. الشادر المزدوج وحاجز الهواء: ضع شادراً نايلونياً فوق قماش الخيمة مع ترك مسافة فراغ هوائي (10 سم) بينهما إن أمكن، فهذا يمنع التكاثف الداخلي ويمنع تسرب قطرات المطر إلى الداخل.
3. رفع الأرضية (Pallets): لا تضع الفرشات مباشرة على التراب. رتب ألواح خشبية معالجة أو طبليات، وضع فوقها شادر أرضي ثم الفرشات لعزل الرطوبة وبرودة الأرض.
      `,
      contentEn: `
1. Perimeter Drainage: Dig a 20cm trench around the tent half a meter away, guiding run-off toward natural slopes.
2. Dual-Layer Tarp with Air Gap: Fasten a heavy waterproof tarp over canvas with a slight air gap to stop condensation and drip penetration.
3. Raised Pallet Flooring: Elevate all bedding on wooden pallets to prevent dampness and mud ingress.
      `,
    },
    {
      id: 'water',
      titleAr: 'تعقيم وتنقية مياه الشرب منزلياً بدون كهرباء',
      titleEn: 'Home Water Purification Protocols Without Electricity',
      categoryAr: 'مياه وصحة',
      categoryEn: 'Water Safety',
      icon: Droplets,
      color: 'from-cyan-600 to-teal-700',
      duration: '3 دقائق قراءة / استماع',
      contentAr: `
1. الغليان (Boiling): الطريقة الأكثر أماناً لقتل البكتيريا والطفيليات. دقيقة واحدة من الغليان المتواصل بعد تصاعد الفقاعات كافية تماماً.
2. التعقيم بأشعة الشمس (تقنية SODIS): في حال عدم توفر وقود للغلي، املأ زجاجات بلاستيكية شفافة نظيفة (PET) بمياه غير عكرة، وضعها على لوح زنك مموج تحت أشعة الشمس المباشرة لمدة 6 ساعات متواصلة. الأشعة فوق البنفسجية تقضي على مسببات الأمراض.
3. التخزين الآمن: استخدم أوعية محكمة الإغلاق مع صنبور سفلي لتجنب إدخال الأيدي أو الكؤوس الملوثة في وعاء التخزين.
      `,
      contentEn: `
1. Rolling Boil: Boiling water for 1 full minute eliminates biological pathogens and cysts.
2. SODIS Solar Disinfection: Clear plastic bottles on corrugated metal under 6 hours of full sun utilize UV rays to sanitize non-turbid water.
3. Safe Storage: Use sealed dispensing containers with taps to avoid hand contamination.
      `,
    },
    {
      id: 'battery',
      titleAr: 'كيف تحافظ على عمر بطارية الجل وتمنع تلفها السريع؟',
      titleEn: 'Preserving Gel Battery Lifespan Under Heavy Cycling',
      categoryAr: 'طاقة',
      categoryEn: 'Batteries',
      icon: BatteryCharging,
      color: 'from-emerald-600 to-teal-800',
      duration: '4 دقائق قراءة / استماع',
      contentAr: `
1. تجنب التفريغ العميق (Deep Discharge): لا تدع جهد البطارية ينخفض أبداً عن 11.5 فولت. تفريغ البطارية حتى الانطفاء التام يدمر ألواح الرصاص ويقصر عمرها بنسبة 70%.
2. الشحن المتدرج: لا تشحن البطارية بتيار يزيد عن 15% من سعتها الإجمالية (مثلاً: بطارية 100 أمبير تشحن بتيار أقصى 15 أمبير لمنع تسخين الجل وجفافه).
3. التهوية والعزل: ضع البطارية في مكان جيد التهوية وبارد بعيداً عن أشعة الشمس المباشرة وحرارة الخيمة.
      `,
      contentEn: `
1. Prevent Deep Discharge: Never discharge a 12V gel battery below 11.5V. Deep depletion degrades plates irreversibly.
2. Safe Charge Current: Keep charging current under 15% of Amp-hour rating (e.g. 15A for a 100Ah battery).
3. Thermal Protection: Keep batteries in shaded, ventilated spots away from direct noon heat.
      `,
    },
  ];

  const current = guides.find((g) => g.id === activeGuide) || guides[0];

  const handleListen = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const fullText = `${isRtl ? current.titleAr : current.titleEn}. ${isRtl ? current.contentAr : current.contentEn}`;
      speakText(fullText, isRtl ? 'ar' : 'en');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#183B56] to-[#0284C7] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#A9DDF5] text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>{isRtl ? 'المعرفة المجتمعية والنجاة الميدانية' : 'Community Knowledge & Field Guides'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('nav.media')}</h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
            {isRtl
              ? 'إرشادات عملية موثقة وموجزة صممت لمساعدة العائلات على حماية خيامهم، تنقية مياههم، ومضاعفة عمر بطارياتهم وألواحهم الشمسية بأقل تكلفة ممكنة.'
              : 'Practical, low-data field guides to stormproof shelters, purify water, and double solar & battery life.'}
          </p>
        </div>
      </div>

      {/* Guide selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {guides.map((g) => {
          const Icon = g.icon;
          const isSelected = activeGuide === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                setActiveGuide(g.id);
                stopSpeaking();
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-[#183B56] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 text-[#0284C7]" />
              <span>{isRtl ? g.titleAr : g.titleEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Guide View */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full mb-2 inline-block">
              {isRtl ? current.categoryAr : current.categoryEn}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#183B56] leading-snug">
              {isRtl ? current.titleAr : current.titleEn}
            </h2>
            <span className="text-xs text-gray-400 mt-1 block">⏱️ {current.duration}</span>
          </div>

          {/* Audio Reading Control */}
          <button
            onClick={handleListen}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition flex items-center gap-2 shadow-xs shrink-0 ${
              isSpeaking
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : 'bg-[#F0F9FF] text-[#0284C7] border border-sky-200 hover:bg-sky-100'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? t('btn.stopAudio') : (isRtl ? 'استمع للدليل بصوت مريح' : 'Listen to Guide')}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="text-xs sm:text-sm text-gray-700 leading-loose whitespace-pre-line font-normal bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          {isRtl ? current.contentAr : current.contentEn}
        </div>

        {/* Action Bottom */}
        <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
          <span>{isRtl ? 'تمت مراجعة الدليل مع فرق الإغاثة والمهندسين الميدانيين.' : 'Peer-reviewed with Gaza field technicians.'}</span>
        </div>
      </div>
    </div>
  );
};
