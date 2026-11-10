import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand & Vision
    'brand.name': 'مَدَار',
    'brand.full': 'MADAR | مَدَار',
    'brand.tagline': 'من كل احتياج نصنع فرصة، ومن كل مورد نصنع حلاً.',
    'brand.subtagline': 'منظومة مجتمعية ذكية واحدة.. حلول متكاملة لصمود غزة',
    'brand.founder': 'المؤسس وصاحب العلامة: ملاك',
    'brand.founder.short': 'المؤسس: ملاك',

    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'عن مدار',
    'nav.wasel': 'واصل (السوق)',
    'nav.aoun': 'عون (الصيانة)',
    'nav.defa': 'دفا (الإيواء)',
    'nav.qatra': 'قطرة (المياه)',
    'nav.mahara': 'مهارة (الفرص)',
    'nav.request': 'مركز الطلبات',
    'nav.map': 'خريطة المجتمع',
    'nav.media': 'المركز التوعوي',
    'nav.eyecare': 'راحة العين (EyeCare)',
    'nav.dashboards': 'لوحات التحكم',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',
    'nav.lowdata': 'وضع التوفير',

    // Modules
    'module.wasel.title': 'واصل – واحة الاحتياجات المحلية',
    'module.wasel.desc': 'سوق مجتمعي لمستلزمات الطاقة الشمسية، المياه، الشوادر، وأجهزة الطهي البديلة مع عروض الشراء الجماعي وبدائل التوفير.',
    'module.aoun.title': 'عون – منظومة الإصلاح والتدوير',
    'module.aoun.desc': 'صيانة إنفرترات وبطاريات الطاقة، الأجهزة المحمولة، وخياطة الشوادر لمنع الهدر واستعادة كفاءة الموارد المتاحة.',
    'module.defa.title': 'دفا – الإيواء والحماية من الشتاء',
    'module.defa.desc': 'معالجة تسرب مياه الأمطار في الخيام، تدعيم الشوادر، رفع الأرضيات، وأولويات استحقاق دقيقة تحمي الأسر الأشد ضعفاً.',
    'module.qatra.title': 'قطرة – خدمات ونقاط المياه',
    'module.qatra.desc': 'دليل محطات التحلية ومواعيد الصهاريج، بلاغات انقطاع المياه، وتنبيهات نقاء وتحذيرات طبية واضحة.',
    'module.mahara.title': 'مهارة – الكفاءات وفرص العمل',
    'module.mahara.desc': 'سوق المهارات المستقلة في الترجمة، التصميم، التعليم، الخط العربي، والحرف اليدوية لخلق دخل كريم.',

    // Common Buttons & Actions
    'btn.search': 'بحث ذكي',
    'btn.submit': 'إرسال',
    'btn.cancel': 'إلغاء',
    'btn.save': 'حفظ التغييرات',
    'btn.viewDetails': 'عرض التفاصيل',
    'btn.joinGroupBuy': 'انضمام للشراء الجماعي',
    'btn.requestHelp': 'تقديم طلب مساعدة',
    'btn.contactProvider': 'تواصل مع الفني / التاجر',
    'btn.filterAll': 'الكل',
    'btn.installApp': 'تثبيت تطبيق مدار',
    'btn.listenAudio': 'استمع للمحتوى',
    'btn.stopAudio': 'إيقاف الاستماع',
    'btn.copyLink': 'نسخ الرابط',
    'btn.syncNow': 'مزامنة البيانات الآن',
    'btn.quickFilter': 'فلترة سريعة',

    // AI & Search
    'ai.searchPlaceholder': 'صف احتياجك بكلمات بسيطة: مثلاً (تسرب ماء في الخيمة، صيانة إنفرتر، محطة مياه قريبة)...',
    'ai.assistantTitle': 'محرك مدار الذكي (MADAR Intelligence)',
    'ai.assistantSubtitle': 'تحليل فوري للحاجة وتوجيه نحو الوحدة الأنسب والأسرع استجابة',
    'ai.recommendedModule': 'الوحدة الموصى بها',
    'ai.urgencyLevel': 'مستوى الاستعجال التقديري',
    'ai.suggestedSteps': 'الخطوات العملية المقترحة',
    'ai.localAlternatives': 'البدائل المحلية المتاحة',

    // Request Form
    'req.title': 'مركز الطلبات المجتمعية الموحد',
    'req.newTicket': 'تسجيل طلب جديد',
    'req.trackTickets': 'متابعة الطلبات القائمة',
    'req.fieldTitle': 'عنوان الطلب أو المشكلة',
    'req.fieldModule': 'القسم المختص',
    'req.fieldNeighborhood': 'المنطقة أو الحي',
    'req.fieldDesc': 'التفاصيل ووصف الحالة',
    'req.fieldUrgency': 'درجة الاستعجال',
    'req.hasInfants': 'توجد في الأسرة أطفال رضع أو صغار',
    'req.hasSick': 'يوجد أفراد من كبار السن أو ذوي الأمراض المزمنة',
    'req.isFlooded': 'الخيمة مغمورة بالمياه أو معرّضة لانهيار مباشر',
    'req.priorityScore': 'مؤشر أولوية الاستحقاق',
    'req.statusNew': 'جديد',
    'req.statusReview': 'قيد المراجعة',
    'req.statusMatched': 'تم التوجيه للفني/المزود',
    'req.statusProgress': 'جاري المعالجة الميدانية',
    'req.statusCompleted': 'مكتمل بنجاح',
    'req.statusCancelled': 'ملغي',

    // EyeCare
    'eye.title': 'راحة العين من مدار | MADAR Eye Comfort',
    'eye.subtitle': 'تجربة مهدئة مصممة لتقليل إجهاد الشاشة وحساسية الضوء والعيون المجهدة',
    'eye.softSky': 'السماء الهادئة (Soft Sky)',
    'eye.warm': 'القراءة الدافئة (Warm Amber)',
    'eye.dim': 'الواجهة الخافتة (Dim Night)',
    'eye.highContrast': 'وضوح فائق التباين',
    'eye.default': 'الوضع الافتراضي',
    'eye.textSize': 'حجم الخطوط والنصوص',
    'eye.textSizeNormal': 'طبيعي (100%)',
    'eye.textSizeLarge': 'كبير ومريح (115%)',
    'eye.textSizeXLarge': 'كبير جداً (130%)',
    'eye.reducedMotion': 'تعطيل الحركات السريعة (Reduced Motion)',
    'eye.readingFocus': 'تركيز القراءة بدون مشتتات',
    'eye.breakRule': 'تذكير قاعدة 20-20-20 (استراحة كل 20 دقيقة)',
    'eye.blinkReminder': 'تذكير وميض العين الرقيق',
    'eye.ambientSound': 'أصوات طبيعية مهدئة أثناء القراءة',
    'eye.audioNav': 'القراءة الصوتية للمقالات والأدلة',
    'eye.medicalDisclaimer': 'تنويه سلامة صحية: وضع راحة العين يدعم الراحة البصرية وتخفيف إجهاد الشاشة، لكنه ليس علاجاً طبياً لأمراض جفاف العين أو اعتلالات الإبصار. عند استمرار الألم أو الاحمرار يرجى مراجعة طبيب عيون مختص.',

    // Offline & Sync
    'offline.banner': 'وضع العمل بدون اتصال: أنت تتصفح البيانات المخزنة محلياً. سيتم رفع أي طلب جديد تلقائياً عند عودة الإنترنت.',
    'offline.queueCount': 'طلبات مخزنة محلياً تنتظر المزامنة',
    'offline.savedLocal': 'تم الحفظ في الذاكرة المحلية لهاتفك بنجاح.',

    // Roles & Dashboards
    'role.resident': 'مواطن / رب أسرة',
    'role.merchant': 'تاجر ومورد محلي',
    'role.provider': 'فني صيانة وخدمات',
    'role.freelancer': 'مهني مستقل ومبدع',
    'role.organization': 'مؤسسة إنسانية / جمعية',
    'role.admin': 'إدارة المنظومة (Malak & Admin)',

    // Impact & Statistics
    'stat.verifiedPoints': 'نقطة مياه موثقة',
    'stat.repairedDevices': 'جهاز ومعدات تمت صيانتها',
    'stat.shelteredFamilies': 'أسرة دعمت ضد السيول',
    'stat.groupPurchases': 'طلب شراء جماعي منجز',
    'stat.activeProviders': 'فني ومهني مجتمعي'
  },
  en: {
    // Brand & Vision
    'brand.name': 'MADAR',
    'brand.full': 'MADAR | مَدَار',
    'brand.tagline': 'From Every Need, We Create an Opportunity.',
    'brand.subtagline': 'One smart community ecosystem. Countless practical solutions for Gaza resilience.',
    'brand.founder': 'Founder & Brand Owner: Malak',
    'brand.founder.short': 'Founder: Malak',

    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About MADAR',
    'nav.wasel': 'WASEL (Market)',
    'nav.aoun': 'AOUN (Repair)',
    'nav.defa': 'DEFA (Shelter)',
    'nav.qatra': 'QATRA (Water)',
    'nav.mahara': 'MAHARA (Skills)',
    'nav.request': 'Request Center',
    'nav.map': 'Community Map',
    'nav.media': 'Media Hub',
    'nav.eyecare': 'EyeCare Comfort',
    'nav.dashboards': 'Dashboards',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    'nav.lowdata': 'Low-Data Mode',

    // Modules
    'module.wasel.title': 'WASEL – Smart Local Marketplace',
    'module.wasel.desc': 'Local verified supplies for solar, clean water storage, reinforced tarpaulins, biomass stoves, with collective buying discounts.',
    'module.aoun.title': 'AOUN – Repair & Reuse Ecosystem',
    'module.aoun.desc': 'Expert restoration of solar inverters, lithium batteries, phone motherboards, and canvas tent stitching to maximize resources.',
    'module.defa.title': 'DEFA – Shelter & Winter Protection',
    'module.defa.desc': 'Rainwater leakage rapid response, raised tent flooring, stormproofing tarps, with transparent urgency scoring prioritizing vulnerable families.',
    'module.qatra.title': 'QATRA – Community Water Services',
    'module.qatra.desc': 'Live directory of solar desalination points, tanker schedules, shortage alerts, and certified field testing safety notices.',
    'module.mahara.title': 'MAHARA – Skills & Opportunities',
    'module.mahara.desc': 'A dignified freelance marketplace for medical translation, tutoring, calligraphy, graphic design, and handmade craftsmanship.',

    // Common Buttons & Actions
    'btn.search': 'Smart Search',
    'btn.submit': 'Submit',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save Changes',
    'btn.viewDetails': 'View Details',
    'btn.joinGroupBuy': 'Join Group Buy',
    'btn.requestHelp': 'Request Service',
    'btn.contactProvider': 'Contact Provider / Merchant',
    'btn.filterAll': 'All',
    'btn.installApp': 'Install MADAR App',
    'btn.listenAudio': 'Listen to Audio',
    'btn.stopAudio': 'Stop Audio',
    'btn.copyLink': 'Copy Link',
    'btn.syncNow': 'Sync Data Now',
    'btn.quickFilter': 'Quick Filter',

    // AI & Search
    'ai.searchPlaceholder': 'Describe your need: e.g., (rainwater dripping in tent, 1000W inverter beep, nearest clean drinking water)...',
    'ai.assistantTitle': 'MADAR Intelligence Engine',
    'ai.assistantSubtitle': 'Instant practical analysis routing your need to the fastest local module',
    'ai.recommendedModule': 'Recommended Module',
    'ai.urgencyLevel': 'Assessed Urgency Score',
    'ai.suggestedSteps': 'Recommended Action Steps',
    'ai.localAlternatives': 'Feasible Local Alternatives',

    // Request Form
    'req.title': 'Unified Community Request Center',
    'req.newTicket': 'Create New Request',
    'req.trackTickets': 'Track Existing Requests',
    'req.fieldTitle': 'Problem Summary / Title',
    'req.fieldModule': 'Category / Module',
    'req.fieldNeighborhood': 'Neighborhood / Location',
    'req.fieldDesc': 'Full Details & Context',
    'req.fieldUrgency': 'Urgency Level',
    'req.hasInfants': 'Infants or small children present in household',
    'req.hasSick': 'Elderly or chronically ill family members present',
    'req.isFlooded': 'Tent is flooded or at immediate risk of storm collapse',
    'req.priorityScore': 'Priority Calculation Score',
    'req.statusNew': 'New',
    'req.statusReview': 'Under Review',
    'req.statusMatched': 'Matched to Provider',
    'req.statusProgress': 'In Progress',
    'req.statusCompleted': 'Completed',
    'req.statusCancelled': 'Cancelled',

    // EyeCare
    'eye.title': 'MADAR EyeCare Comfort Mode',
    'eye.subtitle': 'Ergonomic visual interface engineered for dry eyes, screen fatigue, and light sensitivity',
    'eye.softSky': 'Soft Sky (Calming Blue)',
    'eye.warm': 'Warm Reading (Warm Amber)',
    'eye.dim': 'Dim Interface (Low Glare)',
    'eye.highContrast': 'High Contrast',
    'eye.default': 'Standard Theme',
    'eye.textSize': 'Typography Scaling',
    'eye.textSizeNormal': 'Normal (100%)',
    'eye.textSizeLarge': 'Comfortable Large (115%)',
    'eye.textSizeXLarge': 'Extra Large (130%)',
    'eye.reducedMotion': 'Reduced Motion (No rapid animations)',
    'eye.readingFocus': 'Distraction-Free Reading Focus',
    'eye.breakRule': '20-20-20 Break Reminder (Every 20 mins)',
    'eye.blinkReminder': 'Gentle Blink Awareness Pulse',
    'eye.ambientSound': 'Calm Nature Ambience while Reading',
    'eye.audioNav': 'Audio Readout for Guides & Text',
    'eye.medicalDisclaimer': 'Important Health Notice: MADAR Eye Comfort supports visual ergonomics and mitigates screen glare fatigue. It is NOT a medical treatment for dry eye disease or eye pathologies. If you experience persistent eye pain, redness, or blurred vision, please seek professional ophthalmic consultation.',

    // Offline & Sync
    'offline.banner': 'Offline Mode: You are viewing locally cached records. Any new submission will automatically sync once connectivity returns.',
    'offline.queueCount': 'Requests queued locally awaiting sync',
    'offline.savedLocal': 'Safely saved to local device storage.',

    // Roles & Dashboards
    'role.resident': 'Resident / Family',
    'role.merchant': 'Local Merchant',
    'role.provider': 'Service Technician',
    'role.freelancer': 'Freelancer & Specialist',
    'role.organization': 'Humanitarian NGO / Society',
    'role.admin': 'System Administrator (Malak & Admin)',

    // Impact & Statistics
    'stat.verifiedPoints': 'Verified Water Points',
    'stat.repairedDevices': 'Solar & Tech Units Repaired',
    'stat.shelteredFamilies': 'Families Stormproofed',
    'stat.groupPurchases': 'Group Buys Delivered',
    'stat.activeProviders': 'Verified Technicians'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('madar_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const isRtl = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    localStorage.setItem('madar_lang', language);
  }, [language, isRtl]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.ar[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
