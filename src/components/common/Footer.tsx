import React from 'react';
import { Heart, ShieldCheck, Eye, Wifi, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();

  return (
    <footer className="bg-[#183B56] text-white pt-14 pb-10 border-t border-sky-900/60 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center">
                <img src="/icon.svg" alt="MADAR" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">MADAR | مَدَار</span>
            </div>
            <p className="text-xs text-[#A9DDF5] leading-relaxed">
              {t('brand.tagline')}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-[#2DD4BF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('brand.founder')}</span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              {isRtl
                ? 'منظومة مجتمعية ذكية مخصصة لتمكين سكان غزة من الوصول للموارد، خدمات الصيانة، نقاط المياه، وحماية الإيواء بأقصى كفاءة وأقل استهلاك للإنترنت.'
                : 'A smart community ecosystem engineered for Gaza resilience, connecting local supplies, repairs, clean water, and shelter solutions under challenging connectivity.'}
            </p>
          </div>

          {/* Operational Modules */}
          <div>
            <h4 className="font-bold text-sm text-[#A9DDF5] mb-3">{isRtl ? 'الوحدات الميدانية' : 'Core Modules'}</h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => onNavigate('wasel')} className="hover:text-white transition">
                  {isRtl ? 'واصل (السوق والاحتياجات المحلية)' : 'WASEL (Local Marketplace)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('aoun')} className="hover:text-white transition">
                  {isRtl ? 'عون (إصلاح الطاقة وتدوير الأدوات)' : 'AOUN (Repair & Reuse)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('defa')} className="hover:text-white transition">
                  {isRtl ? 'دفا (الإيواء وحماية الشتاء)' : 'DEFA (Shelter & Winterization)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('qatra')} className="hover:text-white transition">
                  {isRtl ? 'قطرة (دليل ونقاط المياه)' : 'QATRA (Water Distribution)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mahara')} className="hover:text-white transition">
                  {isRtl ? 'مهارة (الكفاءات وسوق العمل)' : 'MAHARA (Skills Marketplace)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('request')} className="text-[#2DD4BF] font-bold hover:underline">
                  {isRtl ? 'مركز الطلبات المجتمعية الموحد' : 'Unified Request Center'}
                </button>
              </li>
            </ul>
          </div>

          {/* Dashboards & Community */}
          <div>
            <h4 className="font-bold text-sm text-[#A9DDF5] mb-3">{isRtl ? 'لوحات التحكم والتنسيق' : 'Portals & Dashboards'}</h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => onNavigate('dashboard-user')} className="hover:text-white transition">
                  {isRtl ? 'لوحة المواطن والأسرة' : 'Resident Dashboard'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-merchant')} className="hover:text-white transition">
                  {isRtl ? 'لوحة التاجر والمورد' : 'Merchant Dashboard'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-provider')} className="hover:text-white transition">
                  {isRtl ? 'لوحة فني الصيانة' : 'Provider Dashboard'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-org')} className="hover:text-white transition">
                  {isRtl ? 'لوحة المؤسسات والجمعيات' : 'Organization Dashboard'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-admin')} className="hover:text-white transition">
                  {isRtl ? 'لوحة المشرف العام (ملاك)' : 'Admin Dashboard (Malak)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-white transition">
                  {isRtl ? 'خريطة التوزيع الميداني' : 'Interactive Community Map'}
                </button>
              </li>
            </ul>
          </div>

          {/* Accessibility, Media & Legal */}
          <div>
            <h4 className="font-bold text-sm text-[#A9DDF5] mb-3">{isRtl ? 'المعرفة والشفافية' : 'Knowledge & Safety'}</h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => onNavigate('eyecare')} className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'راحة العين من مدار (EyeCare)' : 'MADAR EyeCare Suite'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('media')} className="hover:text-white transition">
                  {isRtl ? 'المركز التوعوي والإرشادي' : 'Educational Media Hub'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition">
                  {isRtl ? 'رؤية المنظومة وقصة التأسيس' : 'About MADAR & Vision'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">
                  {isRtl ? 'الدعم والتواصل الميداني' : 'Contact & Field Support'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">
                  {isRtl ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition">
                  {isRtl ? 'شروط الخدمة والتعامل المجتمعي' : 'Terms of Service'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety & Humanitarian Disclaimers */}
        <div className="py-6 border-b border-white/10 text-[11px] text-white/70 space-y-2">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2DD4BF] shrink-0" />
            <span>
              {isRtl
                ? 'تنويه سلامة المياه: تصنيف محطات المياه يعتمد على التحليل الميداني والتقارير الموثقة. لا نضمن الصلاحية المخبرية التامة دون غلي أو كلورة معتمدة.'
                : 'Water Safety Notice: Water point designations reflect field test reports. Laboratory sterility is not certified without standard household boiling or authorized chlorine treatment.'}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              {isRtl
                ? 'تنويه راحة العين: ميزات EyeCare تقلل إجهاد الشاشات وحساسية الضوء، وليست بديلاً عن الفحص الطبي المتخصص لأمراض العيون.'
                : 'EyeCare Notice: Features reduce screen glare and ocular fatigue; they do not diagnose or treat clinical ocular diseases.'}
            </span>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <div>
            © {new Date().getFullYear()} MADAR | مَدَار. {isRtl ? 'جميع الحقوق محفوظة للمؤسس ملاك.' : 'All rights reserved. Founded by Malak.'}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-teal-400" />
              <span>{isRtl ? 'معمارية متوافقة مع انقطاع الإنترنت (Offline-First)' : 'Offline-First Gaza Architecture'}</span>
            </span>
            <span>•</span>
            <span>v1.0.0 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
