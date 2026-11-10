import React, { useState } from 'react';
import { UserCheck, Shield, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { login, currentUser, isGoogleConnected, googleUser, signInWithGoogle, logoutGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('resident');
  const [neighborhood, setNeighborhood] = useState('Deir al-Balah');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'user@madar.ps', role, name || 'مواطن مدار', neighborhood);
    if (role === 'admin') onNavigate('dashboard-admin');
    else if (role === 'merchant') onNavigate('dashboard-merchant');
    else if (role === 'provider') onNavigate('dashboard-provider');
    else if (role === 'organization') onNavigate('dashboard-org');
    else onNavigate('dashboard-user');
  };

  const handleQuickRole = (targetRole: UserRole, targetName: string) => {
    login(`${targetRole}@madar.ps`, targetRole, targetName, 'Deir al-Balah');
    if (targetRole === 'admin') onNavigate('dashboard-admin');
    else if (targetRole === 'merchant') onNavigate('dashboard-merchant');
    else if (targetRole === 'provider') onNavigate('dashboard-provider');
    else if (targetRole === 'organization') onNavigate('dashboard-org');
    else onNavigate('dashboard-user');
  };

  const handleGoogleAuth = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError(null);
      await signInWithGoogle();
      onNavigate('dashboard-user');
    } catch (err: any) {
      setGoogleError(err.message || 'Google Sign-In failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#183B56] p-2 mx-auto shadow-md">
          <img src="/icon.svg" alt="MADAR" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-black text-[#183B56]">{isRtl ? 'تسجيل الدخول إلى مَدَار' : 'Sign In to MADAR'}</h1>
        <p className="text-xs text-gray-500">{t('brand.subtagline')}</p>
      </div>

      {/* Google Sign-In Card (Real Firebase Auth & Google Workspace) */}
      <div className="bg-white border-2 border-sky-100 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="text-center">
          <span className="text-xs font-bold text-[#183B56] block">
            {isRtl ? 'تسجيل الدخول الموحد بحساب Google' : 'Sign In with Google Account'}
          </span>
          <span className="text-[11px] text-gray-500 block">
            {isRtl
              ? 'تفعيل خدمات Google Workspace (Drive, Sheets, Gmail) وحفظ البيانات سحابياً'
              : 'Enables Google Drive, Sheets, Gmail & Cloud persistence'}
          </span>
        </div>

        {googleError && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {googleError}
          </div>
        )}

        {isGoogleConnected && googleUser ? (
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span className="font-bold text-xs text-teal-900">
                {isRtl ? 'حسابك متصل ومفعل في منصة مدار' : 'Connected to MADAR Ecosystem'}
              </span>
            </div>
            <p className="text-[11px] text-teal-800">{googleUser.email}</p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => onNavigate('dashboard-user')}
                className="px-4 py-1.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800"
              >
                {isRtl ? 'الانتقال للوحة التحكم' : 'Go to Dashboard'}
              </button>
              <button
                onClick={logoutGoogle}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-white"
              >
                {isRtl ? 'تسجيل خروج' : 'Disconnect'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 active:scale-98 transition flex items-center justify-center gap-3 shadow-xs font-bold text-xs text-gray-700"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>{googleLoading ? (isRtl ? 'جاري التحقق...' : 'Signing in...') : (isRtl ? 'المتابعة باستخدام Google' : 'Sign in with Google')}</span>
          </button>
        )}
      </div>

      <div className="relative flex py-1 items-center">
        <div className="grow border-t border-gray-200"></div>
        <span className="shrink mx-4 text-gray-400 text-[11px] font-bold">
          {isRtl ? 'أو تجربة سريعة بالأدوار المجتمعية' : 'OR quick role evaluation'}
        </span>
        <div className="grow border-t border-gray-200"></div>
      </div>

      {/* Quick Demo Role Logins */}
      <div className="bg-sky-50 border border-sky-100 rounded-3xl p-4 space-y-2 text-xs">
        <span className="font-bold text-[#0284C7] block mb-1">
          {isRtl ? 'تجربة سريعة بأحد الأدوار (1-Click Switch):' : 'Instant Role Switch for Evaluation:'}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickRole('admin', 'ملاك أبو خاطر')}
            className="p-2 bg-[#183B56] text-white rounded-xl border border-[#183B56] text-start transition"
          >
            <span className="font-bold block text-[11px]">{isRtl ? 'ملاك (المؤسس والمشرف)' : 'Malak (Founder & Admin)'}</span>
            <span className="text-[10px] text-[#A9DDF5]">{isRtl ? 'لوحة المشرف العام' : 'Superadmin Portal'}</span>
          </button>
          <button
            onClick={() => handleQuickRole('resident', 'ملاك أبو خاطر')}
            className="p-2 bg-white rounded-xl border border-sky-200 text-start hover:border-[#0284C7] transition"
          >
            <span className="font-bold text-gray-800 block text-[11px]">{isRtl ? 'ملاك (عرض المواطن والأسرة)' : 'Malak (Resident View)'}</span>
            <span className="text-[10px] text-gray-500">{isRtl ? 'متابعة الطلبات الميدانية' : 'Track Local Requests'}</span>
          </button>
          <button
            onClick={() => handleQuickRole('merchant', 'مؤسسة النور للطاقة')}
            className="p-2 bg-white rounded-xl border border-sky-200 text-start hover:border-[#0284C7] transition"
          >
            <span className="font-bold text-gray-800 block text-[11px]">{t('role.merchant')}</span>
            <span className="text-[10px] text-gray-500">{isRtl ? 'تاجر سوق واصل' : 'WASEL Merchant'}</span>
          </button>
          <button
            onClick={() => handleQuickRole('provider', 'م. أحمد البردويل')}
            className="p-2 bg-white rounded-xl border border-sky-200 text-start hover:border-[#0284C7] transition"
          >
            <span className="font-bold text-gray-800 block text-[11px]">{t('role.provider')}</span>
            <span className="text-[10px] text-gray-500">{isRtl ? 'فني صيانة عون' : 'AOUN Technician'}</span>
          </button>
        </div>
      </div>

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'الاسم الكريم:' : 'Your Name:'}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: محمد الأحمد"
            className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'البريد الإلكتروني أو الهاتف:' : 'Email or Phone:'}</label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'الدور في المنظومة:' : 'Role in Ecosystem:'}</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-hidden focus:border-[#0284C7]"
          >
            <option value="resident">{isRtl ? 'مواطن / رب أسرة' : 'Resident / Family'}</option>
            <option value="merchant">{isRtl ? 'تاجر ومورد (واصل)' : 'Merchant (WASEL)'}</option>
            <option value="provider">{isRtl ? 'فني صيانة وإصلاح (عون)' : 'Technician (AOUN)'}</option>
            <option value="freelancer">{isRtl ? 'مستقل مهني (مهارة)' : 'Freelancer (MAHARA)'}</option>
            <option value="organization">{isRtl ? 'مؤسسة إنسانية (دفا / قطرة)' : 'Humanitarian NGO'}</option>
            <option value="admin">{isRtl ? 'المشرف العام (ملاك)' : 'Administrator (Malak)'}</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'المحافظة / الحي:' : 'Area / Neighborhood:'}</label>
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-hidden focus:border-[#0284C7]"
          >
            <option value="Deir al-Balah">{isRtl ? 'دير البلح' : 'Deir al-Balah'}</option>
            <option value="Khan Younis">{isRtl ? 'خان يونس' : 'Khan Younis'}</option>
            <option value="Nuseirat">{isRtl ? 'مخيم النصيرات' : 'Nuseirat'}</option>
            <option value="Zawayda">{isRtl ? 'الزوايدة' : 'Zawayda'}</option>
            <option value="Gaza City">{isRtl ? 'مدينة غزة' : 'Gaza City'}</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-[#183B56] hover:bg-[#183B56]/90 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>{isRtl ? 'الدخول ومتابعة اللوحة' : 'Enter Dashboard'}</span>
        </button>
      </form>
    </div>
  );
};
