import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Star,
  ShieldCheck,
  AlertCircle,
  Phone,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const ProviderDashboard: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { requests, updateRequestStatus } = useData();
  const { currentUser } = useAuth();

  const providerRequests = requests.filter(
    (r) => r.module === 'aoun' || r.assignedTo?.includes(currentUser.name)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full font-bold">
              {t('role.provider')}
            </span>
            <span className="flex items-center gap-1 text-xs text-teal-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRtl ? 'فني معتمد في منظومة عون' : 'Verified AOUN Technician'}</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#183B56]">{isRtl ? currentUser.nameAr || currentUser.name : currentUser.name}</h1>
          <p className="text-xs text-gray-500 mt-1">📍 {isRtl ? currentUser.neighborhoodAr : currentUser.neighborhood} • {currentUser.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-700">{isRtl ? 'جاهز لاستقبال الطلبات' : 'Available for Jobs'}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-[#0F766E] block mb-1">142</span>
          <span className="text-xs text-gray-600">{isRtl ? 'أجهزة تمت صيانتها بنجاح' : 'Repairs Completed'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-amber-600 block mb-1">{providerRequests.length}</span>
          <span className="text-xs text-gray-600">{isRtl ? 'طلبات قيد المعالجة' : 'Queue Jobs'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-amber-500 block mb-1">4.9 ★</span>
          <span className="text-xs text-gray-600">{isRtl ? 'تقييم الجودة ورضا المستفيدين' : 'Rating (142 reviews)'}</span>
        </div>
      </div>

      {/* Active Jobs Queue */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-[#183B56]">{isRtl ? 'قائمة مهام الصيانة الواردة' : 'Assigned Repair Tickets'}</h2>

        <div className="space-y-3">
          {providerRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#183B56]">{req.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-50 text-teal-800">
                    {req.status}
                  </span>
                </div>
                <p className="text-gray-500">{req.description}</p>
                <span className="text-[11px] text-gray-400">
                  📍 {req.neighborhoodAr || req.neighborhood} • 👤 {req.requesterName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {req.status !== 'Completed' && (
                  <button
                    onClick={() => updateRequestStatus(req.id, 'Completed', 'تم إنجاز فحص وإصلاح الجهاز بنجاح')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0F766E] text-white font-bold hover:bg-[#0F766E]/90 transition"
                  >
                    {isRtl ? 'تأكيد إتمام الإصلاح' : 'Mark Completed'}
                  </button>
                )}
                <button
                  onClick={() => onNavigate('request', { viewId: req.id })}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  {isRtl ? 'التفاصيل' : 'Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
