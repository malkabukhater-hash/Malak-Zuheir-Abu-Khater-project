import React from 'react';
import {
  Users,
  ShieldCheck,
  Download,
  Droplets,
  Home,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const OrganizationDashboard: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { requests, waterPoints, shelterSupplies } = useData();
  const { currentUser } = useAuth();

  const handleExport = () => {
    // Generate CSV data from requests
    const header = 'ID,Module,Neighborhood,Urgency,Status,CreatedAt\n';
    const rows = requests
      .map((r) => `"${r.id}","${r.module}","${r.neighborhood}","${r.urgency}","${r.status}","${r.createdAt}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `madar-humanitarian-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold">
              {t('role.organization')}
            </span>
            <span className="text-xs text-gray-400">• {isRtl ? 'بوابة المنظمات الإنسانية واللجان الأهلية' : 'Humanitarian Coordination'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#183B56]">{isRtl ? currentUser.nameAr || currentUser.name : currentUser.name}</h1>
          <p className="text-xs text-gray-500 mt-1">📍 {isRtl ? currentUser.neighborhoodAr : currentUser.neighborhood} • {currentUser.email}</p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-2xl bg-[#183B56] hover:bg-[#183B56]/90 text-white font-bold text-xs shadow-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{isRtl ? 'تصدير تقرير الاحتياج الميداني (CSV)' : 'Export Field Needs (CSV)'}</span>
        </button>
      </div>

      {/* Humanitarian KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-[#0284C7] block mb-1">{requests.length}</span>
          <span className="text-xs text-gray-600">{isRtl ? 'إجمالي الاحتياجات المسجلة' : 'Aggregated Demand'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-amber-600 block mb-1">
            {requests.filter((r) => r.urgency === 'urgent').length}
          </span>
          <span className="text-xs text-gray-600">{isRtl ? 'حالات طارئة (أطفال/سيول)' : 'Critical Urgency Cases'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-teal-600 block mb-1">{waterPoints.length}</span>
          <span className="text-xs text-gray-600">{isRtl ? 'نقاط توزيع مياه منسقة' : 'Monitored Water Depots'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-purple-600 block mb-1">
            {shelterSupplies.reduce((acc, s) => acc + s.available, 0)}
          </span>
          <span className="text-xs text-gray-600">{isRtl ? 'شوادر ومواد إيواء جاهزة' : 'Tarpaulins Ready'}</span>
        </div>
      </div>

      {/* Multi-Sector Overview */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 text-xs">
        <h2 className="font-bold text-base text-[#183B56]">{isRtl ? 'توزيع الاحتياج حسب القطاع الجغرافي' : 'Needs by Neighborhood Sector'}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
            <h3 className="font-bold text-sm text-[#0284C7] mb-2">{isRtl ? 'قطاع دير البلح' : 'Deir al-Balah'}</h3>
            <p className="text-gray-600 leading-relaxed">
              {isRtl ? 'تركيز مرتفع على طلبات صيانة ألواح الطاقة الشمسية وتوفير مياه الشرب المحلاة.' : 'High concentration of solar repair and RO drinking water demand.'}
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <h3 className="font-bold text-sm text-amber-800 mb-2">{isRtl ? 'قطاع خان يونس والمواصي' : 'Khan Younis / Mawasi'}</h3>
            <p className="text-gray-600 leading-relaxed">
              {isRtl ? 'أولوية عاجلة لشوادر العزل ورفع أرضيات الخيام بسبب قربها من مياه الأمطار والرطوبة.' : 'Urgent priority for windproofing and raised pallet tent flooring.'}
            </p>
          </div>
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
            <h3 className="font-bold text-sm text-[#0F766E] mb-2">{isRtl ? 'قطاع النصيرات والوسطى' : 'Nuseirat & Central'}</h3>
            <p className="text-gray-600 leading-relaxed">
              {isRtl ? 'طلب متزايد على صهاريج المياه الاستخدامية وورش خياطة وتدعيم الأقمشة.' : 'Elevated demand for domestic utility water tankers and canvas mending.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
