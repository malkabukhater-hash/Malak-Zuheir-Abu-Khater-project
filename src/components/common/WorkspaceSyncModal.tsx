import React, { useState } from 'react';
import {
  FileSpreadsheet,
  HardDrive,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Upload,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  listDriveFiles,
  uploadJsonToDrive,
  createGoogleSheet,
  sendGmailMessage,
  DriveFileItem,
} from '../../lib/googleWorkspace';

interface WorkspaceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceSyncModal: React.FC<WorkspaceSyncModalProps> = ({ isOpen, onClose }) => {
  const { isRtl } = useLanguage();
  const { googleUser, googleAccessToken, isGoogleConnected, signInWithGoogle, logoutGoogle } = useAuth();
  const { requests, skills, waterPoints, marketplaceItems } = useData();

  const [activeTab, setActiveTab] = useState<'sheets' | 'drive' | 'gmail'>('sheets');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sheets state
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(null);
  const [sheetDataType, setSheetDataType] = useState<'requests' | 'skills' | 'water'>('requests');

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const [backupUploaded, setBackupUploaded] = useState<{ id: string; name: string } | null>(null);

  // Gmail state
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showConfirmSend, setShowConfirmSend] = useState(false);

  if (!isOpen) return null;

  const handleConnectGoogle = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      await signInWithGoogle();
      setSuccessMessage(isRtl ? 'تم ربط حساب Google بنجاح' : 'Connected to Google Workspace successfully');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleExportToSheets = async () => {
    if (!googleAccessToken) {
      setErrorMessage(isRtl ? 'يرجى تسجيل الدخول بحساب Google أولاً' : 'Please connect your Google account first');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      let headers: string[] = [];
      let rows: (string | number)[][] = [];
      let title = '';

      if (sheetDataType === 'requests') {
        title = `MADAR - سجل الطلبات المجتمعية (${new Date().toLocaleDateString()})`;
        headers = ['ID', 'العنوان', 'الوحدة', 'المنطقة', 'الحالة', 'الأولوية', 'المستفيد', 'تاريخ الإنشاء'];
        rows = requests.map((r) => [
          r.id,
          r.title,
          r.module,
          r.neighborhoodAr || r.neighborhood,
          r.status,
          r.urgency,
          r.requesterName,
          r.createdAt,
        ]);
      } else if (sheetDataType === 'skills') {
        title = `MADAR - دليل الكفاءات والمستقلين (مهارة) (${new Date().toLocaleDateString()})`;
        headers = ['ID', 'المهارة', 'الاسم', 'التصنيف', 'المنطقة', 'الأجر', 'التقييم'];
        rows = skills.map((s) => [
          s.id,
          s.titleAr,
          s.providerName,
          s.category,
          s.neighborhoodAr || s.neighborhood,
          s.rate,
          s.rating,
        ]);
      } else {
        title = `MADAR - دليل محطات وشبكة المياه (قطرة) (${new Date().toLocaleDateString()})`;
        headers = ['ID', 'اسم المحطة', 'النوع', 'المنطقة', 'الحالة', 'ساعات العمل', 'ملاحظات السعة'];
        rows = waterPoints.map((w) => [
          w.id,
          w.nameAr,
          w.type,
          w.neighborhoodAr || w.neighborhood,
          w.status,
          w.operatingHours,
          w.capacityNotesAr,
        ]);
      }

      const result = await createGoogleSheet(googleAccessToken, title, headers, rows);
      setCreatedSheetUrl(result.spreadsheetUrl);
      setSuccessMessage(
        isRtl
          ? 'تم إنشاء جدول بيانات Google Sheets بنجاح وإدراج البيانات'
          : 'Google Sheet created successfully with active records!'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to export to Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupToDrive = async () => {
    if (!googleAccessToken) {
      setErrorMessage(isRtl ? 'يرجى تسجيل الدخول بحساب Google أولاً' : 'Please connect your Google account first');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `MADAR_Ecosystem_Backup_${timestamp}.json`;

      const backupPayload = {
        meta: {
          app: 'MADAR | مَدَار',
          founder: 'Malak Zuhair Abu Khater',
          timestamp: new Date().toISOString(),
          totalRequests: requests.length,
          totalSkills: skills.length,
          totalMarketItems: marketplaceItems.length,
        },
        requests,
        skills,
        waterPoints,
        marketplaceItems,
      };

      const result = await uploadJsonToDrive(googleAccessToken, filename, backupPayload);
      setBackupUploaded(result);
      setSuccessMessage(
        isRtl
          ? `تم رفع ملف النسخة الاحتياطية (${filename}) بنجاح إلى Google Drive`
          : `Backup file (${filename}) saved to Google Drive successfully!`
      );
      // Refresh file list
      loadDriveFiles();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to backup to Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const loadDriveFiles = async () => {
    if (!googleAccessToken) return;
    try {
      setDriveLoading(true);
      const files = await listDriveFiles(googleAccessToken);
      setDriveFiles(files);
    } catch (err: any) {
      console.warn('Drive listing error:', err);
    } finally {
      setDriveLoading(false);
    }
  };

  const handleSendGmail = async () => {
    if (!googleAccessToken) {
      setErrorMessage(isRtl ? 'يرجى تسجيل الدخول بحساب Google أولاً' : 'Please connect your Google account first');
      return;
    }
    if (!emailRecipient || !emailSubject || !emailBody) {
      setErrorMessage(isRtl ? 'يرجى ملء جميع حقول البريد الإلكتروني' : 'Please fill all email fields');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await sendGmailMessage(googleAccessToken, emailRecipient, emailSubject, emailBody);

      setSuccessMessage(
        isRtl
          ? `تم إرسال الرسالة بنجاح عبر Gmail إلى ${emailRecipient}`
          : `Email sent successfully via Gmail to ${emailRecipient}!`
      );
      setEmailRecipient('');
      setEmailSubject('');
      setEmailBody('');
      setShowConfirmSend(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch email via Gmail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#183B56] via-[#1E4565] to-[#0284C7] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs text-[#2DD4BF]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg">
                {isRtl ? 'خدمات Google Workspace لمنظومة مَدَار' : 'Google Workspace Integration'}
              </h2>
              <p className="text-xs text-sky-100">
                {isRtl
                  ? 'الربط المباشر مع Google Drive و Google Sheets و Gmail'
                  : 'Direct integration with Google Drive, Sheets & Gmail'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Status Bar */}
        <div className="bg-sky-50/80 px-6 py-3 border-b border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isGoogleConnected ? 'bg-teal-500 animate-pulse' : 'bg-gray-400'}`}
            />
            {isGoogleConnected && googleUser ? (
              <span className="text-gray-700">
                <span className="font-bold text-[#183B56]">{googleUser.displayName || googleUser.email}</span>{' '}
                <span className="text-gray-500">({googleUser.email})</span>
              </span>
            ) : (
              <span className="text-gray-500">
                {isRtl ? 'لم يتم ربط حساب Google بعد' : 'Google Workspace account not connected'}
              </span>
            )}
          </div>

          <div>
            {isGoogleConnected ? (
              <button
                onClick={logoutGoogle}
                className="px-3 py-1 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold transition text-[11px]"
              >
                {isRtl ? 'تسجيل الخروج من Google' : 'Disconnect Google'}
              </button>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={loading}
                className="px-4 py-1.5 rounded-xl bg-[#183B56] hover:bg-[#183B56]/90 text-white font-bold transition flex items-center gap-2 text-[11px] shadow-xs"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-3.5 h-3.5 bg-white rounded-full p-0.5"
                />
                <span>{loading ? (isRtl ? 'جاري الاتصال...' : 'Connecting...') : (isRtl ? 'تسجيل الدخول بحساب Google' : 'Sign in with Google')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Banners */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="flex-1">{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-teal-600 font-bold">×</button>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-600 font-bold">×</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 pt-2 gap-4 text-xs font-bold text-gray-500">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'sheets' ? 'border-[#0284C7] text-[#0284C7]' : 'border-transparent hover:text-gray-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isRtl ? 'تصدير إلى Google Sheets' : 'Google Sheets Export'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('drive');
              if (isGoogleConnected && driveFiles.length === 0) loadDriveFiles();
            }}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'drive' ? 'border-[#0284C7] text-[#0284C7]' : 'border-transparent hover:text-gray-700'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>{isRtl ? 'النسخ الاحتياطي في Drive' : 'Google Drive Backup'}</span>
          </button>

          <button
            onClick={() => setActiveTab('gmail')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'gmail' ? 'border-[#0284C7] text-[#0284C7]' : 'border-transparent hover:text-gray-700'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{isRtl ? 'إرسال إشعار عبر Gmail' : 'Gmail Dispatcher'}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-2">
                <span className="font-bold text-[#183B56] block">
                  {isRtl
                    ? 'إنشاء ومزامنة جداول بيانات Google Sheets حية:'
                    : 'Create and sync live Google Spreadsheets:'}
                </span>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  {isRtl
                    ? 'يتيح لك تصدير سجلات الطلبات الميدانية، ودليل المستقلين في مهارة، ومحطات المياه إلى جدول بيانات حقيقي في حسابك على Google Sheets بضغطة زر لمشاركتها مع فرق الإغاثة.'
                    : 'Export smart requests, Mahara freelancer listings, or water stations directly to a live Google Sheet in your Drive for reporting and coordination.'}
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">
                  {isRtl ? 'اختر مجموعة البيانات المراد تصديرها:' : 'Select Data Collection to Export:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSheetDataType('requests')}
                    className={`p-3 rounded-xl border text-center transition ${
                      sheetDataType === 'requests'
                        ? 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7] font-bold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-xs">{isRtl ? 'سجل الطلبات' : 'Smart Requests'}</span>
                    <span className="text-[10px] text-gray-500">({requests.length} {isRtl ? 'سجل' : 'rows'})</span>
                  </button>

                  <button
                    onClick={() => setSheetDataType('skills')}
                    className={`p-3 rounded-xl border text-center transition ${
                      sheetDataType === 'skills'
                        ? 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7] font-bold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-xs">{isRtl ? 'دليل مهارة' : 'Mahara Skills'}</span>
                    <span className="text-[10px] text-gray-500">({skills.length} {isRtl ? 'سجل' : 'rows'})</span>
                  </button>

                  <button
                    onClick={() => setSheetDataType('water')}
                    className={`p-3 rounded-xl border text-center transition ${
                      sheetDataType === 'water'
                        ? 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7] font-bold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-xs">{isRtl ? 'محطات المياه' : 'Water Grid'}</span>
                    <span className="text-[10px] text-gray-500">({waterPoints.length} {isRtl ? 'سجل' : 'rows'})</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleExportToSheets}
                  disabled={loading || !isGoogleConnected}
                  className="px-5 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0284C7]/90 disabled:opacity-50 text-white font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>
                    {loading
                      ? (isRtl ? 'جاري إنشاء الجدول وتصدير البيانات...' : 'Exporting to Sheet...')
                      : (isRtl ? 'إنشاء وتصدير إلى Google Sheet' : 'Create Google Spreadsheet')}
                  </span>
                </button>

                {createdSheetUrl && (
                  <a
                    href={createdSheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 font-bold hover:bg-teal-100 transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isRtl ? 'فتح الجدول في Google Sheets' : 'Open in Google Sheets'}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE */}
          {activeTab === 'drive' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-[#581C87] block mb-1">
                    {isRtl ? 'نسخ احتياطي فوري إلى Google Drive:' : 'Instant Cloud Backup to Google Drive:'}
                  </span>
                  <p className="text-gray-600 text-[11px]">
                    {isRtl
                      ? 'احفظ نسخة JSON كاملة من قاعدة بيانات مدار في مجلدك الخاص على Drive لحماية السجلات من الانقطاعات.'
                      : 'Preserve complete snapshot of MADAR records securely to your Google Drive.'}
                  </p>
                </div>
                <button
                  onClick={handleBackupToDrive}
                  disabled={loading || !isGoogleConnected}
                  className="px-4 py-2 rounded-xl bg-[#581C87] hover:bg-[#581C87]/90 disabled:opacity-50 text-white font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{loading ? (isRtl ? 'جاري الرفع...' : 'Uploading...') : (isRtl ? 'أخذ نسخة احتياطية' : 'Backup Now')}</span>
                </button>
              </div>

              {/* Drive Files List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-700">
                    {isRtl ? 'أحدث الملفات في Google Drive:' : 'Recent Files in Google Drive:'}
                  </span>
                  <button
                    onClick={loadDriveFiles}
                    disabled={driveLoading || !isGoogleConnected}
                    className="text-[#0284C7] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className={`w-3 h-3 ${driveLoading ? 'animate-spin' : ''}`} />
                    <span>{isRtl ? 'تحديث القائمة' : 'Refresh'}</span>
                  </button>
                </div>

                {driveLoading ? (
                  <div className="p-8 text-center text-gray-400">{isRtl ? 'جاري استعراض الملفات...' : 'Loading files...'}</div>
                ) : driveFiles.length > 0 ? (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <HardDrive className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                          <span className="font-medium text-gray-800 truncate">{file.name}</span>
                        </div>
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#0284C7] hover:underline flex items-center gap-1 shrink-0 text-[11px]"
                          >
                            <span>{isRtl ? 'معاينة' : 'View'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100 text-[11px]">
                    {isGoogleConnected
                      ? (isRtl ? 'لا توجد ملفات حديثة أو اضغط تحديث' : 'No recent files found. Click refresh.')
                      : (isRtl ? 'يرجى تسجيل الدخول بحساب Google لعرض ملفات Drive' : 'Please connect Google account to view Drive files.')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GMAIL DISPATCHER */}
          {activeTab === 'gmail' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-100 text-[11px] text-gray-700 leading-relaxed">
                <span className="font-bold text-teal-900 block mb-1">
                  {isRtl ? 'إرسال إشعارات وتقارير عبر Gmail API:' : 'Send Official Notifications via Gmail API:'}
                </span>
                <p>
                  {isRtl
                    ? 'يمكن لفرق التنسيق والمشرفين إرسال تحديثات حالات الطوارئ والإغاثة إلى المستفيدين والشركاء مباشرة من بريدهم الإلكتروني الرسمي المعتمد.'
                    : 'Dispatch verified relief updates, request matched alerts, or technical confirmations to partners and residents using your authorized Gmail account.'}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'البريد الإلكتروني للمستلم:' : 'Recipient Email:'}</label>
                  <input
                    type="email"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="example@relief.org"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'موضوع الرسالة:' : 'Subject:'}</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder={isRtl ? 'تحديث بخصوص طلب الإيواء - منظومة مدار' : 'MADAR Mutual-Aid Update'}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'نص الرسالة:' : 'Message Body:'}</label>
                  <textarea
                    rows={4}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder={isRtl ? 'اكتب تفاصيل التنسيق أو البلاغ الميداني...' : 'Enter message details...'}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
                  />
                </div>

                {/* Explicit User Confirmation Box before sending (Per Skill Security Protocol) */}
                {showConfirmSend ? (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>{isRtl ? 'تأكيد إرسال البريد الإلكتروني عبر حسابك' : 'Confirm Dispatch via Your Gmail'}</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      {isRtl
                        ? `أنت على وشك إرسال رسالة بريد إلكتروني إلى (${emailRecipient}) بموضوع "${emailSubject}". هل تؤكد الإرسال؟`
                        : `You are about to send an email to (${emailRecipient}) with subject "${emailSubject}". Confirm sending?`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSendGmail}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold hover:bg-teal-800 transition"
                      >
                        {loading ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : (isRtl ? 'نعم، إرسال الآن' : 'Yes, Send Now')}
                      </button>
                      <button
                        onClick={() => setShowConfirmSend(false)}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (!emailRecipient || !emailSubject || !emailBody) {
                          setErrorMessage(isRtl ? 'يرجى إكمال جميع الحقول قبل المتابعة' : 'Please complete all fields');
                          return;
                        }
                        setShowConfirmSend(true);
                      }}
                      disabled={loading || !isGoogleConnected}
                      className="px-5 py-2.5 rounded-2xl bg-[#183B56] hover:bg-[#183B56]/90 disabled:opacity-50 text-white font-bold transition flex items-center gap-2 shadow-xs"
                    >
                      <Send className="w-4 h-4 text-[#2DD4BF]" />
                      <span>{isRtl ? 'مراجعة وتأكيد إرسال البريد' : 'Review & Send Message'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{isRtl ? 'منظومة مَدَار المجتمعية - غزة' : 'MADAR Smart Community Ecosystem'}</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-xl border border-gray-200 hover:bg-white text-gray-700 font-semibold transition">
            {isRtl ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
