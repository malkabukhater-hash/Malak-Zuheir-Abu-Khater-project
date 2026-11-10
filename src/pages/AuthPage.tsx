import React, { useState } from 'react';
import { UserCheck, Shield, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { login, currentUser } = useAuth();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('resident');
  const [neighborhood, setNeighborhood] = useState('Deir al-Balah');

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

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#183B56] p-2 mx-auto shadow-md">
          <img src="/icon.svg" alt="MADAR" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-black text-[#183B56]">{isRtl ? 'تسجيل الدخول إلى مَدَار' : 'Sign In to MADAR'}</h1>
        <p className="text-xs text-gray-500">{t('brand.subtagline')}</p>
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
            placeholder="name@domain.com"
            className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'الدور في المنظومة:' : 'Role in Ecosystem:'}</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
          >
            <option value="resident">{t('role.resident')}</option>
            <option value="merchant">{t('role.merchant')}</option>
            <option value="provider">{t('role.provider')}</option>
            <option value="freelancer">{t('role.freelancer')}</option>
            <option value="organization">{t('role.organization')}</option>
            <option value="admin">{t('role.admin')}</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'المنطقة أو الحي:' : 'Neighborhood:'}</label>
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
          >
            <option value="Deir al-Balah">دير البلح</option>
            <option value="Khan Younis">خان يونس</option>
            <option value="Nuseirat">النصيرات</option>
            <option value="Zawayda">الزوايدة</option>
            <option value="Gaza City">مدينة غزة</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#183B56] hover:bg-[#183B56]/90 text-white font-bold text-xs transition"
        >
          {isRtl ? 'متابعة الدخول' : 'Sign In / Register'}
        </button>
      </form>
    </div>
  );
};
