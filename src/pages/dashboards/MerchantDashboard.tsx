import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  Users,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const MerchantDashboard: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { marketplaceItems, groupPurchases } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'inventory' | 'group'>('inventory');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full font-bold">
              {t('role.merchant')}
            </span>
            <span className="flex items-center gap-1 text-xs text-teal-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRtl ? 'حساب تاجر معتمد وموثق' : 'Verified Merchant Account'}</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#183B56]">{isRtl ? currentUser.nameAr || currentUser.name : currentUser.name}</h1>
          <p className="text-xs text-gray-500 mt-1">📍 {isRtl ? currentUser.neighborhoodAr : currentUser.neighborhood} • {currentUser.email}</p>
        </div>

        <button
          onClick={() => onNavigate('wasel')}
          className="px-5 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'إضافة صنف جديد للسوق' : 'Add Item to WASEL'}</span>
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-[#0284C7] block mb-1">{marketplaceItems.length}</span>
          <span className="text-xs text-gray-600">{isRtl ? 'الأصناف المعروضة' : 'Active Listings'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-teal-600 block mb-1">100%</span>
          <span className="text-xs text-gray-600">{isRtl ? 'معدل التوفر الموثق' : 'Stock Accuracy'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-purple-600 block mb-1">{groupPurchases.length}</span>
          <span className="text-xs text-gray-600">{isRtl ? 'عروض الشراء الجماعي' : 'Group Buy Pools'}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <span className="text-2xl font-black text-amber-600 block mb-1">4.9 / 5</span>
          <span className="text-xs text-gray-600">{isRtl ? 'تقييم المستفيدين' : 'Community Rating'}</span>
        </div>
      </div>

      {/* Inventory Management Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-[#183B56]">{isRtl ? 'إدارة المخزون والتوفر الميداني' : 'Inventory & Stock Availability'}</h2>

        <div className="space-y-3">
          {marketplaceItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#183B56]">{isRtl ? item.titleAr : item.titleEn}</span>
                  <span className="font-bold text-[#0284C7]">{item.price} ₪</span>
                </div>
                <div className="text-gray-500 mt-1 flex items-center gap-3 text-[11px]">
                  <span>{isRtl ? `الكمية المتوفرة: ${item.availableQty}` : `Qty: ${item.availableQty}`}</span>
                  <span>•</span>
                  <span>{isRtl ? `آخر توثيق: قبل ساعتين` : `Verified 2h ago`}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold text-[11px] border border-emerald-200">
                  {isRtl ? 'متاح للطلب' : 'In Stock'}
                </span>
                <button
                  onClick={() => alert(isRtl ? 'تم تحديث وقت التوثيق بنجاح!' : 'Timestamp updated!')}
                  className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                >
                  {isRtl ? 'تجديد التوثيق' : 'Refresh Timestamp'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
