import React from 'react';
import {
  ShoppingBag,
  Wrench,
  Home,
  Droplets,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Heart,
  Volume2,
  MapPin,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useEyeComfort } from '../context/EyeComfortContext';
import { SmartSearchSection } from '../components/home/SmartSearchSection';

export const HomePage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { marketplaceItems, repairTechnicians, waterPoints, requests, groupPurchases } = useData();
  const { speakText, isSpeaking, stopSpeaking } = useEyeComfort();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const modules = [
    {
      id: 'wasel',
      title: t('module.wasel.title'),
      desc: t('module.wasel.desc'),
      icon: ShoppingBag,
      tagAr: 'سوق مجتمعي ذكي',
      tagEn: 'Smart Marketplace',
      color: 'from-sky-500 to-blue-600',
      badgeBg: 'bg-sky-100 text-sky-800',
      count: marketplaceItems.length,
      countLabelAr: 'منتج متاح ومتحقق منه',
      countLabelEn: 'verified listings',
    },
    {
      id: 'aoun',
      title: t('module.aoun.title'),
      desc: t('module.aoun.desc'),
      icon: Wrench,
      tagAr: 'صيانة وتدوير',
      tagEn: 'Repair & Reuse',
      color: 'from-teal-500 to-emerald-600',
      badgeBg: 'bg-teal-100 text-teal-800',
      count: repairTechnicians.length,
      countLabelAr: 'فني طاقة وأجهزة معتمد',
      countLabelEn: 'verified technicians',
    },
    {
      id: 'defa',
      title: t('module.defa.title'),
      desc: t('module.defa.desc'),
      icon: Home,
      tagAr: 'حماية الشتاء والسيول',
      tagEn: 'Shelter Protection',
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-100 text-amber-800',
      count: requests.filter((r) => r.module === 'defa').length || 12,
      countLabelAr: 'حالة إيواء قيد المتابعة',
      countLabelEn: 'active shelter tasks',
    },
    {
      id: 'qatra',
      title: t('module.qatra.title'),
      desc: t('module.qatra.desc'),
      icon: Droplets,
      tagAr: 'محطات وصهاريج المياه',
      tagEn: 'Water Points',
      color: 'from-blue-500 to-cyan-600',
      badgeBg: 'bg-blue-100 text-blue-800',
      count: waterPoints.length,
      countLabelAr: 'نقطة توزيع مياه مجدولة',
      countLabelEn: 'active water points',
    },
    {
      id: 'mahara',
      title: t('module.mahara.title'),
      desc: t('module.mahara.desc'),
      icon: Briefcase,
      tagAr: 'كفاءات وفرص كريمة',
      tagEn: 'Skills & Jobs',
      color: 'from-purple-500 to-indigo-600',
      badgeBg: 'bg-purple-100 text-purple-800',
      count: 24,
      countLabelAr: 'فرصة ومهارة مستقلة',
      countLabelEn: 'freelance offerings',
    },
  ];

  return (
    <div className="space-y-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-[#D9F1FC]/50 via-[#F0F9FF]/30 to-transparent">
        {/* Soft Background Orbit Blobs */}
        <div className="absolute top-10 start-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#A9DDF5]/20 via-[#2DD4BF]/10 to-[#EAE5F7]/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Founder & Humanitarian Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200/80 shadow-xs mb-6 text-xs font-semibold text-[#183B56]">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
              <span>{isRtl ? 'منظومة مدار الإنسانية المجتمعية' : 'MADAR Humanitarian Community Platform'}</span>
              <span className="text-gray-300">•</span>
              <span className="text-[#0284C7]">{t('brand.founder')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-[#183B56] tracking-tight leading-tight mb-4">
              {isRtl ? (
                <>
                  من كل احتياج <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0D9488]">نصنع فرصة</span>،
                  <br />
                  ومن كل مورد <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D9488] to-[#183B56]">نصنع حلاً</span>.
                </>
              ) : (
                <>
                  From Every Need, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0D9488]">We Create an Opportunity</span>.
                  <br />
                  One Ecosystem. Countless Solutions.
                </>
              )}
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              {isRtl
                ? 'المنظومة الأولى التي تربط احتياجات الإيواء والمياه والطاقة الشمسية وصيانة الأجهزة والمهارات الحرة في شبكة تكافلية واحدة، مهيأة للعمل حتى مع انقطاع الكهرباء وضعف الإنترنت في قطاع غزة.'
                : 'The unified ecosystem bridging shelter essentials, drinking water points, solar gear repair, and freelance skills into one resilient mutual-aid network engineered for Gaza conditions.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('request')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#183B56] to-[#0284C7] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition flex items-center gap-2"
              >
                <span>{t('req.newTicket')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('map')}
                className="px-6 py-3.5 rounded-2xl bg-white border border-sky-200 text-[#183B56] font-bold text-xs sm:text-sm shadow-xs hover:bg-sky-50 active:scale-95 transition flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#0284C7]" />
                <span>{t('nav.map')}</span>
              </button>

              {/* TTS Listen Button for Eye Comfort */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const textToRead = isRtl
                      ? 'مرحباً بكم في منظومة مَدَار، أسستها ملاك كمنظومة مجتمعية ذكية لربط احتياجات الإيواء والمياه وصيانة الطاقة الشمسية والمهارات في غزة. من كل احتياج نصنع فرصة ومن كل مورد نصنع حلاً.'
                      : 'Welcome to MADAR, founded by Malak. An intelligent community ecosystem connecting essential marketplace, solar repairs, shelter, and water services for Gaza.';
                    speakText(textToRead, isRtl ? 'ar' : 'en');
                  }
                }}
                className={`p-3.5 rounded-2xl border transition flex items-center gap-2 text-xs font-semibold ${
                  isSpeaking
                    ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                title={isRtl ? 'الاستماع لصوت المنظومة (راحة للعين)' : 'Listen to overview audio'}
              >
                <Volume2 className="w-4 h-4 text-[#0284C7]" />
                <span className="hidden sm:inline">{isSpeaking ? t('btn.stopAudio') : (isRtl ? 'استمع بصوت هادئ' : 'Listen with Soft Voice')}</span>
              </button>
            </div>

            {/* Featured Ecosystem Visual Showcase */}
            <div className="mt-10 max-w-4xl mx-auto rounded-3xl overflow-hidden border border-sky-200/80 shadow-lg bg-white relative group">
              <img
                src="/images/madar_hero_ecosystem.jpg"
                alt="MADAR Gaza Community Technology Ecosystem - Founded by Malak"
                className="w-full h-auto object-cover max-h-[420px] transition-transform duration-500 group-hover:scale-[1.01]"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#183B56]/90 via-[#183B56]/60 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between text-white gap-3">
                <div className="text-start">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
                    <span className="text-[11px] font-bold text-[#A9DDF5] tracking-wide">
                      {isRtl ? 'خريطة المنظومة الميدانية الحية' : 'Live Ecosystem Field Operations'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white/95 leading-snug">
                    {isRtl
                      ? 'واصل (سوق الاحتياجات) • عون (صيانة الأجهزة) • دفا (حماية الإيواء) • قطرة (مياه الشرب) • مهارة (فرص الكفاءات)'
                      : 'WASEL (Marketplace) • AOUN (Repairs) • DEFA (Shelter) • QATRA (Clean Water) • MAHARA (Skills)'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const msg = isRtl
                      ? 'تجسد هذه الصورة رؤية منظومة مدار الإنسانية، التي أسستها ملاك؛ حيث تتكامل خمس وحدات حيوية: الألواح الشمسية ومستلزمات المعيشة في واصل، صيانة الإنفرترات والأجهزة في عون، عزل الخيام وحمايتها من السيول في دفا، محطات تحلية وتوزيع المياه في قطرة، والكفاءات المهنية في مهارة.'
                      : 'This visual represents MADAR humanitarian ecosystem founded by Malak, connecting solar gear, device repairs, winterized shelter, clean water points, and local freelance skills in Gaza.';
                    speakText(msg, isRtl ? 'ar' : 'en');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shrink-0 backdrop-blur-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span>{isRtl ? 'شرح بالصوت الهادئ' : 'Listen Explanation'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SMART SEARCH & AI ASSISTANT SECTION */}
      <SmartSearchSection onNavigate={onNavigate} />

      {/* 3. FIVE CORE OPERATIONAL MODULE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'وحدات مدار الخمس المتكاملة' : 'The Five Interconnected Modules'}</span>
            </div>
            <h2 className="text-2xl font-black text-[#183B56]">
              {isRtl ? 'كل حل يبدأ من هنا' : 'Every Solution Starts Here'}
            </h2>
          </div>
          <span className="text-xs text-gray-500 max-w-xs">
            {isRtl ? 'منظومة تفاعلية متكاملة تلبي احتياجات الأسرة والمخيم والحي.' : 'Operational modules serving daily community survival and dignity.'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className="group relative rounded-3xl bg-white border border-sky-100 hover:border-sky-300 p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${m.badgeBg}`}>
                      {isRtl ? m.tagAr : m.tagEn}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F0F9FF] to-[#D9F1FC] text-[#0284C7] group-hover:scale-110 group-hover:bg-[#183B56] group-hover:text-white transition-all flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#183B56] group-hover:text-[#0284C7] transition-colors mb-2">
                    {m.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {m.desc}
                  </p>
                </div>

                {/* Footer Count & Link */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <span className="font-extrabold text-[#183B56] text-sm">{m.count}</span>
                    <span className="text-[11px]">{isRtl ? m.countLabelAr : m.countLabelEn}</span>
                  </div>
                  <span className="text-[#0284C7] font-bold flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    <span>{t('btn.viewDetails')}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}

          {/* EyeCare Feature Highlight Card */}
          <div
            onClick={() => onNavigate('eyecare')}
            className="group rounded-3xl bg-gradient-to-br from-[#183B56] to-[#0F283D] text-white p-6 shadow-md hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  {isRtl ? 'ميزة حصرية' : 'Accessibility Suite'}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2">
                {t('eye.title')}
              </h3>

              <p className="text-xs text-white/80 leading-relaxed mb-6">
                {isRtl
                  ? 'نمط مهدئ للعين بإضاءة منخفضة وقراءة دافئة وتنبيه 20-20-20 وأصوات طبيعية بدون استهلاك للإنترنت.'
                  : 'Gentle ergonomic visual interface with warm reading mode, 20-20-20 break reminders, and zero-bandwidth synthesized calm nature sounds.'}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>{isRtl ? 'تخصيص راحة بصرك' : 'Customize Visual Comfort'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL COMMUNITY IMPACT & FACTUAL STANDARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="rounded-3xl bg-white border border-sky-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider block mb-1">
                {isRtl ? 'الأثر الميداني الموثق والأرقام الحقيقية' : 'Verified Community Impact & Live Facts'}
              </span>
              <h3 className="text-2xl font-black text-[#183B56]">
                {isRtl ? 'بيانات حقيقية من واقع الصمود الميداني' : 'Real Gaza Metrics Built on Mutual Dignity'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isRtl ? 'تحديث لحظي مستمد من سجلات الميدان ومعايير Sphere الإنسانية الدولية.' : 'Real-time indicators aligned with international Sphere Humanitarian standards.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const report = isRtl
                  ? 'تقرير مؤشرات مدار الميدانية: تشرف المنظومة على توزيع أكثر من 48 ألف لتر مياه شرب يومياً عبر محطات تحلية تعمل بالطاقة الشمسية، وتم إصلاح 455 جهاز وإنفرتر طاقة، وتدعيم 128 خيمة ضد السيول بشوادر 220 غرام عازلة، وإنجاز 23 طلب شراء جماعي وفرت 18 بالمئة من التكاليف.'
                  : 'MADAR Field Report: Monitoring 48,000 liters of potable water daily, 455 solar inverters repaired, 128 shelter flood interventions with 220 GSM tarps, and 23 group purchases saving 18 percent.';
                speakText(report, isRtl ? 'ar' : 'en');
              }}
              className="px-4 py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200 text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto shrink-0"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isRtl ? 'استمع لتقرير الأرقام بالصوت الهادئ' : 'Listen to Report with Soft Voice'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 text-center mb-8">
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
              <span className="text-3xl font-black text-[#0284C7] block mb-1">48,200</span>
              <span className="text-xs font-bold text-gray-700 block mb-0.5">{isRtl ? 'لتر مياه شرب يومياً' : 'Liters/Day Potable Water'}</span>
              <span className="text-[10px] text-gray-500">{isRtl ? 'مطابق لمعيار Sphere (15L/فرد)' : 'Sphere Standard (15L/pp)'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100">
              <span className="text-3xl font-black text-teal-700 block mb-1">455+</span>
              <span className="text-xs font-bold text-gray-700 block mb-0.5">{t('stat.repairedDevices')}</span>
              <span className="text-[10px] text-gray-500">{isRtl ? 'وفر 112 ألف ₪ كبديل شراء' : 'Saved 112k ILS in gear'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
              <span className="text-3xl font-black text-amber-700 block mb-1">128</span>
              <span className="text-xs font-bold text-gray-700 block mb-0.5">{t('stat.shelteredFamilies')}</span>
              <span className="text-[10px] text-gray-500">{isRtl ? 'شوادر 220 GSM وطبليات خشب' : '220 GSM Tarps & Pallets'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
              <span className="text-3xl font-black text-blue-700 block mb-1">23</span>
              <span className="text-xs font-bold text-gray-700 block mb-0.5">{t('stat.groupPurchases')}</span>
              <span className="text-[10px] text-gray-500">{isRtl ? 'متوسط توفير 18.4% للأسر' : 'Avg 18.4% Bulk Savings'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 col-span-2 lg:col-span-1">
              <span className="text-3xl font-black text-purple-700 block mb-1">58</span>
              <span className="text-xs font-bold text-gray-700 block mb-0.5">{t('stat.activeProviders')}</span>
              <span className="text-[10px] text-gray-500">{isRtl ? 'في 5 محافظات ومخيمات' : 'Across 5 Governorates'}</span>
            </div>
          </div>

          {/* Visual Spotlights: Clean Water & Winter Shelter Protection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Water Visual Card */}
            <div
              onClick={() => onNavigate('qatra')}
              className="rounded-2xl border border-sky-100 hover:border-sky-300 p-4 bg-gradient-to-b from-sky-50/40 to-white group cursor-pointer transition flex flex-col sm:flex-row gap-4 items-center"
            >
              <img
                src="/images/qatra_clean_water.jpg"
                alt="QATRA Clean Drinking Water Point"
                className="w-full sm:w-44 h-32 object-cover rounded-xl shadow-xs group-hover:scale-105 transition duration-300 shrink-0"
              />
              <div className="space-y-1.5 text-start">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-[#0284C7] inline-block">
                  {isRtl ? 'قطرة — مياه نقية بالطاقة الشمسية' : 'QATRA Solar Desalination'}
                </span>
                <h4 className="font-bold text-sm text-[#183B56] group-hover:text-[#0284C7] transition">
                  {isRtl ? 'فحص دوري لنسبة الأملاح TDS والكلور' : 'Verified Field RO Water Purity'}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {isRtl
                    ? 'محطات تناضح عكسي تعمل نهاراً بالطاقة الشمسية لتوفير مياه عذبة للشرب مع نظام تذاكر منظم.'
                    : 'Solar-powered multi-stage RO drinking water stations serving camps with organized queue vouchers.'}
                </p>
              </div>
            </div>

            {/* Shelter Visual Card */}
            <div
              onClick={() => onNavigate('defa')}
              className="rounded-2xl border border-amber-100 hover:border-amber-300 p-4 bg-gradient-to-b from-amber-50/40 to-white group cursor-pointer transition flex flex-col sm:flex-row gap-4 items-center"
            >
              <img
                src="/images/defa_winter_shelter.jpg"
                alt="DEFA Shelter Winterization & Floor Protection"
                className="w-full sm:w-44 h-32 object-cover rounded-xl shadow-xs group-hover:scale-105 transition duration-300 shrink-0"
              />
              <div className="space-y-1.5 text-start">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 inline-block">
                  {isRtl ? 'دفا — حماية الشتاء ومكافحة السيول' : 'DEFA Flood-Proof Shelters'}
                </span>
                <h4 className="font-bold text-sm text-[#183B56] group-hover:text-amber-800 transition">
                  {isRtl ? 'شوادر عازلة 220 GSM وطبليات خشبية' : 'Raised Wooden Platforms & Heavy Tarps'}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {isRtl
                    ? 'تدعيم أسقف الخيام بخياطة محكمة وتصريف مياه الأمطار بخنادق محيطية لحماية الأطفال والمرضى.'
                    : 'Stitched heavy-duty canvas, perimeter runoff trenches, and raised pallet beds to keep families dry.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW MADAR WORKS (4-STEP WORKFLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#0284C7] uppercase block mb-1">
            {isRtl ? 'آلية العمل المبسطة' : 'Transparent Architecture'}
          </span>
          <h2 className="text-2xl font-black text-[#183B56]">
            {isRtl ? 'كيف تعمل منظومة مَدَار الميدانية؟' : 'How MADAR Operates in the Field'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              titleAr: 'سجّل احتياجك أو ابحث عنه',
              titleEn: 'State Your Need or Search',
              descAr: 'اكتب حاجتك بكلماتك البسيطة في محرك مدار الذكي أو اختر القسم المباشر.',
              descEn: 'Describe your need in simple terms or pick the direct operational module.',
              icon: AlertTriangle,
            },
            {
              step: '02',
              titleAr: 'توجيه آلي وحساب الاستحقاق',
              titleEn: 'Smart Routing & Urgency',
              descAr: 'يحلل النظام الحالة بدقة وفق معايير شفافة تعطي الأولوية للأسر التي لديها أطفال رضع أو مرضى.',
              descEn: 'System computes transparent urgency scoring prioritizing vulnerable households.',
              icon: TrendingUp,
            },
            {
              step: '03',
              titleAr: 'ربط مباشر بالمزود والحي',
              titleEn: 'Direct Local Matching',
              descAr: 'التواصل الفوري مع الفني أو التاجر أو نقطة المياه الموثقة الأقرب جغرافياً في دير البلح أو خانيونس أو النصيرات.',
              descEn: 'Connects directly with nearest verified technician, merchant, or water depot.',
              icon: Users,
            },
            {
              step: '04',
              titleAr: 'توثيق وتكافل مستمر',
              titleEn: 'Verified Close & Community Care',
              descAr: 'تأكيد إنجاز الخدمة وتدوير الأدوات الفائضة لدعم أسر أخرى في مجتمعنا.',
              descEn: 'Confirm task completion, review quality, and recycle extra resources.',
              icon: CheckCircle2,
            },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="relative rounded-3xl bg-white border border-gray-100 p-6 shadow-xs">
                <div className="text-3xl font-black text-[#A9DDF5] mb-3">{s.step}</div>
                <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#183B56] mb-2">{isRtl ? s.titleAr : s.titleEn}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{isRtl ? s.descAr : s.descEn}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FOUNDER MALAK'S MESSAGE & GAZA RESILIENCE NOTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-tr from-[#183B56] via-[#1E4565] to-[#0A2234] text-white p-8 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#A9DDF5] text-xs font-bold mb-4">
              <Heart className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>{isRtl ? 'رسالة من المؤسس ملاك' : 'Message from Founder Malak'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-4 leading-snug">
              {isRtl
                ? '«لم ننتظر الظروف لتتحسن.. بل بنينا مدار لكي يصنع الأمل من قلب الحاجة»'
                : '“We did not wait for conditions to improve; we built MADAR so hope emerges directly from resilience.”'}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
              {isRtl
                ? 'انطلقت مَدَار كاستجابة واقعية لأصعب الظروف التي يعيشها أهلنا في غزة. صممنا التطبيق ليكون فائق الخفة، يعمل بدون إنترنت، ويوفر راحة حقيقية للعيون المنهكة من الشاشات بعد ساعات طويلة من البحث عن مقومات الحياة اليومية.'
                : 'MADAR was conceived as an authentic response to daily life in Gaza. Engineered to be ultralight, fully offline-functional, and soothing for tired eyes with dedicated EyeCare features.'}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-2.5 rounded-xl bg-[#2DD4BF] text-[#183B56] font-bold text-xs hover:bg-[#2DD4BF]/90 transition"
              >
                {t('nav.about')}
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
              >
                {isRtl ? 'التواصل الميداني' : 'Field Contact'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
