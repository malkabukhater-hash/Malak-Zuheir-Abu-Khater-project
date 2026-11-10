import React, { useState } from 'react';
import {
  Wrench,
  Search,
  CheckCircle2,
  Phone,
  Star,
  Repeat,
  Sparkles,
  Calculator,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useEyeComfort } from '../context/EyeComfortContext';

export const AounRepairPage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { repairTechnicians, reusableGoods, createRequest } = useData();
  const { currentUser } = useAuth();
  const { speakText } = useEyeComfort();

  const [activeTab, setActiveTab] = useState<'technicians' | 'reusable' | 'estimator'>('technicians');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [search, setSearch] = useState('');

  // Estimator State
  const [estimatorDevice, setEstimatorDevice] = useState('inverter');
  const [estimatorIssue, setEstimatorIssue] = useState('beep');
  const [estimateResult, setEstimateResult] = useState<any>(null);

  // Request Modal State
  const [showRepairModal, setShowRepairModal] = useState<any>(null);
  const [repairDescription, setRepairDescription] = useState('');
  const [repairSubmitted, setRepairSubmitted] = useState(false);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleEstimate = () => {
    let cost = '25 - 45 ₪';
    let time = '2 - 4 ساعات';
    let note = 'تبديل ترانزستور موسفيت أو فحص كرت الحماية.';
    if (estimatorDevice === 'battery') {
      cost = '15 - 30 ₪';
      time = 'خلال نفس اليوم';
      note = 'إعادة تنشيط ومعايرة خلايا الجل وتجديد الأسيد.';
    } else if (estimatorDevice === 'tarp') {
      cost = '10 - 20 ₪ (مجاني للأسر الأشد فقراً)';
      time = 'ساعة واحدة';
      note = 'خياطة سميكة بخيوط نايلون معزولة وتركيب حلقات نحاسية.';
    } else if (estimatorDevice === 'phone') {
      cost = '20 - 40 ₪';
      time = 'يوم عمل';
      note = 'إصلاح دائرة الشحن (IC) وتبديل سوكت.';
    }

    setEstimateResult({ cost, time, note });
  };

  const handleSendRepairRequest = async () => {
    if (!repairDescription) return;
    await createRequest({
      title: `طلب صيانة: ${showRepairModal?.specialtyAr || 'صيانة عاجلة'}`,
      module: 'aoun',
      category: 'repair',
      neighborhood: showRepairModal?.neighborhood || 'Deir al-Balah',
      urgency: 'medium',
      description: repairDescription,
      assignedTo: showRepairModal?.nameAr || showRepairModal?.nameEn,
    });
    setRepairSubmitted(true);
  };

  const filteredTechs = repairTechnicians.filter((tech) => {
    const matchesSearch =
      tech.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      tech.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      tech.specialtyAr.toLowerCase().includes(search.toLowerCase());
    const matchesNeigh = selectedNeighborhood === 'all' || tech.neighborhood === selectedNeighborhood;
    return matchesSearch && matchesNeigh;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0F766E] to-[#183B56] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>{isRtl ? 'منظومة الصيانة وإعادة التدوير' : 'Repair & Reuse Ecosystem'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('module.aoun.title')}</h1>
          <p className="text-xs sm:text-sm text-teal-50 max-w-xl leading-relaxed">
            {t('module.aoun.desc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('request', { module: 'aoun' })}
            className="px-5 py-2.5 rounded-2xl bg-[#2DD4BF] text-[#183B56] font-bold text-xs shadow-md hover:bg-[#2DD4BF]/90 active:scale-95 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'طلب صيانة عاجلة' : 'Request Rapid Repair'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('technicians')}
          className={`pb-3 transition flex items-center gap-2 ${
            activeTab === 'technicians'
              ? 'border-b-2 border-[#0F766E] text-[#0F766E]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>{isRtl ? 'دليل الفنيين والورش المعتمدة' : 'Verified Technicians'}</span>
        </button>

        <button
          onClick={() => setActiveTab('reusable')}
          className={`pb-3 transition flex items-center gap-2 ${
            activeTab === 'reusable'
              ? 'border-b-2 border-[#0F766E] text-[#0F766E]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>{isRtl ? 'سوق تبادل وتبرع الأدوات المستعملة' : 'Reusable Goods Exchange'}</span>
        </button>

        <button
          onClick={() => setActiveTab('estimator')}
          className={`pb-3 transition flex items-center gap-2 ${
            activeTab === 'estimator'
              ? 'border-b-2 border-[#0F766E] text-[#0F766E]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{isRtl ? 'حاسبة التكلفة والوقت التقديري' : 'Repair Cost Estimator'}</span>
        </button>
      </div>

      {/* TAB 1: TECHNICIANS DIRECTORY */}
      {activeTab === 'technicians' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200">
            <div className="relative w-full sm:w-80">
              <Search className="absolute start-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isRtl ? 'ابحث عن تخصص: إنفرتر، بطارية، خياطة...' : 'Search specialty or technician...'}
                className="w-full ps-9 pe-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
              />
            </div>

            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white ms-auto"
            >
              <option value="all">{isRtl ? 'كل المناطق' : 'All Neighborhoods'}</option>
              <option value="Deir al-Balah">{isRtl ? 'دير البلح' : 'Deir al-Balah'}</option>
              <option value="Khan Younis">{isRtl ? 'خان يونس' : 'Khan Younis'}</option>
              <option value="Nuseirat">{isRtl ? 'النصيرات' : 'Nuseirat'}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTechs.map((tech) => (
              <div
                key={tech.id}
                className="rounded-3xl bg-white border border-gray-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>{isRtl ? 'فني موثق ميدانياً' : 'Verified Technician'}</span>
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{tech.rating}</span>
                      <span className="text-gray-400 text-[10px]">({tech.jobsCompleted})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-[#183B56] mb-1">
                    {isRtl ? tech.nameAr : tech.nameEn}
                  </h3>
                  <span className="text-xs text-[#0284C7] font-semibold block mb-3">
                    📍 {isRtl ? tech.neighborhoodAr : tech.neighborhood}
                  </span>

                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4 leading-relaxed">
                    {isRtl ? tech.specialtyAr : tech.specialtyEn}
                  </p>

                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>{isRtl ? 'متوسط الأجر:' : 'Rate:'}</span>
                      <span className="font-semibold text-gray-800">{tech.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isRtl ? 'سنوات الخبرة:' : 'Experience:'}</span>
                      <span className="font-semibold text-gray-800">{tech.experienceYears} {isRtl ? 'سنوات' : 'years'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowRepairModal(tech);
                      setRepairSubmitted(false);
                      setRepairDescription('');
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0F766E]/90 text-white text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <span>{isRtl ? 'إرسال طلب إصلاح' : 'Send Repair Ticket'}</span>
                  </button>
                  <button
                    onClick={() =>
                      speakText(
                        isRtl
                          ? `الفني ${tech.nameAr}. في ${tech.neighborhoodAr}. التخصص: ${tech.specialtyAr}. متوسط الأجر: ${tech.hourlyRate}. سنوات الخبرة: ${tech.experienceYears} سنوات.`
                          : `Technician ${tech.nameEn}. Located in ${tech.neighborhood}. Specialty: ${tech.specialtyEn}. Rate: ${tech.hourlyRate}. Experience: ${tech.experienceYears} years.`,
                        isRtl ? 'ar-SA' : 'en-US'
                      )
                    }
                    className="p-2 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 transition"
                    title={isRtl ? 'استمع لبيانات الفني بصوت هادئ' : 'Listen with Soft Voice'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <a
                    href={`tel:${tech.phone}`}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
                    title={tech.phone}
                  >
                    <Phone className="w-4 h-4 text-teal-600" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: REUSABLE GOODS EXCHANGE (سوق التبادل والتبرع) */}
      {activeTab === 'reusable' && (
        <div className="space-y-6">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-xs text-teal-900">
            <span>
              {isRtl
                ? 'مبادرة تدوير الموارد: تبرع بالأدوات والقطع الفائضة عن حاجتك أو قايضها بما يلزم خيمتك دون أي تكلفة مالية.'
                : 'Community Barter: Donate or exchange spare tools, solar wires, and hardware with neighbors for zero financial burden.'}
            </span>
            <button
              onClick={() => onNavigate('request', { module: 'aoun', prefillQuery: 'عرض قطعة مستعملة للتبادل' })}
              className="px-3 py-1.5 rounded-xl bg-teal-800 text-white font-bold shrink-0"
            >
              {isRtl ? 'عرض أداة للتبادل' : 'List Item'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reusableGoods.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.exchangeType === 'donation' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.exchangeTypeLabelAr}
                    </span>
                    <span className="text-xs text-gray-400">📍 {isRtl ? item.neighborhoodAr : item.neighborhood}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#183B56] mb-2">{isRtl ? item.titleAr : item.titleEn}</h3>
                  <p className="text-xs text-gray-500 mb-3">{isRtl ? 'الحالة:' : 'Condition:'} {item.condition}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">{isRtl ? 'صاحب الغرض:' : 'Owner:'} {item.ownerName}</span>
                  <button
                    onClick={() => onNavigate('request', { prefillQuery: `طلب الحصول على: ${item.titleAr}`, module: 'aoun' })}
                    className="px-3 py-1.5 rounded-xl bg-[#183B56] text-white font-semibold"
                  >
                    {isRtl ? 'طلب استلام' : 'Claim Item'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ESTIMATOR TOOL */}
      {activeTab === 'estimator' && (
        <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
          <div className="text-center mb-4">
            <h3 className="font-bold text-base text-[#183B56]">{isRtl ? 'حاسبة التكلفة التقديرية للإصلاح' : 'Repair Cost Estimator'}</h3>
            <p className="text-gray-500">{isRtl ? 'احصل على مؤشر شفاف للتكلفة ووقت الإنجاز المعتاد قبل الذهاب للورشة' : 'Get transparent baseline expectations before visiting technician'}</p>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'نوع الجهاز أو القطعة:' : 'Device Type:'}</label>
            <select
              value={estimatorDevice}
              onChange={(e) => setEstimatorDevice(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
            >
              <option value="inverter">{isRtl ? 'إنفرتر طاقة شمسية (موجة نقية أو معدلة)' : 'Solar Inverter'}</option>
              <option value="battery">{isRtl ? 'بطارية جل أو ليثيوم' : 'Battery (Gel / Lithium)'}</option>
              <option value="tarp">{isRtl ? 'شادر خيمة ممزق بحاجة لخياطة وتدعيم' : 'Canvas / Tarp Stitching'}</option>
              <option value="phone">{isRtl ? 'هاتف محمول / لوحة شحن' : 'Mobile Phone Charging Board'}</option>
            </select>
          </div>

          <button
            onClick={handleEstimate}
            className="w-full py-2.5 rounded-xl bg-[#0F766E] text-white font-bold transition hover:bg-[#0F766E]/90"
          >
            {isRtl ? 'حساب التقدير المبدئي' : 'Calculate Estimate'}
          </button>

          {estimateResult && (
            <div className="bg-[#F0FDF4] border border-teal-200 p-4 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex justify-between font-bold text-teal-900">
                <span>{isRtl ? 'التكلفة التقديرية:' : 'Estimated Cost:'}</span>
                <span className="text-[#0F766E] text-sm">{estimateResult.cost}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{isRtl ? 'الوقت المتوقع للجاهزية:' : 'Turnaround Time:'}</span>
                <span>{estimateResult.time}</span>
              </div>
              <p className="text-gray-500 text-[11px] pt-2 border-t border-teal-100">
                {estimateResult.note}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Repair Ticket Modal */}
      {showRepairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-sky-100 text-[#183B56]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base">{isRtl ? 'إرسال طلب صيانة' : 'Request Repair'}</h3>
              <button onClick={() => setShowRepairModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {repairSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#183B56]">{isRtl ? 'تم إرسال طلب الصيانة!' : 'Ticket Dispatched!'}</h4>
                <p className="text-xs text-gray-500">
                  {isRtl
                    ? `تم توجيه الطلب إلى ${showRepairModal.nameAr}. سيتم التواصل معك عبر رقم هاتفك أو يمكنك متابعة الطلب من لوحة التحكم.`
                    : `Dispatched to ${showRepairModal.nameEn}. You can track status in your dashboard.`}
                </p>
                <button
                  onClick={() => setShowRepairModal(null)}
                  className="mt-4 px-6 py-2 rounded-xl bg-[#183B56] text-white text-xs font-semibold"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-teal-50 p-3 rounded-2xl text-teal-900">
                  <span className="font-bold block">{isRtl ? showRepairModal.nameAr : showRepairModal.nameEn}</span>
                  <span className="text-[11px] text-teal-700">{isRtl ? showRepairModal.specialtyAr : showRepairModal.specialtyEn}</span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'وصف العطل أو المشكلة بدقة:' : 'Describe the Issue:'}</label>
                  <textarea
                    rows={4}
                    required
                    value={repairDescription}
                    onChange={(e) => setRepairDescription(e.target.value)}
                    placeholder="مثال: الإنفرتر يطلق صفارة تحذيرية ويتوقف عن إمداد الكهرباء بعد 5 دقائق من التشغيل..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0F766E]"
                  />
                </div>

                <button
                  onClick={handleSendRepairRequest}
                  disabled={!repairDescription.trim()}
                  className="w-full py-3 rounded-xl bg-[#0F766E] disabled:opacity-50 text-white font-bold text-xs hover:bg-[#0F766E]/90 transition"
                >
                  {isRtl ? 'تأكيد وإرسال للفني' : 'Send Ticket to Technician'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
