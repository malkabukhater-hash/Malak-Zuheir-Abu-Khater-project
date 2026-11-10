import React, { useState } from 'react';
import {
  MapPin,
  Droplets,
  Home,
  Wrench,
  ShoppingBag,
  Filter,
  Layers,
  Clock,
  ShieldCheck,
  Navigation,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const CommunityMapPage: React.FC<{ onNavigate: (page: string, params?: any) => void; initialFilter?: string }> = ({
  onNavigate,
  initialFilter,
}) => {
  const { isRtl, t } = useLanguage();
  const { waterPoints, repairTechnicians, marketplaceItems } = useData();

  const [filterType, setFilterType] = useState<string>(initialFilter || 'all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedPoint, setSelectedPoint] = useState<any>(waterPoints[0] || null);

  const zones = [
    { id: 'all', nameAr: 'كل قطاع غزة', nameEn: 'All Gaza Sectors' },
    { id: 'Deir al-Balah', nameAr: 'دير البلح والوسطى', nameEn: 'Deir al-Balah & Central' },
    { id: 'Khan Younis', nameAr: 'خان يونس والمواصي', nameEn: 'Khan Younis & Mawasi' },
    { id: 'Nuseirat', nameAr: 'مخيم النصيرات', nameEn: 'Nuseirat Camp' },
    { id: 'Zawayda', nameAr: 'الزوايدة', nameEn: 'Al-Zawayda' },
    { id: 'Gaza City', nameAr: 'مدينة غزة والشمال', nameEn: 'Gaza City' },
  ];

  // Aggregate map markers
  const markers = [
    ...waterPoints.map((w) => ({
      id: w.id,
      title: isRtl ? w.nameAr : w.nameEn,
      category: 'water',
      typeLabel: isRtl ? w.typeLabelAr : w.typeLabelEn,
      neighborhood: w.neighborhood,
      neighborhoodAr: w.neighborhoodAr,
      hours: w.operatingHours,
      details: isRtl ? w.capacityNotesAr : w.capacityNotesEn,
      quality: isRtl ? w.waterQualityNoticeAr : w.waterQualityNoticeEn,
      x: w.neighborhood === 'Deir al-Balah' ? 48 : w.neighborhood === 'Khan Younis' ? 68 : 38,
      y: w.neighborhood === 'Deir al-Balah' ? 44 : w.neighborhood === 'Khan Younis' ? 65 : 35,
      color: 'bg-sky-500',
    })),
    ...repairTechnicians.map((r) => ({
      id: r.id,
      title: isRtl ? r.nameAr : r.nameEn,
      category: 'repair',
      typeLabel: isRtl ? r.specialtyAr : r.specialtyEn,
      neighborhood: r.neighborhood,
      neighborhoodAr: r.neighborhoodAr,
      hours: '08:00 - 17:00',
      details: isRtl ? `هاتف: ${r.phone}` : `Phone: ${r.phone}`,
      x: r.neighborhood === 'Deir al-Balah' ? 52 : r.neighborhood === 'Khan Younis' ? 64 : 42,
      y: r.neighborhood === 'Deir al-Balah' ? 48 : r.neighborhood === 'Khan Younis' ? 70 : 38,
      color: 'bg-teal-500',
    })),
  ];

  const filteredMarkers = markers.filter((m) => {
    const matchType = filterType === 'all' || m.category === filterType;
    const matchNeigh = selectedNeighborhood === 'all' || m.neighborhood === selectedNeighborhood;
    return matchType && matchNeigh;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#183B56] to-[#0284C7] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#A9DDF5] text-xs font-bold mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>{isRtl ? 'خريطة الخدمات المجتمعية خفيفة البيانات' : 'Zero-Bandwidth Community Map'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('nav.map')}</h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
            {isRtl
              ? 'تصفح مواقع محطات التحلية وصهاريج المياه وورش الصيانة ومخازن الإيواء في دير البلح وخانيونس والوسطى دون استهلاك باقات الإنترنت.'
              : 'Vector-drawn interactive directory mapping desalination stations, repair hubs, and shelter depots optimized for low-bandwidth networks.'}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Layer Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
              filterType === 'all' ? 'bg-[#183B56] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isRtl ? 'جميع النقاط' : 'All Locations'}
          </button>
          <button
            onClick={() => setFilterType('water')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filterType === 'water' ? 'bg-[#0284C7] text-white' : 'bg-sky-50 text-[#0284C7]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{isRtl ? 'محطات وصهاريج المياه' : 'Water Points'}</span>
          </button>
          <button
            onClick={() => setFilterType('repair')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filterType === 'repair' ? 'bg-[#0F766E] text-white' : 'bg-teal-50 text-[#0F766E]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isRtl ? 'ورش الصيانة (عون)' : 'Repair Shops'}</span>
          </button>
        </div>

        {/* Neighborhood selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-500">{isRtl ? 'المنطقة:' : 'Sector:'}</span>
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="p-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {isRtl ? z.nameAr : z.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Layout: Vector Interactive Grid + Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vector SVG Map Container */}
        <div className="lg:col-span-2 bg-[#F0F9FF] rounded-3xl border border-sky-200 p-6 shadow-xs relative overflow-hidden min-h-[460px] flex flex-col justify-between">
          {/* Stylized Gaza Strip Coastal Map representation */}
          <div className="relative w-full h-[380px] bg-sky-100/60 rounded-2xl border border-sky-200 overflow-hidden">
            {/* Sea Indicator */}
            <div className="absolute top-4 start-4 text-xs font-bold text-sky-400">
              🌊 {isRtl ? 'البحر الأبيض المتوسط' : 'Mediterranean Coast'}
            </div>

            {/* Stylized Coastal Strip Polygon */}
            <svg className="w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 15 5 L 35 25 L 50 45 L 70 70 L 85 95 L 95 95 L 85 60 L 65 30 L 45 10 Z"
                fill="#D9F1FC"
                stroke="#0284C7"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            </svg>

            {/* Neighborhood Labels */}
            <div className="absolute top-[20%] start-[32%] text-[10px] font-black text-gray-500 uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded-sm">
              {isRtl ? 'مدينة غزة' : 'Gaza City'}
            </div>
            <div className="absolute top-[35%] start-[40%] text-[10px] font-black text-gray-500 uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded-sm">
              {isRtl ? 'النصيرات' : 'Nuseirat'}
            </div>
            <div className="absolute top-[48%] start-[50%] text-[10px] font-black text-[#0284C7] uppercase tracking-wider bg-sky-100 px-2 py-0.5 rounded-md font-bold">
              {isRtl ? 'دير البلح' : 'Deir al-Balah'}
            </div>
            <div className="absolute top-[68%] start-[66%] text-[10px] font-black text-teal-800 uppercase tracking-wider bg-teal-100 px-2 py-0.5 rounded-md font-bold">
              {isRtl ? 'خان يونس والمواصي' : 'Khan Younis'}
            </div>

            {/* Interactive Markers */}
            {filteredMarkers.map((marker) => {
              const isSelected = selectedPoint?.id === marker.id;
              return (
                <button
                  key={marker.id}
                  onClick={() => setSelectedPoint(marker)}
                  style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full shadow-lg transition-transform hover:scale-125 focus:outline-hidden ${
                    isSelected ? 'ring-4 ring-[#183B56] scale-125 z-20' : 'z-10'
                  } ${marker.color} text-white`}
                  title={marker.title}
                >
                  {marker.category === 'water' ? (
                    <Droplets className="w-3.5 h-3.5" />
                  ) : (
                    <Wrench className="w-3.5 h-3.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>{isRtl ? 'اضغط على أي علامة في الخريطة لعرض ساعات العمل والمواعيد' : 'Tap any point on the map to review operating hours and contact'}</span>
            <span className="font-semibold text-[#0284C7]">
              {filteredMarkers.length} {isRtl ? 'نقطة معروضة' : 'points shown'}
            </span>
          </div>
        </div>

        {/* Selected Marker Details Drawer */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          {selectedPoint ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-sky-100 text-[#0284C7]">
                  {selectedPoint.typeLabel || selectedPoint.category}
                </span>
                <span className="text-[11px] text-gray-400">ID: #{selectedPoint.id}</span>
              </div>

              <h3 className="font-bold text-lg text-[#183B56] leading-snug">
                {selectedPoint.title}
              </h3>

              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0284C7]" />
                  <span>{selectedPoint.neighborhoodAr || selectedPoint.neighborhood}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{selectedPoint.hours}</span>
                </div>
              </div>

              <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100 leading-relaxed">
                {selectedPoint.details}
              </p>

              {selectedPoint.quality && (
                <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <span className="font-bold">{isRtl ? 'تنبيه الجودة:' : 'Quality Notice:'}</span>{' '}
                  {selectedPoint.quality}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('request', { prefillQuery: `استفسار عن موقع: ${selectedPoint.title}` })}
                  className="w-full py-2.5 rounded-xl bg-[#183B56] hover:bg-[#183B56]/90 text-white font-bold text-xs transition"
                >
                  {isRtl ? 'تقديم بلاغ أو استفسار عن هذه النقطة' : 'Report / Inquire on Location'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <span>{isRtl ? 'حدد نقطة على الخريطة لعرض التفاصيل' : 'Select a location on the map'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
