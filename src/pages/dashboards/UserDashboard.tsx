import React, { useState } from 'react';
import {
  User,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Wrench,
  Droplets,
  Plus,
  Edit3,
  ShieldCheck,
  Sparkles,
  Save,
  RotateCcw,
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth, malakDefaultUser } from '../../context/AuthContext';

export const UserDashboard: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { requests } = useData();
  const { currentUser, updateProfile, resetToMalak } = useAuth();

  // Profile Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNameAr, setEditNameAr] = useState(currentUser.nameAr || 'ملاك أبو خاطر');
  const [editNameEn, setEditNameEn] = useState(currentUser.name || 'Malak Abu Khater');
  const [editTitleAr, setEditTitleAr] = useState(currentUser.titleAr || 'مؤسس وصاحب منظومة مَدَار');
  const [editTitleEn, setEditTitleEn] = useState(currentUser.titleEn || 'Founder & Brand Owner of MADAR');
  const [editEmail, setEditEmail] = useState(currentUser.email || 'malkabukhater@gmail.com');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '+970 59-900-1122');
  const [editNeighborhoodAr, setEditNeighborhoodAr] = useState(currentUser.neighborhoodAr || 'دير البلح - الوسطى');
  const [editNeighborhoodEn, setEditNeighborhoodEn] = useState(currentUser.neighborhood || 'Deir al-Balah');
  const [editBioAr, setEditBioAr] = useState(currentUser.bioAr || 'المؤسس والمشرف العام على منظومة مدار للتكنولوجيا المجتمعية.');
  const [editBioEn, setEditBioEn] = useState(currentUser.bioEn || 'Founder & Architect of MADAR Community Platform in Gaza.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editNameEn,
      nameAr: editNameAr,
      titleAr: editTitleAr,
      titleEn: editTitleEn,
      email: editEmail,
      phone: editPhone,
      neighborhood: editNeighborhoodEn,
      neighborhoodAr: editNeighborhoodAr,
      bioAr: editBioAr,
      bioEn: editBioEn,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowEditModal(false);
    }, 1200);
  };

  const handleResetDefaults = () => {
    resetToMalak();
    setEditNameAr(malakDefaultUser.nameAr!);
    setEditNameEn(malakDefaultUser.name);
    setEditTitleAr(malakDefaultUser.titleAr!);
    setEditTitleEn(malakDefaultUser.titleEn!);
    setEditEmail(malakDefaultUser.email);
    setEditPhone(malakDefaultUser.phone!);
    setEditNeighborhoodAr(malakDefaultUser.neighborhoodAr!);
    setEditNeighborhoodEn(malakDefaultUser.neighborhood);
    setEditBioAr(malakDefaultUser.bioAr!);
    setEditBioEn(malakDefaultUser.bioEn!);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowEditModal(false);
    }, 1000);
  };

  const myRequests = requests.filter(
    (r) =>
      r.requesterName.toLowerCase().includes('malak') ||
      r.requesterName.includes('ملاك') ||
      r.requesterName.includes(currentUser.name) ||
      r.requesterRole === 'resident' ||
      r.requesterRole === 'admin'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 end-0 -mt-6 -me-6 w-44 h-44 bg-[#A9DDF5]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Avatar Badge with Arabic 'م' */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#183B56] via-[#0284C7] to-[#2DD4BF] text-white flex items-center justify-center font-black text-3xl shadow-md shrink-0 border-2 border-white">
              {isRtl ? 'م' : 'M'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#183B56]">
                  {isRtl ? currentUser.nameAr || 'ملاك أبو خاطر' : currentUser.name || 'Malak Abu Khater'}
                </h1>
                <span className="text-[11px] bg-gradient-to-r from-teal-50 to-sky-50 text-teal-800 border border-teal-200 px-3 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isRtl ? 'المؤسس وصاحب المنظومة' : 'Founder & Brand Owner'}</span>
                </span>
              </div>

              {/* Bilingual Subtitle */}
              <p className="text-xs font-semibold text-[#0284C7]">
                {isRtl
                  ? (currentUser.titleAr || 'مؤسس وصاحب منظومة مَدَار') + ' • ' + (currentUser.name || 'Malak Abu Khater')
                  : (currentUser.titleEn || 'Founder & Brand Owner of MADAR') + ' • ' + (currentUser.nameAr || 'ملاك أبو خاطر')}
              </p>

              {/* Contact info details */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{currentUser.email}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{isRtl ? currentUser.neighborhoodAr : currentUser.neighborhood}</span>
                </span>
                {currentUser.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{currentUser.phone}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setEditNameAr(currentUser.nameAr || 'ملاك أبو خاطر');
                setEditNameEn(currentUser.name || 'Malak Abu Khater');
                setEditTitleAr(currentUser.titleAr || 'مؤسس وصاحب منظومة مَدَار');
                setEditTitleEn(currentUser.titleEn || 'Founder & Brand Owner of MADAR');
                setEditEmail(currentUser.email || 'malkabukhater@gmail.com');
                setEditPhone(currentUser.phone || '+970 59-900-1122');
                setEditNeighborhoodAr(currentUser.neighborhoodAr || 'دير البلح - الوسطى');
                setEditNeighborhoodEn(currentUser.neighborhood || 'Deir al-Balah');
                setShowEditModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white border border-sky-200 hover:bg-sky-50 text-[#183B56] font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4 text-[#0284C7]" />
              <span>{isRtl ? 'تعديل بياناتي (عربي / English)' : 'Edit Profile (AR / EN)'}</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard-admin')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#183B56] to-[#0284C7] hover:opacity-95 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
              <span>{isRtl ? 'لوحة تحكم المشرف العام' : 'Superadmin Portal'}</span>
            </button>

            <button
              onClick={() => onNavigate('request')}
              className="px-4 py-2.5 rounded-2xl bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#183B56] font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t('req.newTicket')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Personalized Founder & Household Overview Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#F0F9FF] to-[#D9F1FC]/40 border border-sky-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-start">
          <h2 className="font-bold text-base text-[#183B56]">
            {isRtl ? 'أهلاً بك يا ملاك في مركز التحكم المجتمعي' : 'Welcome back, Malak, to your Command Center'}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
            {isRtl
              ? 'تتيح لك هذه اللوحة متابعة طلباتك الشخصية، إدارة مبادرات الإيواء والمياه، والإشراف الميداني على حركة الصيانة وسوق واصل في قطاع غزة.'
              : 'Monitor your personal tickets, oversee water and shelter operations, and manage mutual aid workflows across Gaza.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('request')}
            className="px-4 py-2 rounded-xl bg-[#183B56] text-white text-xs font-bold hover:bg-[#183B56]/90 transition"
          >
            {isRtl ? 'إرسال طلب جديد' : 'New Request'}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-[#0284C7] block mb-1">{myRequests.length}</span>
          <span className="text-xs text-gray-600">{isRtl ? 'إجمالي الطلبات تحت إشرافي' : 'Managed Requests'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-amber-600 block mb-1">
            {myRequests.filter((r) => r.status !== 'Completed').length}
          </span>
          <span className="text-xs text-gray-600">{isRtl ? 'حالات جارية المتابعة' : 'In-Progress Tasks'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-emerald-600 block mb-1">
            {myRequests.filter((r) => r.status === 'Completed').length}
          </span>
          <span className="text-xs text-gray-600">{isRtl ? 'تدخلات مكتملة بنجاح' : 'Completed Cases'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-purple-600 block mb-1">5</span>
          <span className="text-xs text-gray-600">{isRtl ? 'الوحدات الميدانية المفعلة' : 'Active Modules'}</span>
        </div>
      </div>

      {/* Requests Management List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-[#183B56]">
            {isRtl ? 'سجل الطلبات المجتمعية المفتوحة' : 'Active Community Tickets'}
          </h2>
          <span className="text-xs text-gray-500">
            {isRtl ? `عرض ${myRequests.length} طلب` : `Showing ${myRequests.length} items`}
          </span>
        </div>

        {myRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center text-xs text-gray-400">
            {isRtl ? 'لا توجد طلبات مسجلة بعد.' : 'No requests logged yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-sky-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#183B56]">{req.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-[#0284C7]">
                      {req.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {isRtl ? `أولوية: ${req.urgencyScore}%` : `Score: ${req.urgencyScore}%`}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{req.description}</p>
                  <div className="text-[11px] text-gray-400 flex items-center gap-3 pt-1">
                    <span>📅 {new Date(req.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
                    <span>•</span>
                    <span>📍 {req.neighborhoodAr || req.neighborhood}</span>
                    <span>•</span>
                    <span className="text-[#0284C7] font-semibold">{req.module.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigate('request', { viewId: req.id })}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#183B56] font-bold transition"
                  >
                    {isRtl ? 'عرض الخطوات الميدانية' : 'View Timeline'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-sky-100 text-[#183B56] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#D9F1FC] text-[#0284C7] rounded-2xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#183B56]">
                    {isRtl ? 'تعديل الملف الشخصي (عربي وإنجليزي)' : 'Edit Profile (Arabic & English)'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isRtl ? 'تحديث الاسم الرسمي والصفة وبيانات الاتصال للمؤسس' : 'Update Founder name, title, and contact coordinates'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center gap-2 text-teal-800 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>{isRtl ? 'تم حفظ التعديلات بنجاح!' : 'Profile updated successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Names in Arabic and English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {isRtl ? 'الاسم باللغة العربية:' : 'Name (Arabic):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editNameAr}
                    onChange={(e) => setEditNameAr(e.target.value)}
                    placeholder="ملاك أبو خاطر"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {isRtl ? 'الاسم باللغة الإنجليزية:' : 'Name (English):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    placeholder="Malak Abu Khater"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>
              </div>

              {/* Titles in Arabic and English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {isRtl ? 'المسمى / الصفة بالعربية:' : 'Title (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={editTitleAr}
                    onChange={(e) => setEditTitleAr(e.target.value)}
                    placeholder="مؤسس وصاحب منظومة مَدَار"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {isRtl ? 'المسمى / الصفة بالإنجليزية:' : 'Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={editTitleEn}
                    onChange={(e) => setEditTitleEn(e.target.value)}
                    placeholder="Founder & Brand Owner of MADAR"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="malkabukhater@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {isRtl ? 'رقم الهاتف للتواصل الميداني:' : 'Phone Number:'}
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+970 59-900-1122"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>
              </div>

              {/* Neighborhood in Arabic & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {isRtl ? 'المنطقة أو الحي بالعربية:' : 'Neighborhood (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={editNeighborhoodAr}
                    onChange={(e) => setEditNeighborhoodAr(e.target.value)}
                    placeholder="دير البلح - الوسطى"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {isRtl ? 'المنطقة بالإنجليزية:' : 'Neighborhood (English):'}
                  </label>
                  <input
                    type="text"
                    value={editNeighborhoodEn}
                    onChange={(e) => setEditNeighborhoodEn(e.target.value)}
                    placeholder="Deir al-Balah"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-100 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'استعادة بيانات ملاك الافتراضية' : 'Reset to Default Malak Profile'}</span>
                </button>

                <div className="flex items-center gap-2 ms-auto">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#183B56] to-[#0284C7] hover:opacity-95 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isRtl ? 'حفظ التعديلات' : 'Save Profile'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
