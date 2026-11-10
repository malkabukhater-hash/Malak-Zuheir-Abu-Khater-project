import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Users,
  Activity,
  Server,
  Zap,
  TrendingUp,
  Download,
  AlertCircle,
  Database,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { requests, marketplaceItems, waterPoints, repairTechnicians, auditLogs } = useData();
  const { currentUser } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#183B56] to-[#0A2234] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-[#2DD4BF] text-[#183B56] px-3 py-1 rounded-full font-black">
              {isRtl ? 'المشرف العام ومؤسس المنظومة: ملاك أبو خاطر' : 'Founder & Admin: Malak Abu Khater'}
            </span>
            <span className="text-xs text-[#A9DDF5] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRtl ? 'صلاحيات إدارة كاملة' : 'Superadmin Access'}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">
            {isRtl ? 'لوحة القيادة الإشرافية — ملاك أبو خاطر' : 'MADAR Executive Control — Malak Abu Khater'}
          </h1>
          <p className="text-xs text-white/70">
            {isRtl
              ? 'إدارة المنظومة المركزية، مراقبة النزاهة والموثوقية، وسجلات النشاط الميداني في قطاع غزة.'
              : 'Ecosystem governance, field verification logs, and integrity oversight.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard-user')}
            className="px-4 py-2.5 rounded-2xl bg-white text-[#183B56] font-bold text-xs hover:bg-sky-50 transition shadow-xs"
          >
            {isRtl ? 'تعديل الملف الشخصي والطلبات' : 'Profile & Requests'}
          </button>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
            <span className="text-white/60 block text-[10px]">{isRtl ? 'حالة السيرفر والذاكرة' : 'Storage Engine'}</span>
            <span className="font-bold text-[#2DD4BF]">Persistent DB (JSON)</span>
          </div>
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span>{isRtl ? 'محرك الذكاء الاصطناعي' : 'AI Engine Status'}</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <span className="font-bold text-[#183B56] text-sm block">Gemini 3.8 Flash + Gaza Fallback</span>
          <span className="text-emerald-700 text-[10px]">{isRtl ? 'نشط ويعمل بكفاءة' : 'Active & Resilient'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span>{isRtl ? 'مخزن البيانات الدائم' : 'Persistence'}</span>
            <Database className="w-4 h-4 text-[#0284C7]" />
          </div>
          <span className="font-bold text-[#183B56] text-sm block">.data/db.json</span>
          <span className="text-emerald-700 text-[10px]">{isRtl ? 'تخزين دائم ومحدث' : 'Persistent on Disk'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span>{isRtl ? 'جاهزية PWA للأوفلاين' : 'PWA Offline State'}</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <span className="font-bold text-[#183B56] text-sm block">Service Worker Active</span>
          <span className="text-emerald-700 text-[10px]">{isRtl ? 'تخزين مؤقت تلقائي' : 'Auto Cached'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span>{isRtl ? 'إجمالي الطلبات' : 'Tickets Handled'}</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <span className="font-bold text-[#183B56] text-sm block">{requests.length} Requests</span>
          <span className="text-gray-500 text-[10px]">{isRtl ? 'عبر 5 وحدات' : 'Across 5 modules'}</span>
        </div>
      </div>

      {/* Sustainable Business Model Transparency */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-3 text-xs">
        <h2 className="font-bold text-base text-[#183B56] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0284C7]" />
          <span>{isRtl ? 'نموذج الاستدامة المالية والشفافية المجتمعية' : 'Transparent Revenue & Social Model'}</span>
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {isRtl
            ? 'تعتمد منظومة مَدَار على نموذج استدامة أخلاقي يضمن مجانية الخدمات الإنسانية الأساسية (المياه، معالجة السيول، والطلبات الإغاثية) للعائلات النازحة والمحتاجة، بينما تُغطى التكاليف التشغيلية عبر:'
            : 'MADAR maintains strict ethical boundaries: all essential humanitarian and shelter aid is 100% free for vulnerable households. Sustainability is financed via:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-bold block text-gray-800 mb-1">{isRtl ? '1. اشتراكات المتاجر والموردين:' : '1. Merchant Verified Badges:'}</span>
            <span className="text-gray-500">{isRtl ? 'رسوم رمزية اختيارية للمتاجر لترقية تصنيف الموثوقية والمخزون.' : 'Optional modest subscriptions for inventory highlighting.'}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-bold block text-gray-800 mb-1">{isRtl ? '2. تقارير المؤسسات والمنظمات:' : '2. Institutional Coordination Tools:'}</span>
            <span className="text-gray-500">{isRtl ? 'تزويد المنظمات الدولية بتقارير تحليل الاحتياج الميداني ومؤشرات التوزيع.' : 'Custom anonymized field demand analytics for humanitarian donors.'}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-bold block text-gray-800 mb-1">{isRtl ? '3. حماية البيانات الصارمة:' : '3. Absolute Zero Data Selling:'}</span>
            <span className="text-gray-500">{isRtl ? 'لا يتم بيع أو مشاركة بيانات الأسر والمواقع إطلاقاً لأي جهة تجارية.' : 'Personal household data is never commercialized.'}</span>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 text-xs">
        <h2 className="font-bold text-base text-[#183B56]">{isRtl ? 'سجل العمليات والرقابة المجتمعية (Audit Logs)' : 'Community Audit Log'}</h2>
        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-800">{isRtl ? log.actionAr : log.action}</span>
                <span className="text-gray-400 text-[11px] block">Actor: {log.actor}</span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">
                {new Date(log.timestamp).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
