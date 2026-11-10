import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MapPin,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Filter,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { RequestStatus, SmartRequest } from '../types';
import { VoiceRequestRecorder } from '../components/common/VoiceRequestRecorder';

export const SmartRequestPage: React.FC<{
  onNavigate: (page: string) => void;
  initialParams?: any;
}> = ({ onNavigate, initialParams }) => {
  const { isRtl, t } = useLanguage();
  const { requests, createRequest, updateRequestStatus, isOnline } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Form State
  const [title, setTitle] = useState('');
  const [module, setModule] = useState<'wasel' | 'aoun' | 'defa' | 'qatra' | 'mahara'>('wasel');
  const [neighborhood, setNeighborhood] = useState('Deir al-Balah');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [description, setDescription] = useState('');
  const [hasInfants, setHasInfants] = useState(false);
  const [hasElderly, setHasElderly] = useState(false);
  const [floodedTent, setFloodedTent] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<SmartRequest | null>(null);

  // Fill prefill params if passed from AI Search
  useEffect(() => {
    if (initialParams) {
      if (initialParams.prefillQuery) {
        setTitle(initialParams.prefillQuery);
        setDescription(initialParams.prefillQuery);
      }
      if (initialParams.module) {
        setModule(initialParams.module);
      }
      if (initialParams.viewId) {
        setActiveTab('list');
      }
    }
  }, [initialParams]);

  // Priority Score Live Calculator
  const calculateScore = () => {
    let score = 50;
    if (urgency === 'urgent') score += 40;
    else if (urgency === 'high') score += 25;
    if (hasInfants) score += 15;
    if (hasElderly) score += 15;
    if (floodedTent) score += 20;
    return Math.min(100, score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newReq = await createRequest({
      title,
      module,
      neighborhood,
      neighborhoodAr: neighborhood === 'Khan Younis' ? 'خان يونس' : 'دير البلح',
      urgency,
      description,
      hasInfants,
      hasSickOrElderly: hasElderly,
      floodedTent,
      requesterName: currentUser.nameAr || currentUser.name,
      requesterRole: currentUser.role,
    });

    setSubmittedRequest(newReq);
  };

  const filteredRequests = requests.filter((r) => {
    const matchMod = selectedModuleFilter === 'all' || r.module === selectedModuleFilter;
    const matchStat = selectedStatusFilter === 'all' || r.status === selectedStatusFilter;
    return matchMod && matchStat;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800';
      case 'Matched':
        return 'bg-purple-100 text-purple-800';
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-800 animate-pulse';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#183B56] to-[#0284C7] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#A9DDF5] text-xs font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>{isRtl ? 'نظام الأولويات والتكافل الموحد' : 'Unified Priority Ticket Engine'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('req.title')}</h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
            {isRtl
              ? 'قدّم طلب احتياج أو صيانة أو إيواء أو مياه، وتتبع الخطوات الميدانية بشفافية تامة مع خوارزمية أولوية عادلة تراعي العائلات الأشد حاجة.'
              : 'Submit assistance, repair, shelter, or water requests with transparent urgency scoring and live step-by-step field tracking.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-white/10 p-1 rounded-2xl shrink-0 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('new'); setSubmittedRequest(null); }}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'new' ? 'bg-white text-[#183B56] shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {t('req.newTicket')}
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'list' ? 'bg-white text-[#183B56] shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {t('req.trackTickets')} ({requests.length})
          </button>
        </div>
      </div>

      {/* TAB 1: NEW TICKET FORM */}
      {activeTab === 'new' && (
        <div className="max-w-2xl mx-auto">
          {submittedRequest ? (
            <div className="bg-white border border-teal-200 rounded-3xl p-8 shadow-sm text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#183B56]">
                {isRtl ? 'تم تسجيل وتوثيق طلبك بنجاح!' : 'Request Successfully Submitted!'}
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                {isOnline
                  ? (isRtl ? `رقم التتبع: #${submittedRequest.id.slice(-6)}. حصل طلبك على مؤشر استحقاق (${submittedRequest.urgencyScore}%) وجاري التوجيه الميداني.` : `Tracking ID: #${submittedRequest.id.slice(-6)}. Priority score: ${submittedRequest.urgencyScore}%.`)
                  : (isRtl ? 'تم الحفظ في ذاكرة هاتفك بنجاح. سيتم رفع الطلب ومزامنته مع خادم مدار فور عودة الإنترنت.' : 'Saved safely to offline storage. Will automatically sync when reconnected.')}
              </p>

              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-start text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">{isRtl ? 'عنوان الطلب:' : 'Title:'}</span>
                  <span className="font-bold text-[#183B56]">{submittedRequest.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isRtl ? 'الحالة الحالية:' : 'Status:'}</span>
                  <span className="font-bold text-[#0284C7]">{submittedRequest.status}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={() => setActiveTab('list')}
                  className="px-5 py-2.5 rounded-xl bg-[#183B56] text-white text-xs font-semibold"
                >
                  {isRtl ? 'متابعة جدول الطلبات' : 'View in Tickets List'}
                </button>
                <button
                  onClick={() => {
                    setSubmittedRequest(null);
                    setTitle('');
                    setDescription('');
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                >
                  {isRtl ? 'تسجيل طلب آخر' : 'Submit Another'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-xs">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-bold text-base text-[#183B56]">{isRtl ? 'بيانات الاحتياج والمشكلة' : 'Request Specifications'}</h3>
                <span className="text-gray-400">{isRtl ? 'املأ الحقول بدقة لتسريع الاستجابة والتوجيه' : 'Fill details accurately for fast local matching'}</span>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">{t('req.fieldTitle')}:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isRtl ? 'مثال: تسرب في الشادر الشمالي / عطل إنفرتر / انقطاع مياه' : 'Problem title'}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              {/* Module and Neighborhood */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">{t('req.fieldModule')}:</label>
                  <select
                    value={module}
                    onChange={(e) => setModule(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
                  >
                    <option value="wasel">{isRtl ? 'واصل (سوق ومستلزمات)' : 'WASEL (Marketplace)'}</option>
                    <option value="aoun">{isRtl ? 'عون (صيانة وأجهزة)' : 'AOUN (Repair)'}</option>
                    <option value="defa">{isRtl ? 'دفا (إيواء وسيول)' : 'DEFA (Shelter)'}</option>
                    <option value="qatra">{isRtl ? 'قطرة (مياه)' : 'QATRA (Water)'}</option>
                    <option value="mahara">{isRtl ? 'مهارة (كفاءات وعمل)' : 'MAHARA (Skills)'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">{t('req.fieldNeighborhood')}:</label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden"
                  >
                    <option value="Deir al-Balah">{isRtl ? 'دير البلح' : 'Deir al-Balah'}</option>
                    <option value="Khan Younis">{isRtl ? 'خان يونس' : 'Khan Younis'}</option>
                    <option value="Nuseirat">{isRtl ? 'النصيرات' : 'Nuseirat'}</option>
                    <option value="Zawayda">{isRtl ? 'الزوايدة' : 'Zawayda'}</option>
                    <option value="Gaza City">{isRtl ? 'مدينة غزة' : 'Gaza City'}</option>
                  </select>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">{t('req.fieldUrgency')}:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'low', labelAr: 'عادي', labelEn: 'Normal' },
                    { id: 'medium', labelAr: 'متوسط', labelEn: 'Medium' },
                    { id: 'high', labelAr: 'مرتفع', labelEn: 'High' },
                    { id: 'urgent', labelAr: 'طارئ جداً', labelEn: 'Urgent' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id as any)}
                      className={`p-2 rounded-xl border text-center transition ${
                        urgency === u.id
                          ? 'bg-[#183B56] text-white font-bold border-[#183B56]'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {isRtl ? u.labelAr : u.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vulnerability factors */}
              <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-2.5">
                <span className="font-bold text-[#183B56] block mb-1">
                  {isRtl ? 'معايير تقييم الاستحقاق والأولوية العادلة:' : 'Priority Evaluation Metrics:'}
                </span>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasInfants}
                    onChange={(e) => setHasInfants(e.target.checked)}
                    className="rounded-sm text-[#0284C7] focus:ring-0"
                  />
                  <span>{t('req.hasInfants')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasElderly}
                    onChange={(e) => setHasElderly(e.target.checked)}
                    className="rounded-sm text-[#0284C7] focus:ring-0"
                  />
                  <span>{t('req.hasSick')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={floodedTent}
                    onChange={(e) => setFloodedTent(e.target.checked)}
                    className="rounded-sm text-[#0284C7] focus:ring-0"
                  />
                  <span className="text-red-700 font-semibold">{t('req.isFlooded')}</span>
                </label>

                {/* Score calculation bar */}
                <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between text-xs">
                  <span className="text-gray-500">{t('req.priorityScore')}:</span>
                  <span className="font-black text-[#0284C7] text-sm">{calculateScore()}%</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">{t('req.fieldDesc')}:</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isRtl ? 'صف الحالة بالتفصيل، موقع الخيمة أو المنزل بدقة، ورقم التواصل البديل...' : 'Describe problem details, exact tent address, contact...'}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              {/* Voice Note Recorder (Soft Voice Audio) */}
              <VoiceRequestRecorder
                onAudioReady={(blob, sec) => {
                  if (blob) {
                    if (!description.includes('تسجيل صوتي')) {
                      setDescription((prev) =>
                        prev
                          ? `${prev}\n[ملاحظة: مرفق رسالة صوتية مسجلة بالصوت الهادئ مدتها ${sec} ثانية]`
                          : `[ملاحظة: مرفق رسالة صوتية مسجلة بالصوت الهادئ مدتها ${sec} ثانية]`
                      );
                    }
                    if (!title) {
                      setTitle(isRtl ? `طلب صوتي مسجل #${Date.now().toString().slice(-4)}` : `Voice Request #${Date.now().toString().slice(-4)}`);
                    }
                  }
                }}
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#183B56] hover:bg-[#183B56]/90 text-white font-bold text-xs shadow-md transition"
              >
                {t('btn.submit')}
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: REQUESTS TRACKING & TIMELINE */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 text-xs">
            <span className="font-bold text-gray-500">{t('btn.quickFilter')}:</span>
            <select
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
              className="p-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden"
            >
              <option value="all">{isRtl ? 'جميع الأقسام' : 'All Modules'}</option>
              <option value="defa">{isRtl ? 'دفا (إيواء)' : 'DEFA'}</option>
              <option value="aoun">{isRtl ? 'عون (صيانة)' : 'AOUN'}</option>
              <option value="qatra">{isRtl ? 'قطرة (مياه)' : 'QATRA'}</option>
              <option value="wasel">{isRtl ? 'واصل (سوق)' : 'WASEL'}</option>
              <option value="mahara">{isRtl ? 'مهارة (مهام)' : 'MAHARA'}</option>
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="p-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden"
            >
              <option value="all">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="New">{t('req.statusNew')}</option>
              <option value="Under Review">{t('req.statusReview')}</option>
              <option value="Matched">{t('req.statusMatched')}</option>
              <option value="In Progress">{t('req.statusProgress')}</option>
              <option value="Completed">{t('req.statusCompleted')}</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-gray-400">#{req.id.slice(-5)}</span>
                    <h3 className="font-bold text-base text-[#183B56]">{req.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                    <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md font-bold">
                      {isRtl ? `أولوية ${req.urgencyScore}%` : `Score ${req.urgencyScore}%`}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <p className="text-xs text-gray-600 leading-relaxed">{req.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span>📍 {req.neighborhoodAr || req.neighborhood}</span>
                  <span>👤 {req.requesterName}</span>
                  <span>🕒 {new Date(req.createdAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}</span>
                  {req.assignedTo && (
                    <span className="text-[#0284C7] font-semibold">🛠️ {req.assignedTo}</span>
                  )}
                </div>

                {/* Timeline progression */}
                <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs">
                  <span className="font-bold text-gray-700 block mb-3">
                    {isRtl ? 'سجل المراحل الميدانية:' : 'Status Timeline:'}
                  </span>
                  <div className="space-y-2">
                    {req.timeline.map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">{entry.status}</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(entry.time).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US')}
                            </span>
                          </div>
                          <span className="text-gray-500 text-[11px]">{entry.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status progression actions for authorized review */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-400 text-[11px]">
                    {isRtl ? 'تحديث مرحلة الطلب متاح لفرق التنسيق والمشرفين' : 'Status transitions recorded with timestamp'}
                  </span>
                  {req.status !== 'Completed' && (
                    <div className="flex gap-2">
                      {req.status === 'New' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Under Review', 'جاري دراسة الاحتياج والتنسيق')}
                          className="px-3 py-1 rounded-lg bg-amber-600 text-white font-semibold"
                        >
                          {isRtl ? 'بدء المراجعة' : 'Start Review'}
                        </button>
                      )}
                      {req.status === 'Under Review' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Matched', 'تم تكليف فريق ميداني متخصص')}
                          className="px-3 py-1 rounded-lg bg-purple-600 text-white font-semibold"
                        >
                          {isRtl ? 'توجيه للمزود' : 'Match Provider'}
                        </button>
                      )}
                      {req.status === 'Matched' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'In Progress', 'الفريق في الميدان لتنفيذ العمل')}
                          className="px-3 py-1 rounded-lg bg-cyan-700 text-white font-semibold"
                        >
                          {isRtl ? 'بدء التنفيذ' : 'Mark In Progress'}
                        </button>
                      )}
                      {req.status === 'In Progress' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Completed', 'تم إنجاز الخدمة بنجاح والتأكد من المستفيد')}
                          className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-semibold"
                        >
                          {isRtl ? 'تأكيد الإنجاز' : 'Complete'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
