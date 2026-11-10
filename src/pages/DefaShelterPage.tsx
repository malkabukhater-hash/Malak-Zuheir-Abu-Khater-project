import React, { useState } from 'react';
import {
  Home,
  CloudRain,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Users,
  Layers,
  ThermometerSnowflake,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Flame,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useEyeComfort } from '../context/EyeComfortContext';

export const DefaShelterPage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { shelterSupplies, requests, createRequest } = useData();
  const { currentUser } = useAuth();
  const { speakText } = useEyeComfort();

  const [showLeakModal, setShowLeakModal] = useState(false);
  const [leakDesc, setLeakDesc] = useState('');
  const [hasInfants, setHasInfants] = useState(false);
  const [hasElderly, setHasElderly] = useState(false);
  const [floodedTent, setFloodedTent] = useState(false);
  const [leakSubmitted, setLeakSubmitted] = useState(false);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleLeakSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leakDesc) return;

    await createRequest({
      title: 'بلاغ تسرب مياه أمطار وتلف خيمة إيواء',
      module: 'defa',
      category: 'water_leakage',
      neighborhood: currentUser.neighborhood || 'Deir al-Balah',
      neighborhoodAr: currentUser.neighborhoodAr || 'دير البلح',
      urgency: floodedTent || hasInfants ? 'urgent' : 'high',
      description: leakDesc,
      hasInfants,
      hasSickOrElderly: hasElderly,
      floodedTent,
      requesterName: currentUser.nameAr || currentUser.name,
      requesterRole: currentUser.role,
    });

    setLeakSubmitted(true);
  };

  const defaRequests = requests.filter((r) => r.module === 'defa');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#9A3412] via-[#C2410C] to-[#183B56] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold mb-3">
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            <span>{isRtl ? 'حماية الإيواء وتدعيم الخيام' : 'Shelter & Winterization'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('module.defa.title')}</h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
            {t('module.defa.desc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowLeakModal(true);
              setLeakSubmitted(false);
              setLeakDesc('');
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#183B56] font-bold text-xs shadow-md active:scale-95 transition flex items-center gap-2"
          >
            <CloudRain className="w-4 h-4" />
            <span>{isRtl ? 'إبلاغ عن غرق خيمة / تسرب أمطار' : 'Report Tent Leak / Flooding'}</span>
          </button>
        </div>
      </div>

      {/* Safety & Storm Guidance Notice with Audio Reader */}
      <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 text-amber-950 text-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>{isRtl ? 'إرشادات السلامة الوقائية أثناء المنخفضات الجوية' : 'Emergency Winter Storm & Fire Safety Guidance'}</span>
          </div>
          <button
            onClick={() =>
              speakText(
                isRtl
                  ? 'إرشادات السلامة الوقائية في المنخفضات: أولاً، يحظر إشعال الحطب أو الفحم داخل الخيمة المغلقة لتجنب الاختناق بغاز أول أكسيد الكربون. ثانياً، احفر خندقاً بعمق عشرين سنتيمتراً حول الخيمة لتصريف الأمطار. ثالثاً، ارفع الفرشات على طبليات خشبية.'
                  : 'Winter storm safety instructions: First, never burn wood or charcoal inside a sealed tent to prevent carbon monoxide poisoning. Second, dig a 20 centimeter perimeter trench to divert water. Third, raise bedding onto pallets.',
                isRtl ? 'ar-SA' : 'en-US'
              )
            }
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold hover:bg-amber-200 transition"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استمع للإرشادات' : 'Listen to Guidance'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-900/90">
          <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
            <span className="font-bold block mb-1">⚠️ {isRtl ? 'منع الاختناق والحرائق:' : 'Carbon Monoxide Warning:'}</span>
            <p>{isRtl ? 'يحظر إشعال الحطب أو الفحم داخل الخيمة المغلقة دون تهوية علوية لتجنب التسمم بالغاز.' : 'Never burn wood or charcoal inside a sealed tent. Ensure adequate roof ventilation.'}</p>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
            <span className="font-bold block mb-1">🌧️ {isRtl ? 'قنوات تصريف السيول:' : 'Trenching & Drainage:'}</span>
            <p>{isRtl ? 'احفر خندقاً محيطياً بعمق 20 سم حول الخيمة لتصريف مياه الأمطار بعيداً عن الفرشات.' : 'Dig a 20cm perimeter trench around your tent to divert stormwater.'}</p>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
            <span className="font-bold block mb-1">🪵 {isRtl ? 'رفع الأرضيات (Pallets):' : 'Raised Flooring:'}</span>
            <p>{isRtl ? 'استخدم طبليات الخشب المعالجة لرفع الأمتعة والأغطية عن رطوبة الأرض والطين.' : 'Use wooden pallets to keep bedding and clothes dry off muddy ground.'}</p>
          </div>
        </div>
      </div>

      {/* Illustrated Shelter & Sphere Standards Block */}
      <div className="rounded-3xl bg-white border border-amber-100 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 gap-0">
        <div className="md:col-span-5 relative min-h-[220px] bg-slate-900 overflow-hidden">
          <img
            src="/images/defa_winter_shelter.jpg"
            alt={isRtl ? 'تدعيم خيام الإيواء ضد الشتاء والرياح' : 'Winter Storm Shelter Reinforcement'}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
              {isRtl ? 'هندسة تدعيم الخيام الشتوية' : 'Storm Reinforcement Engineering'}
            </span>
            <p className="text-xs text-white/90 leading-snug">
              {isRtl
                ? 'شوادر 220 غرام/م²، نايلون عازل 200 ميكرون، وحبال شد نايلون 4 جدلات مع مرابط أرضية.'
                : '220 GSM tarps, 200-micron thermal film, and 4-ply nylon tie-downs with deep ground anchors.'}
            </p>
          </div>
        </div>

        <div className="md:col-span-7 p-6 flex flex-col justify-between bg-gradient-to-br from-white to-amber-50/40">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#C2410C] uppercase tracking-wide">
                {isRtl ? 'معايير الإيواء الإنساني (Sphere Standards)' : 'Sphere Humanitarian Shelter Standards'}
              </span>
              <button
                onClick={() =>
                  speakText(
                    isRtl
                      ? 'وفق معايير إسفير الدولية للإيواء: الحد الأدنى المطلوب هو ثلاثة أمتار ونصف مربعة من المساحة المغطاة للشخص الواحد، مع ضمان تصريف المياه وارتفاع مناسب للخيمة لا يقل عن مترين في المنتصف.'
                      : 'According to Sphere shelter standards: minimum covered floor space is 3.5 square meters per person, with positive drainage and minimum 2-meter central height.',
                    isRtl ? 'ar-SA' : 'en-US'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#C2410C] text-xs font-bold hover:bg-amber-200 transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'استمع بصوت هادئ' : 'Listen with Soft Voice'}</span>
              </button>
            </div>

            <h3 className="font-bold text-base text-[#183B56] mb-3">
              {isRtl ? 'أرقام وحقائق صمود الخيام في المنخفضات' : 'Tent Resilience & Cold Weather Metrics'}
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="p-3 bg-white rounded-2xl border border-amber-100 shadow-2xs">
                <span className="block text-lg font-black text-[#C2410C]">3.5 m²</span>
                <span className="text-[10px] text-gray-500 font-medium">{isRtl ? 'معيار إسفير / فرد' : 'Sphere / person'}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-sky-100 shadow-2xs">
                <span className="block text-lg font-black text-[#0284C7]">220 GSM</span>
                <span className="text-[10px] text-gray-500 font-medium">{isRtl ? 'كثافة الشادر الموصى بها' : 'Tarp Density'}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-teal-100 shadow-2xs">
                <span className="block text-lg font-black text-teal-700">20 cm</span>
                <span className="text-[10px] text-gray-500 font-medium">{isRtl ? 'عمق خندق التصريف' : 'Drainage Depth'}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            {isRtl
              ? 'تمنح أولوية توزيع الشوادر والعوازل للأسر التي تضم رضعاً أو مسنين أو خياماً تعرضت للغرق التام، مع التحقق الميداني الفوري لضمان وصول العون لمستحقيه.'
              : 'Priority allocation targets families with infants, elderly, or severely flooded shelters, with rapid on-the-ground verification.'}
          </p>
        </div>
      </div>

      {/* Available Winter Protection Supplies */}
      <div>
        <h2 className="font-bold text-base text-[#183B56] mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#C2410C]" />
          <span>{isRtl ? 'مستودع شوادر ومواد الإيواء المتوفرة' : 'Available Winterization Supplies'}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shelterSupplies.map((sup) => (
            <div key={sup.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {isRtl ? `متوفر: ${sup.available} وحدة` : `${sup.available} units in stock`}
                  </span>
                  <span className="text-xs text-gray-500">📍 {isRtl ? sup.neighborhoodAr : sup.neighborhood}</span>
                </div>
                <h3 className="font-bold text-sm text-[#183B56] mb-2">{isRtl ? sup.titleAr : sup.titleEn}</h3>
                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 mb-3">
                  <span className="font-semibold text-gray-800">{isRtl ? 'معيار الأولوية:' : 'Priority criterion:'}</span> {sup.priorityCriterion}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">{sup.organization}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      speakText(
                        isRtl
                          ? `${sup.titleAr}. متوفر ${sup.available} وحدة في ${sup.neighborhoodAr}. معيار الأولوية: ${sup.priorityCriterion}`
                          : `${sup.titleEn}. ${sup.available} units available in ${sup.neighborhood}. Priority: ${sup.priorityCriterion}`,
                        isRtl ? 'ar-SA' : 'en-US'
                      )
                    }
                    className="p-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-[#C2410C] transition"
                    title={isRtl ? 'استمع لبيانات الصنف بصوت هادئ' : 'Listen with Soft Voice'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('request', { module: 'defa', prefillQuery: `طلب استلام: ${sup.titleAr}` })}
                    className="px-3.5 py-1.5 rounded-xl bg-[#C2410C] text-white font-semibold hover:bg-[#C2410C]/90"
                  >
                    {isRtl ? 'تقديم طلب استحقاق' : 'Apply for Supply'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Shelter Cases & Live Tracking */}
      <div>
        <h2 className="font-bold text-base text-[#183B56] mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
          <span>{isRtl ? 'سجل حالات الإيواء الميدانية قيد المعالجة' : 'Active Field Shelter Interventions'}</span>
        </h2>

        <div className="space-y-3">
          {defaRequests.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#183B56] text-sm">{req.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {req.status}
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                    {isRtl ? `أولوية ${req.urgencyScore}%` : `Score: ${req.urgencyScore}`}
                  </span>
                </div>
                <p className="text-gray-500">{req.description}</p>
                <div className="text-[11px] text-gray-400">
                  📍 {req.neighborhoodAr} • {req.requesterName} • {new Date(req.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
                </div>
              </div>

              <button
                onClick={() => onNavigate('request', { viewId: req.id })}
                className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-[#183B56] font-semibold shrink-0"
              >
                {isRtl ? 'تتبع الخطوات الميدانية' : 'Track Steps'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Rain Leak Modal */}
      {showLeakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-amber-200 text-[#183B56]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base text-amber-900">{isRtl ? 'إبلاغ طارئ: تسرب أمطار أو سيول' : 'Emergency Shelter Report'}</h3>
              <button onClick={() => setShowLeakModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {leakSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#183B56]">{isRtl ? 'تم تسجيل البلاغ العاجل!' : 'Urgent Ticket Logged!'}</h4>
                <p className="text-xs text-gray-500">
                  {isRtl
                    ? 'تم إدراج الحالة في مقدمة جدول الأولويات الميدانية لفريق دفا وسيتم التنسيق لتركيب شادر عازل.'
                    : 'Your shelter ticket has been assigned high priority for rapid tarp reinforcement.'}
                </p>
                <button
                  onClick={() => setShowLeakModal(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-[#183B56] text-white text-xs font-semibold"
                >
                  {isRtl ? 'إغلاق ومتابعة' : 'Close'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeakSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {isRtl ? 'وصف تسرب المياه وحالة الخيمة:' : 'Describe the Leak / Flooding:'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={leakDesc}
                    onChange={(e) => setLeakDesc(e.target.value)}
                    placeholder="مثال: تمزق في سقف الخيمة وتجمع المياه على الفرشات..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                {/* Vulnerability factors calculation */}
                <div className="space-y-2 bg-amber-50 p-3 rounded-2xl border border-amber-100 text-gray-700">
                  <span className="font-bold block text-amber-900">{isRtl ? 'عوامل تحديد أولوية التدخل:' : 'Priority Factors:'}</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasInfants}
                      onChange={(e) => setHasInfants(e.target.checked)}
                      className="rounded-sm text-amber-600 focus:ring-0"
                    />
                    <span>{t('req.hasInfants')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasElderly}
                      onChange={(e) => setHasElderly(e.target.checked)}
                      className="rounded-sm text-amber-600 focus:ring-0"
                    />
                    <span>{t('req.hasSick')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={floodedTent}
                      onChange={(e) => setFloodedTent(e.target.checked)}
                      className="rounded-sm text-amber-600 focus:ring-0"
                    />
                    <span className="text-red-700 font-semibold">{t('req.isFlooded')}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-md"
                >
                  {isRtl ? 'إرسال البلاغ لفرق دفا الميدانية' : 'Dispatch to DEFA Volunteer Team'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
