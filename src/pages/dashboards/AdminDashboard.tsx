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
  FileSpreadsheet,
  Briefcase,
  Clock,
  Filter,
  Check,
  Trash2,
  Award,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { WorkspaceSyncModal } from '../../components/common/WorkspaceSyncModal';
import { RequestStatus } from '../../types';

export const AdminDashboard: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { isRtl, t } = useLanguage();
  const { requests, skills, marketplaceItems, waterPoints, repairTechnicians, auditLogs, updateRequestStatus } = useData();
  const { currentUser, isGoogleConnected } = useAuth();
  
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'mahara' | 'audit'>('overview');
  
  // Requests filter & note state
  const [requestFilterModule, setRequestFilterModule] = useState<string>('all');
  const [statusUpdateNote, setStatusUpdateNote] = useState<{ [id: string]: string }>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    setUpdatingId(requestId);
    const note = statusUpdateNote[requestId] || (isRtl ? `تحديث إداري: تم اعتماد الحالة إلى ${newStatus}` : `Admin update: status changed to ${newStatus}`);
    await updateRequestStatus(requestId, newStatus, note);
    setUpdatingId(null);
  };

  const filteredRequests = requests.filter((r) => {
    return requestFilterModule === 'all' || r.module === requestFilterModule;
  });

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
              ? 'إدارة المنظومة المركزية، حوكمة نموذج مهارة (MAHARA)، ومتابعة حالات التدخل الميداني في قطاع غزة.'
              : 'Ecosystem governance, MAHARA skills moderation, and real-time field ticket tracking.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setWorkspaceModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs transition shadow-xs flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2DD4BF]" />
            <span>{isRtl ? 'أدوات Google Workspace' : 'Workspace Sync'}</span>
            {isGoogleConnected && <span className="w-2 h-2 rounded-full bg-teal-400" />}
          </button>
          <button
            onClick={() => onNavigate('dashboard-user')}
            className="px-4 py-2.5 rounded-2xl bg-white text-[#183B56] font-bold text-xs hover:bg-sky-50 transition shadow-xs"
          >
            {isRtl ? 'الملف الشخصي والطلبات' : 'Profile & Requests'}
          </button>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
            <span className="text-white/60 block text-[10px]">{isRtl ? 'قاعدة البيانات المزدوجة' : 'Relational & Cloud DB'}</span>
            <span className="font-bold text-[#2DD4BF]">PostgreSQL + Firestore</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#183B56] text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{isRtl ? 'نظرة عامة على المنظومة' : 'Ecosystem Overview'}</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-[#183B56] text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#2DD4BF]" />
          <span>{isRtl ? `إدارة الطلبات الميدانية (${requests.length})` : `Tickets Pipeline (${requests.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('mahara')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'mahara'
              ? 'bg-[#183B56] text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-purple-600" />
          <span>{isRtl ? `حوكمة مهارة — MAHARA (${skills.length})` : `MAHARA Skills (${skills.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-[#183B56] text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>{isRtl ? `الرقابة والامتثال (${auditLogs.length})` : `Audit & Moderation (${auditLogs.length})`}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* System Health Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span>{isRtl ? 'قاعدة البيانات العلائقية' : 'Relational Database'}</span>
                <Database className="w-4 h-4 text-teal-600" />
              </div>
              <span className="font-bold text-[#183B56] text-sm block">Cloud SQL (PostgreSQL)</span>
              <span className="text-emerald-700 text-[10px]">{isRtl ? 'europe-west2 متصل ومفعل' : 'Active (europe-west2)'}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span>{isRtl ? 'خدمات Google سحابياً' : 'Google Workspace'}</span>
                <FileSpreadsheet className="w-4 h-4 text-[#0284C7]" />
              </div>
              <span className="font-bold text-[#183B56] text-sm block">Drive, Sheets & Gmail</span>
              <span className="text-emerald-700 text-[10px]">
                {isGoogleConnected ? (isRtl ? 'الحساب متصل وجاهز' : 'Account Connected') : (isRtl ? 'بانتظار تسجيل الدخول' : 'Ready to Connect')}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span>{isRtl ? 'محرك الذكاء الاصطناعي' : 'AI Engine'}</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <span className="font-bold text-[#183B56] text-sm block">Gemini 3.8 Flash</span>
              <span className="text-emerald-700 text-[10px]">{isRtl ? 'نشط مع بدائل منخفضة النطاق' : 'Active & Resilient'}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span>{isRtl ? 'إجمالي الطلبات المسجلة' : 'Tickets Handled'}</span>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-bold text-[#183B56] text-sm block">{requests.length} Requests</span>
              <span className="text-gray-500 text-[10px]">{isRtl ? 'عبر 5 وحدات تكافلية' : 'Across 5 modules'}</span>
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
        </div>
      )}

      {/* TAB 2: REQUESTS PIPELINE */}
      {activeTab === 'requests' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
            <div>
              <h2 className="font-bold text-sm text-[#183B56]">
                {isRtl ? 'متابعة وتحديث حالات الطلبات الميدانية' : 'Field Requests Status Control'}
              </h2>
              <p className="text-xs text-gray-500">
                {isRtl ? 'تحديث مسار التدخل: مسجل -> معتمد -> قيد التنفيذ -> مكتمل' : 'Transition request status with real-time database audit notes'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{isRtl ? 'تصفية حسب الوحدة:' : 'Filter Module:'}</span>
              <select
                value={requestFilterModule}
                onChange={(e) => setRequestFilterModule(e.target.value)}
                className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-hidden"
              >
                <option value="all">{isRtl ? 'جميع الوحدات' : 'All Modules'}</option>
                <option value="mahara">{isRtl ? 'مهارة (MAHARA)' : 'MAHARA Skills'}</option>
                <option value="wasel">{isRtl ? 'واصل (WASEL)' : 'WASEL Market'}</option>
                <option value="aoun">{isRtl ? 'عون (AOUN)' : 'AOUN Repair'}</option>
                <option value="defa">{isRtl ? 'دفا (DEFA)' : 'DEFA Shelter'}</option>
                <option value="qatra">{isRtl ? 'قطرة (QATRA)' : 'QATRA Water'}</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-[#183B56]">{req.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-[#0284C7]">
                      {req.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {req.module.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                      {isRtl ? `درجة الأولوية: ${req.urgencyScore}%` : `Urgency: ${req.urgencyScore}%`}
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{req.description}</p>
                  
                  <div className="text-[11px] text-gray-400 flex flex-wrap items-center gap-3">
                    <span>👤 {req.requesterName}</span>
                    <span>•</span>
                    <span>📍 {req.neighborhoodAr || req.neighborhood}</span>
                    <span>•</span>
                    <span>📅 {new Date(req.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
                  </div>

                  {/* Optional Admin Note Input */}
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder={isRtl ? 'ملاحظة المشرف (مثال: تم التنسيق مع فريق الصيانة)' : 'Admin note for status change...'}
                      value={statusUpdateNote[req.id] || ''}
                      onChange={(e) =>
                        setStatusUpdateNote((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      className="w-full sm:w-80 p-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Status Transition Action Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleStatusChange(req.id, 'Matched')}
                    disabled={updatingId === req.id || req.status === 'Matched'}
                    className="px-3 py-1.5 rounded-xl border border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100 disabled:opacity-40 font-bold text-[11px] transition"
                  >
                    {isRtl ? 'مطابقة / اعتماد' : 'Match / Assign'}
                  </button>

                  <button
                    onClick={() => handleStatusChange(req.id, 'In Progress')}
                    disabled={updatingId === req.id || req.status === 'In Progress'}
                    className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 disabled:opacity-40 font-bold text-[11px] transition"
                  >
                    {isRtl ? 'قيد التنفيذ' : 'In Progress'}
                  </button>

                  <button
                    onClick={() => handleStatusChange(req.id, 'Completed')}
                    disabled={updatingId === req.id || req.status === 'Completed'}
                    className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 disabled:opacity-40 font-bold text-[11px] transition"
                  >
                    {isRtl ? 'اكتمال التدخل' : 'Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MAHARA SKILLS GOVERNANCE */}
      {activeTab === 'mahara' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
            <div>
              <h2 className="font-bold text-sm text-[#183B56]">
                {isRtl ? 'حوكمة وتدقيق مهارات مهارة (MAHARA Skills)' : 'MAHARA Skills Directory Moderation'}
              </h2>
              <p className="text-xs text-gray-500">
                {isRtl ? 'التحقق من الكفاءات المهنية ومنح شارة الموثوقية للمستقلين' : 'Review and badge verified independent service providers'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('mahara')}
              className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition"
            >
              {isRtl ? 'عرض بوابة مهارة العامة' : 'Open Skills Portal'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs flex flex-col justify-between space-y-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#183B56]">
                      {isRtl ? skill.titleAr : skill.titleEn}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">
                      {skill.category}
                    </span>
                  </div>

                  <span className="text-purple-700 font-semibold block mb-2">{skill.providerName}</span>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px]">
                    {isRtl ? skill.bioAr : skill.bioEn}
                  </p>
                  
                  <div className="pt-2 flex items-center justify-between text-gray-500 text-[11px]">
                    <span>{isRtl ? 'الأجر:' : 'Rate:'} {skill.rate}</span>
                    <span>📍 {isRtl ? skill.neighborhoodAr : skill.neighborhood}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3 text-teal-600" />
                    <span>{isRtl ? 'كفاءة معتمدة' : 'Verified'}</span>
                  </span>

                  <button
                    onClick={() => onNavigate('request', { prefillQuery: `مهمة عبر المشرف: ${skill.titleAr}`, module: 'mahara' })}
                    className="px-3 py-1.5 rounded-xl bg-[#183B56] hover:bg-[#183B56]/90 text-white font-bold text-[11px] transition"
                  >
                    {isRtl ? 'إسناد مهمة' : 'Assign Task'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT & MODERATION */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-[#183B56]">
                  {isRtl ? 'سجل العمليات والرقابة المجتمعية (Audit Logs)' : 'Community Audit Log'}
                </h2>
                <p className="text-xs text-gray-500">
                  {isRtl ? 'توثيق غير قابل للتعديل لجميع العمليات الميدانية والإدارية' : 'Immutable audit trail of field modifications and compliance events'}
                </p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-mono">
                {auditLogs.length} Events
              </span>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-gray-800 block">{isRtl ? log.actionAr : log.action}</span>
                    <span className="text-gray-400 text-[11px]">Actor: {log.actor}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Google Workspace Modal */}
      <WorkspaceSyncModal isOpen={workspaceModalOpen} onClose={() => setWorkspaceModalOpen(false)} />
    </div>
  );
};
