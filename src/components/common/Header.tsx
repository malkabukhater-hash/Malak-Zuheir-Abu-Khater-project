import React, { useState } from 'react';
import {
  Menu,
  X,
  Eye,
  Globe,
  Zap,
  UserCheck,
  ChevronDown,
  Sparkles,
  MapPin,
  LifeBuoy,
  HelpCircle,
  FileText,
  Shield,
  Layers,
  Volume2,
  FileSpreadsheet,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useEyeComfort } from '../../context/EyeComfortContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PWAInstallButton } from './PWAInstallButton';
import { EyeComfortModal } from './EyeComfortModal';
import { WorkspaceSyncModal } from './WorkspaceSyncModal';
import { UserRole } from '../../types';

export const Header: React.FC<{ activePage: string; onNavigate: (page: string) => void }> = ({
  activePage,
  onNavigate,
}) => {
  const { language, setLanguage, isRtl, t } = useLanguage();
  const { settings, speakText, stopSpeaking, isSpeaking } = useEyeComfort();
  const { currentUser, switchRole, isGoogleConnected } = useAuth();
  const { lowDataMode, toggleLowDataMode } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eyeModalOpen, setEyeModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'wasel', label: t('nav.wasel') },
    { id: 'aoun', label: t('nav.aoun') },
    { id: 'defa', label: t('nav.defa') },
    { id: 'qatra', label: t('nav.qatra') },
    { id: 'mahara', label: t('nav.mahara') },
    { id: 'request', label: t('nav.request'), highlight: true },
    { id: 'map', label: t('nav.map') },
    { id: 'media', label: t('nav.media') },
  ];

  const roleList: { id: UserRole; labelAr: string; labelEn: string }[] = [
    { id: 'resident', labelAr: 'مواطن / رب أسرة', labelEn: 'Resident / Family' },
    { id: 'merchant', labelAr: 'تاجر ومورد (واصل)', labelEn: 'Merchant (WASEL)' },
    { id: 'provider', labelAr: 'فني صيانة (عون)', labelEn: 'Technician (AOUN)' },
    { id: 'freelancer', labelAr: 'مستقل مهني (مهارة)', labelEn: 'Freelancer (MAHARA)' },
    { id: 'organization', labelAr: 'مؤسسة إنسانية (دفا/قطرة)', labelEn: 'Humanitarian NGO' },
    { id: 'admin', labelAr: 'إدارة المنظومة (ملاك)', labelEn: 'Administrator (Malak)' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    // Navigate to role's dashboard
    if (role === 'admin') onNavigate('dashboard-admin');
    else if (role === 'merchant') onNavigate('dashboard-merchant');
    else if (role === 'provider') onNavigate('dashboard-provider');
    else if (role === 'organization') onNavigate('dashboard-org');
    else onNavigate('dashboard-user');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100/80 shadow-xs transition-colors">
        {/* Top Announcement & Founder Bar */}
        <div className="bg-[#183B56] text-white text-[11px] py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
              <span className="opacity-90">{t('brand.tagline')}</span>
              <span className="hidden sm:inline-block text-white/40">|</span>
              <span className="hidden sm:inline-block text-[#A9DDF5] font-semibold">{t('brand.founder')}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Low Data Mode Toggle */}
              <button
                onClick={toggleLowDataMode}
                title={isRtl ? 'تبديل وضع التوفير لشبكات غزة الضعيفة' : 'Toggle low-data mode for weak connectivity'}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                  lowDataMode ? 'bg-[#2DD4BF] text-[#183B56]' : 'bg-white/10 hover:bg-white/20 text-[#A9DDF5]'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>{lowDataMode ? (isRtl ? 'وضع التوفير مفعّل' : 'Low-Data ON') : (isRtl ? 'وضع التوفير' : 'Low Data')}</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1 text-[11px] font-bold text-white hover:text-[#A9DDF5] transition px-1.5 py-0.5 rounded-md hover:bg-white/10"
                title={isRtl ? 'Switch to English' : 'التحويل للعربية'}
              >
                <Globe className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2.5 text-start group focus:outline-hidden"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#183B56] flex items-center justify-center shadow-md p-1.5 group-hover:scale-105 transition">
                  <img src="/icon.svg" alt="MADAR Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xl tracking-tight text-[#183B56]">MADAR</span>
                    <span className="font-bold text-base text-[#0284C7]">مَدَار</span>
                  </div>
                  <span className="block text-[10px] text-gray-500 font-medium leading-none">
                    {isRtl ? 'المنظومة المجتمعية الذكية' : 'Smart Community Ecosystem'}
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#183B56] text-white shadow-xs'
                        : link.highlight
                        ? 'bg-[#D9F1FC] text-[#0284C7] hover:bg-[#A9DDF5]/40 font-bold'
                        : 'text-gray-700 hover:text-[#183B56] hover:bg-gray-100/80'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Controls: EyeCare, Install, Profile */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* Eye Comfort Quick Button */}
              <button
                onClick={() => setEyeModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  settings.mode !== 'default'
                    ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-[#F0F9FF] text-[#0284C7] border-sky-200 hover:bg-sky-100'
                }`}
                title={t('eye.title')}
              >
                <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{isRtl ? 'راحة العين' : 'EyeCare'}</span>
              </button>

              {/* Soft Voice Audio Button */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const text = isRtl
                      ? 'مرحباً بكم في منظومة مَدَار الذكية، أسستها ملاك للتكافل وتوفير حلول المياه والإيواء وصيانة الطاقة الشمسية في قطاع غزة. من كل احتياج نصنع فرصة، ومن كل مورد نصنع حلاً.'
                      : 'Welcome to MADAR Smart Community Ecosystem, founded by Malak. Bridging shelter, water, solar, and repair mutual aid in Gaza.';
                    speakText(text, isRtl ? 'ar' : 'en');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-950 border-amber-300 animate-pulse shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-sky-50 hover:text-[#0284C7]'
                }`}
                title={isRtl ? 'قراءة بصوت هادئ ومريح للعين' : 'Read with soft calming voice'}
              >
                <Volume2 className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{isSpeaking ? (isRtl ? 'إيقاف الصوت' : 'Stop Audio') : (isRtl ? 'صوت هادئ' : 'Soft Voice')}</span>
              </button>

              {/* Google Workspace Integration Button */}
              <button
                onClick={() => setWorkspaceModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isGoogleConnected
                    ? 'bg-sky-50 text-[#0284C7] border-sky-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-sky-50 hover:text-[#0284C7]'
                }`}
                title={isRtl ? 'أدوات Google Workspace (Drive, Sheets, Gmail)' : 'Google Workspace Tools (Drive, Sheets, Gmail)'}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="hidden md:inline">{isRtl ? 'أدوات Google' : 'Workspace'}</span>
                {isGoogleConnected && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
              </button>

              {/* PWA Install */}
              <PWAInstallButton compact />

              {/* Role Switcher & Dashboard Trigger */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-[#183B56] text-xs font-bold transition shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-full bg-[#183B56] text-white flex items-center justify-center text-[10px] font-black">
                    {isRtl ? 'م' : 'M'}
                  </div>
                  <span className="max-w-[150px] truncate">{isRtl ? currentUser.nameAr || currentUser.name : currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#0284C7]" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute end-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-gray-100 p-2 z-50 text-xs">
                    <div className="px-3 py-2.5 border-b border-gray-100 mb-1 bg-gradient-to-r from-sky-50/60 to-transparent rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="block font-black text-[#183B56] text-sm">
                          {isRtl ? currentUser.nameAr : currentUser.name}
                        </span>
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                          {isRtl ? 'المؤسس' : 'Founder'}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 block">{currentUser.email}</span>
                      <span className="mt-1.5 inline-block text-[10px] bg-white border border-sky-200 text-[#0284C7] px-2 py-0.5 rounded-md font-semibold">
                        📍 {isRtl ? currentUser.neighborhoodAr : currentUser.neighborhood}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          onNavigate('dashboard-user');
                        }}
                        className="w-full text-start px-3 py-2 rounded-xl text-[#183B56] hover:bg-sky-50 font-bold transition flex items-center justify-between"
                      >
                        <span>{isRtl ? '👤 لوحة تحكم ملاك (الملف والطلبات)' : '👤 Malak Dashboard (Profile & Tasks)'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          onNavigate('dashboard-admin');
                        }}
                        className="w-full text-start px-3 py-2 rounded-xl text-[#0284C7] hover:bg-sky-50 font-bold transition flex items-center justify-between"
                      >
                        <span>{isRtl ? '⚙️ لوحة المشرف العام (ملاك)' : '⚙️ Superadmin Portal (Malak)'}</span>
                      </button>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <span className="px-3 text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        {isRtl ? 'معاينة المنظومة بأدوار مجتمعية أخرى:' : 'Simulate Community View:'}
                      </span>
                      {roleList.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleRoleSelect(r.id)}
                          className={`w-full text-start px-3 py-1.5 rounded-xl transition flex items-center justify-between text-xs ${
                            currentUser.role === r.id ? 'bg-[#F0F9FF] text-[#0284C7] font-bold' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span>{isRtl ? r.labelAr : r.labelEn}</span>
                          {currentUser.role === r.id && <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-100 mt-1">
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          onNavigate('about');
                        }}
                        className="w-full text-start px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                        <span>{t('nav.about')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setEyeModalOpen(true)}
                className="p-2 text-[#0284C7] bg-[#D9F1FC] rounded-xl"
                title={t('eye.title')}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-[#183B56] rounded-xl hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-start px-3 py-2 rounded-xl text-xs font-semibold ${
                    activePage === link.id
                      ? 'bg-[#183B56] text-white'
                      : link.highlight
                      ? 'bg-[#D9F1FC] text-[#0284C7] font-bold'
                      : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                <span className="text-xs font-medium text-gray-700">{isRtl ? 'لوحة التحكم الحالية' : 'Dashboard'}</span>
                <button
                  onClick={() => {
                    if (currentUser.role === 'admin') onNavigate('dashboard-admin');
                    else if (currentUser.role === 'merchant') onNavigate('dashboard-merchant');
                    else if (currentUser.role === 'provider') onNavigate('dashboard-provider');
                    else if (currentUser.role === 'organization') onNavigate('dashboard-org');
                    else onNavigate('dashboard-user');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#0284C7] text-white text-xs font-semibold"
                >
                  {isRtl ? 'عرض لوحتي' : 'Open'}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEyeModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-amber-700" />
                  <span>{isRtl ? 'إعدادات راحة العين' : 'EyeCare Settings'}</span>
                </button>
                <PWAInstallButton />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Eye Comfort Modal */}
      <EyeComfortModal isOpen={eyeModalOpen} onClose={() => setEyeModalOpen(false)} />

      {/* Google Workspace Integration Modal */}
      <WorkspaceSyncModal isOpen={workspaceModalOpen} onClose={() => setWorkspaceModalOpen(false)} />
    </>
  );
};
