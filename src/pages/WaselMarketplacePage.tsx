import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Users,
  Sparkles,
  Plus,
  Phone,
  Tag,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useEyeComfort } from '../context/EyeComfortContext';
import { MarketplaceItem } from '../types';

export const WaselMarketplacePage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { marketplaceItems, groupPurchases, joinGroupBuy, createMarketplaceItem } = useData();
  const { currentUser } = useAuth();
  const { speakText } = useEyeComfort();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState<MarketplaceItem | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Form State for Add Product
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newPrice, setNewPrice] = useState('50');
  const [newCategory, setNewCategory] = useState<MarketplaceItem['category']>('solar');
  const [newNeighborhood, setNewNeighborhood] = useState('Deir al-Balah');
  const [newDescAr, setNewDescAr] = useState('');
  const [newAlternatives, setNewAlternatives] = useState('');

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const categories = [
    { id: 'all', labelAr: 'جميع المعروضات', labelEn: 'All Listings' },
    { id: 'solar', labelAr: 'الطاقة والبطاريات', labelEn: 'Solar & Power' },
    { id: 'water-tools', labelAr: 'مستلزمات المياه', labelEn: 'Water Storage' },
    { id: 'shelter', labelAr: 'الشوادر والإيواء', labelEn: 'Tarps & Shelter' },
    { id: 'cooking', labelAr: 'المواقد والطهي', labelEn: 'Cooking & Stoves' },
  ];

  const neighborhoods = [
    { id: 'all', labelAr: 'كل المناطق', labelEn: 'All Neighborhoods' },
    { id: 'Deir al-Balah', labelAr: 'دير البلح', labelEn: 'Deir al-Balah' },
    { id: 'Khan Younis', labelAr: 'خان يونس', labelEn: 'Khan Younis' },
    { id: 'Nuseirat', labelAr: 'النصيرات', labelEn: 'Nuseirat' },
    { id: 'Zawayda', labelAr: 'الزوايدة', labelEn: 'Zawayda' },
  ];

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesSearch =
      item.titleAr.toLowerCase().includes(search.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      item.descriptionAr.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesNeighborhood = selectedNeighborhood === 'all' || item.neighborhood === selectedNeighborhood;
    return matchesSearch && matchesCategory && matchesNeighborhood;
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr) return;

    await createMarketplaceItem({
      titleAr: newTitleAr,
      titleEn: newTitleEn || newTitleAr,
      price: parseFloat(newPrice) || 50,
      currency: 'ILS',
      category: newCategory,
      neighborhood: newNeighborhood,
      neighborhoodAr: newNeighborhood === 'Khan Younis' ? 'خان يونس' : 'دير البلح',
      descriptionAr: newDescAr,
      descriptionEn: newDescAr,
      merchantId: currentUser.id,
      merchantName: currentUser.nameAr || currentUser.name,
      alternatives: newAlternatives ? newAlternatives.split(',').map((s) => s.trim()) : [],
    });

    setShowAddModal(false);
    setNewTitleAr('');
    setNewDescAr('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#183B56] to-[#0284C7] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#A9DDF5] text-xs font-bold mb-3">
            <ShoppingBag className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>{isRtl ? 'سوق مدار المجتمعي التكافلي' : 'MADAR Local Marketplace'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('module.wasel.title')}</h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
            {t('module.wasel.desc')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#2DD4BF] text-[#183B56] font-bold text-xs shadow-md hover:bg-[#2DD4BF]/90 active:scale-95 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'تسجيل تاجر / إضافة صنف' : 'Add Item / Merchant'}</span>
          </button>
        </div>
      </div>

      {/* 2. Group Purchasing Pools Section (الشراء الجماعي لخفض الأسعار) */}
      <div className="rounded-3xl bg-gradient-to-br from-[#F0F9FF] to-[#D9F1FC]/40 border border-sky-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0284C7] text-white rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#183B56]">
                {isRtl ? 'عروض الشراء الجماعي التكافلي' : 'Active Collective Purchase Pools'}
              </h2>
              <span className="text-xs text-gray-500">
                {isRtl ? 'نجمع الطلبات في الحي لنحصل على خصم الجملة ونوفر تكلفة النقل' : 'Pool local neighborhood orders to unlock bulk merchant discounts'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupPurchases.map((grp) => {
            const progress = Math.min(100, Math.round((grp.currentQty / grp.targetQty) * 100));
            return (
              <div key={grp.id} className="rounded-2xl bg-white border border-sky-100 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                      {isRtl ? `وفر ${grp.savingsPercent}%` : `Save ${grp.savingsPercent}%`}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isRtl ? grp.neighborhoodAr : grp.neighborhood}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#183B56] mb-2">
                    {isRtl ? grp.titleAr : grp.titleEn}
                  </h3>

                  <div className="flex items-center gap-3 text-xs mb-3">
                    <span className="text-teal-700 font-extrabold text-base">{grp.unitPrice} ₪</span>
                    <span className="line-through text-gray-400">{grp.regularPrice} ₪</span>
                    <span className="text-gray-500 text-[11px]">
                      ({isRtl ? `${grp.currentQty} من ${grp.targetQty} حجزوا` : `${grp.currentQty} of ${grp.targetQty} joined`})
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-3">
                    <div className="bg-[#0284C7] h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">
                    {grp.status === 'fulfilled'
                      ? (isRtl ? 'اكتمل النصاب وجاري التوريد' : 'Fulfilled - Dispatching')
                      : (isRtl ? `متبقي ${grp.targetQty - grp.currentQty} طلب لاكتمال الدفعة` : `${grp.targetQty - grp.currentQty} needed to complete`)}
                  </span>
                  <button
                    onClick={() => joinGroupBuy(grp.id, 1)}
                    disabled={grp.status === 'fulfilled'}
                    className="px-3 py-1.5 rounded-xl bg-[#183B56] hover:bg-[#183B56]/90 disabled:opacity-50 text-white text-xs font-semibold transition"
                  >
                    {t('btn.joinGroupBuy')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Search and Filters Bar */}
      <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Field */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute start-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRtl ? 'ابحث عن صنف أو بديل متاح...' : 'Search supplies or alternatives...'}
              className="w-full ps-9 pe-3 py-2 rounded-xl border border-gray-200 text-xs text-[#183B56] focus:outline-hidden focus:border-[#0284C7]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === c.id
                    ? 'bg-[#183B56] text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isRtl ? c.labelAr : c.labelEn}
              </button>
            ))}
          </div>

          {/* Neighborhood filter */}
          <div className="w-full sm:w-auto ms-auto">
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              aria-label={isRtl ? 'تصفية حسب المنطقة' : 'Filter by neighborhood'}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:outline-hidden"
            >
              {neighborhoods.map((n) => (
                <option key={n.id} value={n.id}>
                  {isRtl ? n.labelAr : n.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-white border border-gray-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Top verification & stock */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'توفر مؤكد ميدانياً' : 'Verified Available'}</span>
                </span>
                <span className="text-[11px] text-gray-400">
                  {isRtl ? `الكمية: ${item.availableQty}` : `Stock: ${item.availableQty}`}
                </span>
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-sm text-[#183B56] leading-snug">
                  {isRtl ? item.titleAr : item.titleEn}
                </h3>
                <span className="font-black text-base text-[#0284C7] shrink-0">
                  {item.price} {item.currency === 'ILS' ? '₪' : '$'}
                </span>
              </div>

              {/* Neighborhood & Merchant */}
              <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
                <span>{item.merchantName}</span>
                <span className="text-gray-400">📍 {isRtl ? item.neighborhoodAr : item.neighborhood}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {isRtl ? item.descriptionAr : item.descriptionEn}
              </p>

              {/* Alternatives Suggestions if unavailable */}
              {item.alternatives && item.alternatives.length > 0 && (
                <div className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-100 text-[11px] text-gray-700 mb-4">
                  <span className="font-bold text-[#0284C7] block mb-1">
                    {isRtl ? 'بدائل محلية مقترحة عند نفاد الكمية:' : 'Local Alternatives:'}
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                    {item.alternatives.map((alt, i) => (
                      <li key={i}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
              <button
                onClick={() => setShowOrderModal(item)}
                className="flex-1 py-2 rounded-xl bg-[#183B56] hover:bg-[#183B56]/90 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>{isRtl ? 'حجز واستلام محلي' : 'Reserve & Pick Up'}</span>
              </button>
              <button
                onClick={() =>
                  speakText(
                    isRtl
                      ? `${item.titleAr}. السعر: ${item.price} شيكل. التوفر في ${item.neighborhoodAr}. ${item.descriptionAr}`
                      : `${item.titleEn}. Price: ${item.price} Shekels. Available in ${item.neighborhood}. ${item.descriptionEn}`,
                    isRtl ? 'ar-SA' : 'en-US'
                  )
                }
                className="p-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-[#0284C7] transition"
                title={isRtl ? 'استمع بتلاوة صوتية هادئة' : 'Listen with Soft Voice'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('request', { prefillQuery: `استفسار عن ${item.titleAr}`, module: 'wasel' })}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
                title={isRtl ? 'طلب مساعدة مجتمعية بخصوص هذا الصنف' : 'Request aid for this item'}
              >
                <Tag className="w-4 h-4 text-[#0284C7]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reservation / Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-sky-100 text-[#183B56]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base">{isRtl ? 'تأكيد حجز الصنف' : 'Reserve Item'}</h3>
              <button onClick={() => { setShowOrderModal(null); setOrderSubmitted(false); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#183B56]">{isRtl ? 'تم تأكيد طلبك بنجاح!' : 'Reservation Confirmed!'}</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  {isRtl
                    ? `تم حجز المنتج في نقطة استلام: ${showOrderModal.merchantName} (${showOrderModal.neighborhoodAr}). سيتم حفظ الصنف لمدة 24 ساعة.`
                    : `Your reservation at ${showOrderModal.merchantName} (${showOrderModal.neighborhood}) is held for 24h.`}
                </p>
                <button
                  onClick={() => { setShowOrderModal(null); setOrderSubmitted(false); }}
                  className="mt-4 px-6 py-2 rounded-xl bg-[#183B56] text-white text-xs font-semibold"
                >
                  {isRtl ? 'إغلاق ومتابعة' : 'Close'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-100">
                  <span className="font-bold block text-sm mb-1">{isRtl ? showOrderModal.titleAr : showOrderModal.titleEn}</span>
                  <div className="flex justify-between text-gray-600">
                    <span>{isRtl ? 'السعر المحدد:' : 'Price:'}</span>
                    <span className="font-black text-[#0284C7]">{showOrderModal.price} ₪</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mt-1">
                    <span>{isRtl ? 'الموقع:' : 'Location:'}</span>
                    <span>{isRtl ? showOrderModal.neighborhoodAr : showOrderModal.neighborhood}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">{isRtl ? 'اسم المستلم:' : 'Recipient Name:'}</label>
                  <input
                    type="text"
                    defaultValue={currentUser.nameAr || currentUser.name}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">{isRtl ? 'رقم الهاتف للتنسيق الميداني:' : 'Phone for coordination:'}</label>
                  <input
                    type="tel"
                    defaultValue={currentUser.phone || '+970 59-000-0000'}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <button
                  onClick={() => setOrderSubmitted(true)}
                  className="w-full py-3 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0284C7]/90 transition"
                >
                  {isRtl ? 'تأكيد الحجز بدون دفع مسبق (الدفع عند الاستلام)' : 'Confirm Reservation (Pay on Pickup)'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-sky-100 text-[#183B56] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base">{isRtl ? 'إضافة منتج أو تجهيزات جديدة' : 'Add New Marketplace Item'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'اسم الصنف بالعربية:' : 'Item Title (Arabic):'}</label>
                <input
                  type="text"
                  required
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  placeholder="مثال: شادر نايلون مقوى 4*6 متر"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'السعر بالشيكل (₪):' : 'Price (ILS):'}</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'التصنيف:' : 'Category:'}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
                  >
                    <option value="solar">{isRtl ? 'طاقة وبطاريات' : 'Solar'}</option>
                    <option value="water-tools">{isRtl ? 'مستلزمات مياه' : 'Water Tools'}</option>
                    <option value="shelter">{isRtl ? 'شوادر وإيواء' : 'Shelter'}</option>
                    <option value="cooking">{isRtl ? 'مواقد وطهي' : 'Cooking'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'المنطقة:' : 'Neighborhood:'}</label>
                <select
                  value={newNeighborhood}
                  onChange={(e) => setNewNeighborhood(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
                >
                  <option value="Deir al-Balah">دير البلح</option>
                  <option value="Khan Younis">خان يونس</option>
                  <option value="Nuseirat">النصيرات</option>
                  <option value="Zawayda">الزوايدة</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'الوصف وتفاصيل التوفر:' : 'Description:'}</label>
                <textarea
                  rows={3}
                  value={newDescAr}
                  onChange={(e) => setNewDescAr(e.target.value)}
                  placeholder="مواصفات الصنف ومكان الاستلام والكمية المتوفرة..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {isRtl ? 'بدائل مقترحة (مفصولة بفواصل):' : 'Alternatives (comma separated):'}
                </label>
                <input
                  type="text"
                  value={newAlternatives}
                  onChange={(e) => setNewAlternatives(e.target.value)}
                  placeholder="مثال: رول بلاستيك دفيئات، بطارية دراجة"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#183B56] text-white font-bold text-xs hover:bg-[#183B56]/90 transition"
              >
                {isRtl ? 'نشر الصنف في واصل' : 'Publish Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
