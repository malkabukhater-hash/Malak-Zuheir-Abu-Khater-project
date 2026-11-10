import React, { useState } from 'react';
import {
  Droplets,
  Search,
  Clock,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Calendar,
  Info,
  ArrowRight,
  ArrowLeft,
  X,
  Truck,
  Plus,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useEyeComfort } from '../context/EyeComfortContext';

export const QatraWaterPage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { waterPoints, reportWaterIssue } = useData();
  const { currentUser } = useAuth();
  const { speakText } = useEyeComfort();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);

  // Shortage report state
  const [reportLoc, setReportLoc] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportType, setReportType] = useState('shortage');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportLoc || !reportDetails) return;

    await reportWaterIssue({
      location: reportLoc,
      details: reportDetails,
      type: reportType,
      neighborhood: currentUser.neighborhood || 'Deir al-Balah',
    });

    setReportSubmitted(true);
  };

  const filteredPoints = waterPoints.filter((pt) => {
    const matchesSearch =
      pt.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      pt.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      pt.capacityNotesAr.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || pt.type === selectedType;
    const matchesNeigh = selectedNeighborhood === 'all' || pt.neighborhood === selectedNeighborhood;
    return matchesSearch && matchesType && matchesNeigh;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#183B56] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold mb-3">
            <Droplets className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>{isRtl ? 'دليل ونقاط توزيع المياه' : 'Community Water Directory'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('module.qatra.title')}</h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl leading-relaxed">
            {t('module.qatra.desc')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('map', { filter: 'water' })}
            className="px-4 py-2.5 rounded-2xl bg-white text-[#183B56] font-bold text-xs shadow-md hover:bg-sky-50 transition flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#0284C7]" />
            <span>{isRtl ? 'عرض خريطة نقاط المياه' : 'View Water Map'}</span>
          </button>
          <button
            onClick={() => {
              setShowReportModal(true);
              setReportSubmitted(false);
              setReportLoc('');
              setReportDetails('');
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#2DD4BF] text-[#183B56] font-bold text-xs shadow-md hover:bg-[#2DD4BF]/90 transition flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isRtl ? 'إبلاغ عن انقطاع مياه' : 'Report Water Shortage'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Honest Medical & Potability Safety Notice */}
      <div className="rounded-3xl bg-sky-50 border border-sky-200 p-5 text-xs text-sky-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#0369A1] text-sm">
          <Info className="w-4 h-4 text-[#0284C7]" />
          <span>{isRtl ? 'إرشاد النقاء والسلامة الصحية للمياه' : 'Water Purity & Public Health Protocol'}</span>
        </div>
        <p className="leading-relaxed text-sky-900/90">
          {isRtl
            ? 'تنبيه صحي هام: يعتمد تصنيف محطات التحلية في منصة مدار على القياسات الميدانية (نسبة الأملاح الذائبة TDS ومستوى الكلور الحر). المنظومة لا تصدر شهادات تعقيم مخبري سريرية. ننصح جميع الأسر بغلي مياه الشرب لمدة دقيقة واحدة على الأقل عند إعداد طعام أو حليب الأطفال الرضع.'
            : 'Important Public Health Notice: Water station classifications in MADAR reflect field observations (TDS conductivity and free chlorine indicators). The platform does not certify lab-grade sterility without authorized testing kits. Boiling drinking water for at least one minute is strongly recommended for infants.'}
        </p>
      </div>

      {/* Illustrated Station & Sphere Standards Block */}
      <div className="rounded-3xl bg-white border border-sky-100 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 gap-0">
        <div className="md:col-span-5 relative min-h-[220px] bg-slate-900 overflow-hidden">
          <img
            src="/images/qatra_clean_water.jpg"
            alt={isRtl ? 'محطة تحلية مياه بالطاقة الشمسية في غزة' : 'Solar RO Desalination Station in Gaza'}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
            <span className="text-[11px] font-bold text-[#2DD4BF] uppercase tracking-wider mb-1">
              {isRtl ? 'محطات التحلية بالطاقة الشمسية' : 'Solar-Powered RO Stations'}
            </span>
            <p className="text-xs text-white/90 leading-snug">
              {isRtl
                ? 'فلاتر رملية ثلاثية، فحم نشط، وغشاء تناضح عكسي يعمل على منظومة طاقة شمسية مستقلة.'
                : '3-stage sand filter, activated carbon, and RO membranes running on off-grid solar arrays.'}
            </p>
          </div>
        </div>

        <div className="md:col-span-7 p-6 flex flex-col justify-between bg-gradient-to-br from-white to-sky-50/50">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#0284C7] uppercase tracking-wide">
                {isRtl ? 'المعايير الإنسانية الدولية (Sphere Standards)' : 'Sphere Humanitarian Standards'}
              </span>
              <button
                onClick={() =>
                  speakText(
                    isRtl
                      ? 'وفق معايير إسفير الدولية: الحد الأدنى المطلوب هو خمسة عشر لتراً للشخص الواحد يومياً للشرب والطبخ والنظافة. متوسط التوفر الحالي في غزة لا يتجاوز خمسة لترات، ومنصة مدار تعمل على رفع كفاءة التوزيع.'
                      : 'According to Sphere standards: minimum requirement is 15 liters per person per day for drinking, cooking, and hygiene. Current Gaza average is around 5 liters. MADAR optimizes distribution to close this gap.',
                    isRtl ? 'ar-SA' : 'en-US'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-[#0284C7] text-xs font-bold hover:bg-sky-200 transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'استمع بصوت هادئ' : 'Listen with Soft Voice'}</span>
              </button>
            </div>

            <h3 className="font-bold text-base text-[#183B56] mb-3">
              {isRtl ? 'حقائق إدارة أزمة المياه والتوزيع الميداني' : 'Water Crisis & Distribution Logistics'}
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="p-3 bg-white rounded-2xl border border-sky-100 shadow-2xs">
                <span className="block text-lg font-black text-[#0284C7]">15 L</span>
                <span className="text-[10px] text-gray-500 font-medium">{isRtl ? 'معيار إسفير / شخص' : 'Sphere / person'}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-amber-100 shadow-2xs">
                <span className="block text-lg font-black text-amber-600">4.8 L</span>
                <span className="text-[10px] text-gray-500 font-medium">{isRtl ? 'الواقع الميداني' : 'Field Reality'}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-teal-100 shadow-2xs">
                <span className="block text-lg font-black text-teal-600">&lt; 140 ppm</span>
                <span className="text-[10px] text-gray-500 font-medium">{isRtl ? 'أملاح محطات مدار' : 'MADAR TDS Avg'}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            {isRtl
              ? 'تلتزم محطات قطرة المسجلة بتطهير الخزانات دورياً باستخدام أقراص كلور بنسبة 0.5 ملغ/لتر للمياه المنزلية ومتابعة عدادات الديزل ومستويات شحن البطاريات الشمسية.'
              : 'Registered Qatra stations follow tank disinfection protocols with 0.5 mg/L free chlorine and monitor solar battery reserves for uninterrupted morning hours.'}
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isRtl ? 'ابحث عن محطة، صهريج، أو حي...' : 'Search station or tanker...'}
            className="w-full ps-9 pe-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedType === 'all' ? 'bg-[#183B56] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isRtl ? 'جميع النقاط' : 'All Types'}
          </button>
          <button
            onClick={() => setSelectedType('potable')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedType === 'potable' ? 'bg-[#0284C7] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isRtl ? 'مياه شرب محلاة (RO)' : 'Drinking Water'}
          </button>
          <button
            onClick={() => setSelectedType('utility')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedType === 'utility' ? 'bg-[#0F766E] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isRtl ? 'مياه استخدام منزلي' : 'Utility Water'}
          </button>
        </div>

        <select
          value={selectedNeighborhood}
          onChange={(e) => setSelectedNeighborhood(e.target.value)}
          aria-label={isRtl ? 'تصفية حسب الحي' : 'Filter by neighborhood'}
          className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white ms-auto focus:outline-hidden"
        >
          <option value="all">{isRtl ? 'كل المناطق' : 'All Neighborhoods'}</option>
          <option value="Deir al-Balah">{isRtl ? 'دير البلح' : 'Deir al-Balah'}</option>
          <option value="Khan Younis">{isRtl ? 'خان يونس' : 'Khan Younis'}</option>
          <option value="Nuseirat">{isRtl ? 'النصيرات' : 'Nuseirat'}</option>
        </select>
      </div>

      {/* Water Points Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPoints.map((pt) => (
          <div
            key={pt.id}
            className="rounded-3xl bg-white border border-sky-100 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span
                  className={`font-bold px-2.5 py-0.5 rounded-full ${
                    pt.type === 'potable' ? 'bg-sky-100 text-[#0284C7]' : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {isRtl ? pt.typeLabelAr : pt.typeLabelEn}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pt.operatingHours}</span>
                </span>
              </div>

              <h3 className="font-bold text-base text-[#183B56] mb-1">
                {isRtl ? pt.nameAr : pt.nameEn}
              </h3>
              <span className="text-xs text-gray-500 block mb-3">
                📍 {isRtl ? pt.neighborhoodAr : pt.neighborhood}
              </span>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-4 text-xs space-y-1.5">
                <div className="text-gray-700">
                  <span className="font-semibold">{isRtl ? 'ملاحظات التعبئة:' : 'Capacity Notes:'}</span>{' '}
                  {isRtl ? pt.capacityNotesAr : pt.capacityNotesEn}
                </div>
                <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-100">
                  <span className="font-bold">{isRtl ? 'ملاحظة الجودة:' : 'Quality Notice:'}</span>{' '}
                  {isRtl ? pt.waterQualityNoticeAr : pt.waterQualityNoticeEn}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400">
                {isRtl ? `توثيق: ${pt.reporter}` : `By: ${pt.reporter}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    speakText(
                      isRtl
                        ? `${pt.nameAr}. في ${pt.neighborhoodAr}. الملاحظات: ${pt.capacityNotesAr}. تنبيه الجودة: ${pt.waterQualityNoticeAr}`
                        : `${pt.nameEn}. Located in ${pt.neighborhood}. Notes: ${pt.capacityNotesEn}. Quality notice: ${pt.waterQualityNoticeEn}`,
                      isRtl ? 'ar-SA' : 'en-US'
                    )
                  }
                  className="p-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-[#0284C7] transition"
                  title={isRtl ? 'استمع لبيانات المحطة بصوت هادئ' : 'Listen with Soft Voice'}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('map', { focusLat: pt.lat, focusLng: pt.lng })}
                  className="px-3 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-semibold flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'الموقع بالخريطة' : 'Locate'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shortage Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-sky-100 text-[#183B56]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base text-[#183B56]">{isRtl ? 'رفع بلاغ انقطاع أو تلوث مياه' : 'Report Water Outage'}</h3>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#183B56]">{isRtl ? 'تم توثيق البلاغ الميداني!' : 'Report Successfully Logged!'}</h4>
                <p className="text-xs text-gray-500">
                  {isRtl
                    ? 'تم إرسال الإشعار لفرق الصيانة ومنسقي صهاريج الإغاثة في منطقتك وتم إدراجه في مركز الطلبات.'
                    : 'Dispatched to local water relief teams and added to unified request board.'}
                </p>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-[#183B56] text-white text-xs font-semibold"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'الموقع الدقيق للانقطاع:' : 'Exact Location:'}</label>
                  <input
                    type="text"
                    required
                    value={reportLoc}
                    onChange={(e) => setReportLoc(e.target.value)}
                    placeholder="مثال: مخيم 2 غرب مدرسة القدس - النصيرات"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'نوع البلاغ:' : 'Issue Type:'}</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
                  >
                    <option value="shortage">{isRtl ? 'انقطاع تام لضخ المياه' : 'Complete Supply Outage'}</option>
                    <option value="breakage">{isRtl ? 'كسر في خط الأنابيب وتسرب هدر' : 'Pipeline Rupture / Leak'}</option>
                    <option value="quality">{isRtl ? 'تغير في رائحة أو لون المياه' : 'Water Quality / Odor Issue'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'تفاصيل إضافية وعدد الأسر المتأثرة:' : 'Details & Affected Families:'}</label>
                  <textarea
                    rows={3}
                    required
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="كم يوماً استمر الانقطاع؟ هل تتوفر آبار بديلة قريبة؟"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs transition shadow-md"
                >
                  {isRtl ? 'رفع البلاغ لمنظومة قطرة' : 'Submit Outage Report'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
