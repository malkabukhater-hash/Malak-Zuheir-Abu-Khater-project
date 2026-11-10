import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Star,
  CheckCircle2,
  Sparkles,
  Phone,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  BookOpen,
  Award,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useEyeComfort } from '../context/EyeComfortContext';
import { SkillItem } from '../types';

export const MaharaSkillsPage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { skills, createSkillListing } = useData();
  const { currentUser } = useAuth();
  const { speakText } = useEyeComfort();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState<SkillItem | null>(null);

  // Form state
  const [titleAr, setTitleAr] = useState('');
  const [category, setCategory] = useState<SkillItem['category']>('translation');
  const [rate, setRate] = useState('أجر رمزي أو تطوعي');
  const [bioAr, setBioAr] = useState('');

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const categories = [
    { id: 'all', labelAr: 'جميع المهارات', labelEn: 'All Skills' },
    { id: 'translation', labelAr: 'ترجمة وتدقيق', labelEn: 'Translation' },
    { id: 'education', labelAr: 'تعليم وتقوية', labelEn: 'Tutoring' },
    { id: 'design', labelAr: 'تصميم وخط عربي', labelEn: 'Design & Calligraphy' },
    { id: 'crafts', labelAr: 'حرف وتطريز', labelEn: 'Crafts' },
    { id: 'tech', labelAr: 'برمجة ودعم تقني', labelEn: 'Tech Support' },
  ];

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr) return;

    await createSkillListing({
      titleAr,
      titleEn: titleAr,
      category,
      rate,
      bioAr,
      bioEn: bioAr,
      providerName: currentUser.nameAr || currentUser.name,
      neighborhood: currentUser.neighborhood || 'Deir al-Balah',
      neighborhoodAr: currentUser.neighborhoodAr || 'دير البلح',
    });

    setShowAddModal(false);
    setTitleAr('');
    setBioAr('');
  };

  const filteredSkills = skills.filter((item) => {
    const matchesSearch =
      item.titleAr.toLowerCase().includes(search.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      item.providerName.toLowerCase().includes(search.toLowerCase()) ||
      item.bioAr.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#581C87] via-[#7E22CE] to-[#183B56] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold mb-3">
            <Briefcase className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>{isRtl ? 'سوق الكفاءات وفرص العمل الكريمة' : 'Skills & Remote Opportunities'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('module.mahara.title')}</h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-xl leading-relaxed">
            {t('module.mahara.desc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#2DD4BF] text-[#183B56] font-bold text-xs shadow-md hover:bg-[#2DD4BF]/90 active:scale-95 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'اعرض مهارتك / سجّل كمستقل' : 'Offer Your Skill'}</span>
          </button>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isRtl ? 'ابحث عن مهارة: ترجمة، رياضيات، تصميم...' : 'Search skills, translation, tutoring...'}
            className="w-full ps-9 pe-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.id ? 'bg-[#581C87] text-white shadow-xs' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isRtl ? c.labelAr : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredSkills.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-white border border-purple-100 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                  <span className="text-gray-400 text-[10px]">({item.reviewsCount})</span>
                </div>
                <span className="text-[11px] text-gray-400">📍 {isRtl ? item.neighborhoodAr : item.neighborhood}</span>
              </div>

              <h3 className="font-bold text-base text-[#183B56] mb-1">
                {isRtl ? item.titleAr : item.titleEn}
              </h3>
              <span className="text-xs text-purple-700 font-semibold block mb-3">
                {item.providerName}
              </span>

              <p className="text-xs text-gray-600 bg-purple-50/50 p-3 rounded-2xl border border-purple-100/60 mb-4 leading-relaxed">
                {isRtl ? item.bioAr : item.bioEn}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.badges.map((b, i) => (
                  <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                    {b}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-500 mb-2">
                <span className="font-semibold">{isRtl ? 'الأجر المقترح:' : 'Rate:'}</span>{' '}
                <span className="font-bold text-[#581C87]">{item.rate}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
              <button
                onClick={() => setShowContactModal(item)}
                className="flex-1 py-2 rounded-xl bg-[#581C87] hover:bg-[#581C87]/90 text-white text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>{isRtl ? 'طلب الخدمة / تواصل' : 'Hire / Contact'}</span>
              </button>
              <button
                onClick={() =>
                  speakText(
                    isRtl
                      ? `${item.titleAr}. يقدمها ${item.providerName}. الأجر: ${item.rate}. نبذة: ${item.bioAr}`
                      : `${item.titleEn}. Offered by ${item.providerName}. Rate: ${item.rate}. Bio: ${item.bioEn}`,
                    isRtl ? 'ar-SA' : 'en-US'
                  )
                }
                className="p-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
                title={isRtl ? 'استمع لبيانات المستقل بصوت هادئ' : 'Listen with Soft Voice'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('request', { prefillQuery: `طلب خدمة: ${item.titleAr}`, module: 'mahara' })}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
                title={isRtl ? 'رفع مهمة مجتمعية' : 'Create Task'}
              >
                <BookOpen className="w-4 h-4 text-purple-700" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-purple-100 text-[#183B56]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base text-purple-900">{isRtl ? 'التواصل مع المهني المستقل' : 'Contact Specialist'}</h3>
              <button onClick={() => setShowContactModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-100">
                <span className="font-bold text-sm block mb-1">{showContactModal.providerName}</span>
                <span className="text-purple-700 block mb-2">{isRtl ? showContactModal.titleAr : showContactModal.titleEn}</span>
                <p className="text-gray-600 text-[11px]">{isRtl ? showContactModal.bioAr : showContactModal.bioEn}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">{isRtl ? 'الأجر المحدد:' : 'Rate:'}</span>
                  <span className="font-bold text-[#581C87]">{showContactModal.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isRtl ? 'المنطقة:' : 'Location:'}</span>
                  <span>{isRtl ? showContactModal.neighborhoodAr : showContactModal.neighborhood}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onNavigate('request', {
                      prefillQuery: `اتفاق عمل مع ${showContactModal.providerName} بخصوص ${showContactModal.titleAr}`,
                      module: 'mahara',
                    });
                    setShowContactModal(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#581C87] text-white font-bold text-xs"
                >
                  {isRtl ? 'توثيق الاتفاق في مركز الطلبات' : 'Log Agreement in Request Center'}
                </button>
                <button
                  onClick={() => setShowContactModal(null)}
                  className="w-full py-2 rounded-xl border border-gray-200 text-gray-600 text-xs hover:bg-gray-50"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-purple-100 text-[#183B56]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base text-purple-900">{isRtl ? 'إضافة مهارة جديدة' : 'Add New Skill Offering'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'عنوان الخدمة / المهارة:' : 'Skill Title:'}</label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: تدقيق لغوي وصياغة رسائل وتقارير"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'التصنيف:' : 'Category:'}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
                >
                  <option value="translation">{isRtl ? 'ترجمة وتدقيق' : 'Translation'}</option>
                  <option value="education">{isRtl ? 'تعليم وتقوية' : 'Tutoring'}</option>
                  <option value="design">{isRtl ? 'تصميم وجرافيك' : 'Design'}</option>
                  <option value="crafts">{isRtl ? 'حرف وخياطة' : 'Crafts'}</option>
                  <option value="tech">{isRtl ? 'دعم فني وتقني' : 'Tech Support'}</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'طريقة البدل أو الأجر:' : 'Rate / Terms:'}</label>
                <input
                  type="text"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="مثال: 30 شيكل للملف، أو تبادل خبرات"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'نبذة عن خبراتك ونماذج العمل:' : 'Bio & Experience:'}</label>
                <textarea
                  rows={3}
                  value={bioAr}
                  onChange={(e) => setBioAr(e.target.value)}
                  placeholder="سنوات الخبرة، الأعمال السابقة، التفرغ..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#581C87] text-white font-bold text-xs hover:bg-[#581C87]/90 transition"
              >
                {isRtl ? 'نشر المهارة في المنظومة' : 'Publish Skill Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
