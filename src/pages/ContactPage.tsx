import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { isRtl, t } = useLanguage();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg) return;
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-xs sm:text-sm">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#183B56]">{isRtl ? 'التواصل الميداني والدعم المجتمعي' : 'Field Contact & Community Support'}</h1>
        <p className="text-gray-500 text-xs">
          {isRtl ? 'قنوات تواصل مهيأة للعمل الميداني المباشر حتى مع ضعف إشارات الإنترنت في قطاع غزة.' : 'Communication channels optimized for fragile connectivity in Gaza.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2 text-center">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#0284C7] mx-auto flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#183B56]">{isRtl ? 'المقر الميداني العام' : 'Central Field Hub'}</h3>
          <p className="text-gray-600 text-xs font-medium">{isRtl ? 'دير البلح - بالقرب من المستشفى الميداني' : 'Deir al-Balah, Central Gaza'}</p>
          <span className="text-[10px] text-gray-400 block">{isRtl ? 'مكتب التنسيق المركزي لمؤسس المنظومة ملاك' : 'Founder Malak Coordination Desk'}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2 text-center">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#183B56]">{isRtl ? 'طوارئ واتساب ورسائل نصية (SMS)' : 'SMS & WhatsApp Field Dispatch'}</h3>
          <p className="text-gray-700 text-xs font-mono font-bold">+970 59-902-3271</p>
          <span className="text-[10px] text-teal-700 block">{isRtl ? 'مستقبل الرسائل النصية أوفلاين' : '24/7 Offline SMS Gateway'}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2 text-center">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#183B56]">{isRtl ? 'بريد المؤسس والإدارة' : 'Founder & Official Email'}</h3>
          <p className="text-gray-700 text-xs font-mono font-bold">malkabukhater@gmail.com</p>
          <span className="text-[10px] text-purple-700 block">{isRtl ? 'ملاك أبو خاطر - المؤسس' : 'Malak Abu Khater (Founder)'}</span>
        </div>
      </div>

      {/* Governorate Operational Desks */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-[#183B56] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0284C7]" />
          <span>{isRtl ? 'نقاط التنسيق الميدانية في المحافظات والمخيمات' : 'Governorate Field Coordination Points'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
            <span className="font-bold block text-[#183B56]">{isRtl ? 'دير البلح والوسطى:' : 'Deir al-Balah:'}</span>
            <span className="text-gray-600 text-[11px]">{isRtl ? 'نقطة الأقصى - هاتف: 0599112233' : 'Al-Aqsa Station Point'}</span>
          </div>
          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
            <span className="font-bold block text-teal-900">{isRtl ? 'خان يونس والمواصي:' : 'Khan Younis & Mawasi:'}</span>
            <span className="text-gray-600 text-[11px]">{isRtl ? 'مواصي القرارة - هاتف: 0599556677' : 'Al-Qarara Mawasi Desk'}</span>
          </div>
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <span className="font-bold block text-amber-900">{isRtl ? 'مخيم النصيرات والزوايدة:' : 'Nuseirat & Zawayda:'}</span>
            <span className="text-gray-600 text-[11px]">{isRtl ? 'مخيم 2 - هاتف: 0599334455' : 'Camp 2 Coordination Point'}</span>
          </div>
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
            <span className="font-bold block text-purple-900">{isRtl ? 'مدينة غزة والشمال:' : 'Gaza City & North:'}</span>
            <span className="text-gray-600 text-[11px]">{isRtl ? 'شارع اليرموك والرمال - هاتف: 0599778899' : 'Yarmouk Relief Desk'}</span>
          </div>
        </div>
      </div>

      {/* Message Form */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        {sent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
            <h4 className="font-bold text-base text-[#183B56]">{isRtl ? 'شكراً لتواصلك، تم استلام رسالتك!' : 'Message Received!'}</h4>
            <p className="text-gray-500 text-xs">{isRtl ? 'سيقوم منسق الحي بمراجعة رسالتك والتواصل معك.' : 'A local coordinator will review your message promptly.'}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'اسمك الكريم:' : 'Your Name:'}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">{isRtl ? 'نص الرسالة أو الاستفسار الميداني:' : 'Your Message:'}</label>
              <textarea
                rows={4}
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#0284C7]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#183B56] hover:bg-[#183B56]/90 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isRtl ? 'إرسال الرسالة' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
