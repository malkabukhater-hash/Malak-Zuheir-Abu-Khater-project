import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, '.data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Initial Seed Data for Real Operations
function getInitialData() {
  return {
    marketplaceItems: [
      {
        id: 'wasel-1',
        titleAr: 'طاقة شمسية محمولة 12 فولت مع منظم شحن 20A',
        titleEn: '12V Portable Solar Kit with 20A Charge Controller',
        category: 'solar',
        price: 320,
        currency: 'ILS',
        merchantId: 'm-1',
        merchantName: 'مؤسسة النور للطاقة البديلة (Al-Noor Energy)',
        neighborhood: 'Deir al-Balah',
        neighborhoodAr: 'دير البلح',
        availableQty: 14,
        isAvailable: true,
        lastVerified: new Date(Date.now() - 3600000 * 2).toISOString(),
        descriptionAr: 'لوح شمسي 100 واط أحادي البلورة (Monocrystalline) مع منظم شحن PWM 20A، مخارج USB مزدوجة لشحن الهواتف، وسلك 6 ملم² بطول 5 أمتار.',
        descriptionEn: '100W Monocrystalline solar panel with 20A PWM charge controller, dual USB ports, and 5m 6mm² heavy duty cables.',
        alternatives: ['بطارية دراجة نارية 12 فولت مع شاحن يدوي', 'مصباح شمسي مستقل 50 واط'],
        groupBuyEligible: true,
        groupBuyDiscount: 15,
        minGroupQty: 5,
        rating: 4.8,
        reviewCount: 32
      },
      {
        id: 'wasel-2',
        titleAr: 'جالون مياه صحي 20 لتر عالي الكثافة (Food-Grade HDPE)',
        titleEn: '20L Food-Grade HDPE Water Container with Brass Tap',
        category: 'water-tools',
        price: 35,
        currency: 'ILS',
        merchantId: 'm-2',
        merchantName: 'مخزن السلام للتجهيزات (Al-Salam Supplies)',
        neighborhood: 'Khan Younis',
        neighborhoodAr: 'خان يونس',
        availableQty: 65,
        isAvailable: true,
        lastVerified: new Date(Date.now() - 3600000 * 3).toISOString(),
        descriptionAr: 'برميل أبيض غير نافذ للضوء مع صنبور نحاسي محكم وسدادة هوائية لمنع التلوث البكتيري أثناء نقل المياه وتخزينها في الخيمة.',
        descriptionEn: 'Heavy duty UV-resistant white container with sealable dispensing spigot and air vent.',
        alternatives: ['أكياس مياه قابلة للطي 15 لتر', 'جالون 10 لتر مزدوج المقبض'],
        groupBuyEligible: true,
        groupBuyDiscount: 20,
        minGroupQty: 10,
        rating: 4.9,
        reviewCount: 48
      },
      {
        id: 'wasel-3',
        titleAr: 'شادر نايلون عازل حراري ومقاوم للأمطار والسيول (4×6 متر - 220 GSM)',
        titleEn: 'Heavy-Duty Reinforced Rain & Thermal Tarp (4x6m - 220 GSM)',
        category: 'shelter',
        price: 75,
        currency: 'ILS',
        merchantId: 'm-3',
        merchantName: 'مركز غزة لمواد الإيواء (Gaza Shelter Depot)',
        neighborhood: 'Nuseirat',
        neighborhoodAr: 'النصيرات',
        availableQty: 28,
        isAvailable: true,
        lastVerified: new Date(Date.now() - 3600000 * 1).toISOString(),
        descriptionAr: 'شادر سميك 220 غرام/م² مدعم بحلقات ألمنيوم مقاومة للصدأ كل 50 سم، مع طبقة عاكسة للأشعة فوق البنفسجية لحماية سقف الخيام من السيول.',
        descriptionEn: '220 GSM waterproof reinforced polyethylene tarp with rustproof eyelets every 50cm and UV protection.',
        alternatives: ['رول نايلون دفيئات زراعية شفاف 200 ميكرون', 'شادر تركي 3×4 متر'],
        groupBuyEligible: true,
        groupBuyDiscount: 14,
        minGroupQty: 8,
        rating: 4.8,
        reviewCount: 56
      },
      {
        id: 'wasel-4',
        titleAr: 'موقد طهي اقتصادي بحطب/كرتون (Rocket Stove معزول حرارياً)',
        titleEn: 'Insulated Rocket Biomass Stove (Local Engineering)',
        category: 'cooking',
        price: 65,
        currency: 'ILS',
        merchantId: 'm-4',
        merchantName: 'ورشة الأمل للحدادة (Al-Amal Metalcraft)',
        neighborhood: 'Zawayda',
        neighborhoodAr: 'الزوايدة',
        availableQty: 18,
        isAvailable: true,
        lastVerified: new Date(Date.now() - 3600000 * 4).toISOString(),
        descriptionAr: 'موقد مصنوع محلياً ببطانة طين حراري عازلة توفر 70% من استهلاك الحطب وتنتج لهباً نقياً بدون دخان كثيف يؤذي الأطفال داخل المخيم.',
        descriptionEn: 'Thermal-insulated combustion stove engineered for minimal firewood consumption and low smoke output.',
        alternatives: ['سخان ماء كهربائي 12 فولت', 'كانون طهي طيني تقليدي'],
        groupBuyEligible: true,
        groupBuyDiscount: 15,
        minGroupQty: 4,
        rating: 4.9,
        reviewCount: 41
      },
      {
        id: 'wasel-5',
        titleAr: 'بطارية جل عميقة التفريغ 12V 100Ah (Deep Cycle Solar Gel)',
        titleEn: '12V 100Ah Deep Cycle Solar Gel Battery',
        category: 'solar',
        price: 580,
        currency: 'ILS',
        merchantId: 'm-1',
        merchantName: 'مؤسسة النور للطاقة البديلة (Al-Noor Energy)',
        neighborhood: 'Deir al-Balah',
        neighborhoodAr: 'دير البلح',
        availableQty: 9,
        isAvailable: true,
        lastVerified: new Date(Date.now() - 3600000 * 2).toISOString(),
        descriptionAr: 'بطارية مخصصة لمنظومات الطاقة الشمسية المنزلية، تتحمل دورات شحن وتفريغ يومية تصل إلى 1200 دورة عند عمق تفريغ 50%.',
        descriptionEn: 'Heavy-duty sealed gel battery built for daily solar cyclic storage with up to 1200 cycles at 50% DOD.',
        alternatives: ['بطارية ليثيوم LiFePO4 50Ah', 'تجديد واسترجاع سعة بطاريات حمضية'],
        groupBuyEligible: true,
        groupBuyDiscount: 10,
        minGroupQty: 3,
        rating: 4.9,
        reviewCount: 24
      },
      {
        id: 'wasel-6',
        titleAr: 'إنفرتر موجة جيبية نقية 1000 واط مع حماية من الحمل الزائد',
        titleEn: '1000W Pure Sine Wave Power Inverter (12V to 220V)',
        category: 'solar',
        price: 240,
        currency: 'ILS',
        merchantId: 'm-1',
        merchantName: 'مؤسسة النور للطاقة البديلة (Al-Noor Energy)',
        neighborhood: 'Gaza City',
        neighborhoodAr: 'مدينة غزة - الرمال',
        availableQty: 11,
        isAvailable: true,
        lastVerified: new Date(Date.now() - 3600000 * 5).toISOString(),
        descriptionAr: 'إنفرتر يحول تيار 12 فولت إلى 220 فولت لتشغيل أجهزة التنفس الطبية وشواحن اللابتوب ومعدات الإضاءة دون إتلاف الدوائر الإلكترونية.',
        descriptionEn: 'Pure sine wave inverter for delicate medical gear, laptops, and lighting with over-voltage and thermal auto-cutoff.',
        alternatives: ['إنفرتر موجة معدلة 800 واط'],
        groupBuyEligible: true,
        groupBuyDiscount: 12,
        minGroupQty: 4,
        rating: 4.7,
        reviewCount: 18
      }
    ],
    repairTechnicians: [
      {
        id: 'tech-1',
        nameAr: 'المهندس أحمد البردويل',
        nameEn: 'Eng. Ahmad Bardawil',
        specialtyAr: 'إصلاح إنفرترات وبطاريات الطاقة الشمسية وتوصيلات 12 فولت وتبديل موسفيت (MOSFET)',
        specialtyEn: 'Solar Inverters, Battery Desulfation, MOSFET Board Replacement & 12V DC Repairs',
        neighborhood: 'Deir al-Balah',
        neighborhoodAr: 'دير البلح',
        phone: '+970 59-911-2233',
        rating: 4.9,
        jobsCompleted: 168,
        isAvailable: true,
        hourlyRate: 'بدل رمزي (15-30 شيكل) أو تبادل خدمات مجتمعية',
        experienceYears: 12
      },
      {
        id: 'tech-2',
        nameAr: 'الأستاذ خليل المدهون',
        nameEn: 'Khalil Al-Madhoun',
        specialtyAr: 'صيانة الهواتف المحمولة واللاسلكي ومكبرات الصوت وتبديل شاشات ومنافذ الشحن',
        specialtyEn: 'Mobile Handset Micro-Soldering, Type-C Ports & Two-Way Radio Receivers',
        neighborhood: 'Nuseirat',
        neighborhoodAr: 'النصيرات',
        phone: '+970 59-933-4455',
        rating: 4.8,
        jobsCompleted: 115,
        isAvailable: true,
        hourlyRate: '20-40 شيكل حسب قطع الغيار المستعملة',
        experienceYears: 9
      },
      {
        id: 'tech-3',
        nameAr: 'أم يوسف (ورشة خياطة الأمل)',
        nameEn: 'Um Youssef (Al-Amal Stitching)',
        specialtyAr: 'خياطة وتدعيم شوادر الخيام والفرشات وتثبيت حلقات التثبيت المعدنية',
        specialtyEn: 'Heavy Canvas Tarp Stitching, Tent Reinforcement & Brass Grommet Installation',
        neighborhood: 'Khan Younis',
        neighborhoodAr: 'خان يونس - مواصي القرارة',
        phone: '+970 59-955-6677',
        rating: 5.0,
        jobsCompleted: 245,
        isAvailable: true,
        hourlyRate: '15 شيكل للقطعة / مجاني للعائلات الأشد حاجة',
        experienceYears: 16
      },
      {
        id: 'tech-4',
        nameAr: 'الفني محمود الزهارنة',
        nameEn: 'Mahmoud Al-Zaharna',
        specialtyAr: 'صيانة مضخات المياه الغاطسة وتمديد خطوط الأنابيب وفلاتر التحلية',
        specialtyEn: 'Submersible Water Pumps, RO Filter Membrane Flushing & Pipeline Plumbing',
        neighborhood: 'Zawayda',
        neighborhoodAr: 'الزوايدة',
        phone: '+970 59-977-8899',
        rating: 4.9,
        jobsCompleted: 87,
        isAvailable: true,
        hourlyRate: '25 شيكل / استشارات مجانية لمحطات التوزيع',
        experienceYears: 14
      }
    ],
    waterPoints: [
      {
        id: 'water-1',
        nameAr: 'محطة تحلية مياه الأقصى الخيرية (RO بالطاقة الشمسية)',
        nameEn: 'Al-Aqsa Charitable RO Desalination Station (Solar-Powered)',
        type: 'potable',
        typeLabelAr: 'مياه صالحة للشرب (محلاة بتقنية التناضح العكسي RO)',
        typeLabelEn: 'Drinking Water (Treated RO Multi-Stage)',
        neighborhood: 'Deir al-Balah',
        neighborhoodAr: 'دير البلح - بالقرب من المستشفى الميداني',
        status: 'active',
        operatingHours: '08:00 - 16:30 يومياً',
        capacityNotesAr: 'طاقة إنتاجية 24 م³ يومياً. حصة مجانية 20 لتر لكل أسرة مسجلة يومياً.',
        capacityNotesEn: 'Daily output 24,000L. Free quota: 20L per registered household per day.',
        lastReported: new Date(Date.now() - 3600000 * 1).toISOString(),
        reporter: 'لجنة الحي المجتمعية - دير البلح',
        verified: true,
        waterQualityNoticeAr: 'فحص ميداني دوري: TDS: 240 ppm | كلور حر: 0.3 mg/L | درجة الحموضة pH: 7.2. معيار Sphere الإنساني مستوفى.',
        waterQualityNoticeEn: 'Field Verified: TDS 240 ppm | Free Chlorine 0.3 mg/L | pH 7.2. Meets Sphere humanitarian standards.'
      },
      {
        id: 'water-2',
        nameAr: 'نقطة بئر السلام للمياه الاستخدامية والمنزلية',
        nameEn: 'Al-Salam Utility & Domestic Water Well',
        type: 'utility',
        typeLabelAr: 'مياه غسيل واستخدام منزلي (غير صالحة للشرب إطلاقاً)',
        typeLabelEn: 'Domestic Utility Water (Strictly Non-potable)',
        neighborhood: 'Nuseirat',
        neighborhoodAr: 'مخيم 2 - النصيرات (بجوار السوق القديم)',
        status: 'active',
        operatingHours: '08:30 - 15:00',
        capacityNotesAr: 'تعبئة صهاريج وبراميل للغسيل والنظافة المنزلية وإطفاء الحرائق.',
        capacityNotesEn: 'Container refilling for washing, laundry, sanitation, and emergency fire control.',
        lastReported: new Date(Date.now() - 3600000 * 3).toISOString(),
        reporter: 'بلدية النصيرات - دائرة المياه',
        verified: true,
        waterQualityNoticeAr: 'تحذير طبي قاطع: نسبة الملوحة TDS تتجاوز 1,800 ppm. يحظر شربها أو طهي الطعام بها.',
        waterQualityNoticeEn: 'Strict Health Alert: Saline content TDS > 1,800 ppm. Strictly for domestic cleaning.'
      },
      {
        id: 'water-3',
        nameAr: 'صهريج التوزيع المتنقل التكافلي #4 (مواصي خانيونس)',
        nameEn: 'Mobile Clean Water Tanker Truck #4 (Al-Mawasi)',
        type: 'potable',
        typeLabelAr: 'مياه شرب محلاة متنقلة عبر صهاريج معقمة',
        typeLabelEn: 'Mobile Chlorinated Clean Water Tanker',
        neighborhood: 'Khan Younis',
        neighborhoodAr: 'خان يونس - مواصي القرارة (مربع خيام الصفا)',
        status: 'scheduled',
        operatingHours: 'اليوم من 12:30 - 16:00',
        capacityNotesAr: 'صهريج سعة 10,000 لتر مزود بمضخة شمسية ونظام تذاكر دورية لمنع التدافع.',
        capacityNotesEn: '10,000L food-grade tanker with solar pump and community queue voucher system.',
        lastReported: new Date(Date.now() - 3600000 * 2).toISOString(),
        reporter: 'فريق قطرة الميداني ومبادرة سكن',
        verified: true,
        waterQualityNoticeAr: 'خاضعة للكلورة القياسية 0.4 ppm مع شهادة نظافة الخزان اليومية.',
        waterQualityNoticeEn: 'Chlorinated at 0.4 ppm with daily tank sterilization log.'
      },
      {
        id: 'water-4',
        nameAr: 'محطة مياه اليرموك المركزية (مدينة غزة والرمال)',
        nameEn: 'Al-Yarmouk Central RO Station (Gaza City)',
        type: 'potable',
        typeLabelAr: 'مياه صالحة للشرب (محلاة مركزية)',
        typeLabelEn: 'Drinking Water (Central Solar Desalination)',
        neighborhood: 'Gaza City',
        neighborhoodAr: 'مدينة غزة - شارع اليرموك',
        status: 'active',
        operatingHours: '09:00 - 15:00',
        capacityNotesAr: 'طاقة 18 م³ يومياً، توزيع مجاني لأسر مخيم الشاطئ والرمال الشمالي.',
        capacityNotesEn: '18,000L daily capacity serving Al-Shati camp and North Rimal households.',
        lastReported: new Date(Date.now() - 3600000 * 4).toISOString(),
        reporter: 'لجنة طوارئ غزة',
        verified: true,
        waterQualityNoticeAr: 'TDS: 260 ppm | كلور حر: 0.35 mg/L | فحص بكتيري سلبي.',
        waterQualityNoticeEn: 'TDS 260 ppm | Free Chlorine 0.35 mg/L | Tested negative for coliform.'
      }
    ],
    shelterSupplies: [
      {
        id: 'shelter-1',
        titleAr: 'شوادر بيضاء عاكسة للحرارة ومقاومة للماء والسيول (4×6 متر - 220 GSM)',
        titleEn: 'Heat-Reflective Waterproof Polyethylene Tarpaulins (4x6m - 220 GSM)',
        available: 48,
        organization: 'ائتلاف إيواء غزة التكافلي',
        neighborhood: 'Deir al-Balah',
        neighborhoodAr: 'دير البلح',
        priorityCriterion: 'العائلات التي غمرت مياه الأمطار خيامها وبها أطفال رضع',
        urgencyMin: 'high'
      },
      {
        id: 'shelter-2',
        titleAr: 'طبليات ألواح خشبية معالجة لرفع أرضيات الخيام (120×80 سم)',
        titleEn: 'Treated Wooden Pallet Platforms for Flood-Proof Tent Flooring',
        available: 36,
        organization: 'مبادرة سكن كريم المجتمعية',
        neighborhood: 'Khan Younis',
        neighborhoodAr: 'خان يونس',
        priorityCriterion: 'خيام بها كبار سن طريحو الفراش أو أطفال مصابون بأمراض صدرية',
        urgencyMin: 'urgent'
      },
      {
        id: 'shelter-3',
        titleAr: 'لفائف نايلون عازل شفاف دفيئات زراعية (عرض 8 أمتار - سمك 200 ميكرون)',
        titleEn: 'Heavy Duty 200-Micron Clear Greenhouse Polyethylene Sheeting',
        available: 22,
        organization: 'مركز دفا لحماية المخيمات',
        neighborhood: 'Nuseirat',
        neighborhoodAr: 'النصيرات',
        priorityCriterion: 'الخيام المكشوفة ذات الأسقف المهترئة المعرضة للرياح العاتية',
        urgencyMin: 'high'
      }
    ],
    skills: [
      {
        id: 'skill-1',
        titleAr: 'ترجمة طبية متخصصة وملفات إحلاء وإغاثة إنسانية (عربي - إنجليزي)',
        titleEn: 'Medical Referral & Humanitarian Evacuation Translation (AR-EN)',
        providerName: 'ريم حسونة',
        category: 'translation',
        rate: 'تبرع كامل للحالات الإنسانية / رمزي للمؤسسات',
        rating: 5.0,
        reviewsCount: 42,
        neighborhood: 'Deir al-Balah',
        neighborhoodAr: 'دير البلح',
        bioAr: 'مترجمة طبية معتمدة، خبرة 6 سنوات مع منظمة الصحة العالمية واللجنة الدولية للصليب الأحمر.',
        bioEn: 'Certified medical translator with 6 years experience translating referral dossiers for WHO and ICRC.',
        badges: ['متحقق من الهوية', 'استجابة سريعة < ساعة', 'تطوع إنساني']
      },
      {
        id: 'skill-2',
        titleAr: 'دروس تقوية ودعم تعليمي للرياضيات والعلوم للمرحلة الأساسية والإعدادية',
        titleEn: 'Primary & Middle School Math & Science Bridge Tutoring',
        providerName: 'أ. محمود النجار',
        category: 'education',
        rate: 'مجاني تطوعي في الخيام التعليمية / تبادل مهارات',
        rating: 4.9,
        reviewsCount: 58,
        neighborhood: 'Khan Younis',
        neighborhoodAr: 'خان يونس - مواصي القرارة',
        bioAr: 'معلم رياضيات حائز على جائزة التميز، ينظم حلقات تعليمية للأطفال لتعويض الفاقد الدراسي.',
        bioEn: 'Dedicated mathematics educator organizing tent classrooms to compensate for educational disruptions.',
        badges: ['مبادر مجتمعي', 'حائز على تزكية الحي']
      },
      {
        id: 'skill-3',
        titleAr: 'خط عربي وهوية بصرية رقمية وتصميم ملصقات توعية إغاثية',
        titleEn: 'Arabic Calligraphy, Graphic Identity & Relief Signage Design',
        providerName: 'عمر شعت',
        category: 'design',
        rate: '30-50 شيكل للعمل الرقمي الكامل',
        rating: 4.8,
        reviewsCount: 29,
        neighborhood: 'Nuseirat',
        neighborhoodAr: 'النصيرات',
        bioAr: 'مصمم جرافيك وخطاط متخصص في الشعارات الواضحة والتصاميم خفيفة الحجم التي يسهل إرسالها بالشبكات الضعيفة.',
        bioEn: 'Graphic artist specializing in lightweight emergency infographics and traditional Arabic lettering.',
        badges: ['فنان مدار المعتمد']
      },
      {
        id: 'skill-4',
        titleAr: 'تركيب وضبط زوايا الألواح الشمسية وفحص كفاءة الشحن',
        titleEn: 'Solar PV Array Mounting, Tilt Angle Optimization & Testing',
        providerName: 'صائب القدوة',
        category: 'engineering',
        rate: '25 شيكل للكشف وضبط الزوايا',
        rating: 4.9,
        reviewsCount: 37,
        neighborhood: 'Gaza City',
        neighborhoodAr: 'مدينة غزة - الرمال',
        bioAr: 'فني طاقة متجددة حاصل على دبلوم متخصص في حساب زوايا الإشعاع الشمسي وحماية البطاريات من التفريغ العميق.',
        bioEn: 'Renewable technician skilled in optimizing solar irradiance angles and battery cycle longevity.',
        badges: ['فني معتمد']
      }
    ],
    requests: [
      {
        id: 'req-101',
        title: 'تسرب مياه أمطار في سقف الخيمة وتلف في الشادر الشمالي',
        module: 'defa',
        category: 'water_leakage',
        neighborhood: 'Deir al-Balah',
        neighborhoodAr: 'دير البلح - مخيم المحطة',
        status: 'In Progress',
        urgency: 'high',
        urgencyScore: 88,
        requesterName: 'أم عبد الله',
        requesterRole: 'resident',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        description: 'لدينا ثلاثة أطفال رضع وتجمعت المياه داخل الخيمة بعد الأمطار الأخيرة، نحتاج تدعيم شادر عاجل ورفع الأرضية.',
        assignedTo: 'فريق دفا التطوعي - دير البلح',
        timeline: [
          { status: 'New', time: new Date(Date.now() - 3600000 * 8).toISOString(), note: 'تم تسجيل الطلب في النظام' },
          { status: 'Under Review', time: new Date(Date.now() - 3600000 * 7).toISOString(), note: 'تم تقييم درجة الاستحقاق: عاجل لوجود أطفال' },
          { status: 'Matched', time: new Date(Date.now() - 3600000 * 5).toISOString(), note: 'تم التوجيه لورشة خياطة الشوادر وفريق دفا' },
          { status: 'In Progress', time: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'جاري تسليم الشادر المقاوم للأمطار' }
        ]
      },
      {
        id: 'req-102',
        title: 'عطل في إنفرتر الطاقة الشمسية 1000 واط (حماية زائدة)',
        module: 'aoun',
        category: 'solar_repair',
        neighborhood: 'Khan Younis',
        neighborhoodAr: 'خان يونس - المواصي',
        status: 'Matched',
        urgency: 'medium',
        urgencyScore: 65,
        requesterName: 'محمد فياض',
        requesterRole: 'resident',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        description: 'الإنفرتر يطلق صفارة تحذيرية ويتوقف عند ربطه ببطارية الجل 100 أمبير. نحتاج فحص الموسفيت والمروحة.',
        assignedTo: 'المهندس أحمد البردويل',
        timeline: [
          { status: 'New', time: new Date(Date.now() - 3600000 * 18).toISOString(), note: 'تم استلام تفاصيل العطل' },
          { status: 'Matched', time: new Date(Date.now() - 3600000 * 12).toISOString(), note: 'قبل الفني أحمد الطلب لتقديم الكشف المجاني' }
        ]
      },
      {
        id: 'req-103',
        title: 'انقطاع ضخ المياه عن مربع خيام مدرسة القدس لليوم الثالث',
        module: 'qatra',
        category: 'water_shortage',
        neighborhood: 'Nuseirat',
        neighborhoodAr: 'النصيرات - غرب المخيم',
        status: 'Under Review',
        urgency: 'urgent',
        urgencyScore: 94,
        requesterName: 'لجنة خيام الإيواء',
        requesterRole: 'organization',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        description: 'أكثر من 85 أسرة بدون مياه نظيفة بعد عطل في خط الأنابيب الفرعي. مطلوب تسيير صهريج طوارئ.',
        timeline: [
          { status: 'New', time: new Date(Date.now() - 3600000 * 3).toISOString(), note: 'تم رفع البلاغ من منسق الحي' },
          { status: 'Under Review', time: new Date(Date.now() - 3600000 * 1).toISOString(), note: 'جاري التنسيق مع مصلحة مياه بلديات الساحل' }
        ]
      }
    ],
    groupPurchases: [
      {
        id: 'grp-1',
        titleAr: 'طلب شراء جماعي: ألواح شمسية 100 واط مع بطاريات لحي البركة',
        titleEn: 'Group Buy: 100W Solar Panels & Batteries for Al-Baraka',
        targetQty: 10,
        currentQty: 7,
        unitPrice: 280,
        regularPrice: 340,
        savingsPercent: 18,
        deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
        neighborhood: 'Deir al-Balah',
        neighborhoodAr: 'دير البلح',
        status: 'collecting'
      },
      {
        id: 'grp-2',
        titleAr: 'شراء جماعي: شوادر نايلون سميكة مع حلقات تثبيت لعشرين خيمة',
        titleEn: 'Group Buy: Reinforced Weatherproof Tarps for 20 Tents',
        targetQty: 20,
        currentQty: 16,
        unitPrice: 62,
        regularPrice: 75,
        savingsPercent: 17,
        deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
        neighborhood: 'Khan Younis',
        neighborhoodAr: 'خان يونس',
        status: 'collecting'
      }
    ],
    reusableGoods: [
      {
        id: 'reuse-1',
        titleAr: 'أسلاك كهربائية 2.5 ملم مع قواطع ومقابس بحالة ممتازة',
        titleEn: '2.5mm Copper Wiring & Circuit Breakers (Excellent Condition)',
        condition: 'Good / مستعمل بحالة جيدة',
        exchangeType: 'donation',
        exchangeTypeLabelAr: 'تبرع مجاني لمن يحتاجه',
        ownerName: 'أبو كريم',
        neighborhood: 'Deir al-Balah',
        neighborhoodAr: 'دير البلح'
      },
      {
        id: 'reuse-2',
        titleAr: 'عربة يد ثنائية العجلات لنقل الجالونات والمؤن',
        titleEn: 'Two-Wheel Heavy Hand Cart for Water Containers',
        condition: 'Used / مستعمل متين',
        exchangeType: 'barter',
        exchangeTypeLabelAr: 'مقايضة بموقد حطب أو شادر',
        ownerName: 'سعيد عثمان',
        neighborhood: 'Nuseirat',
        neighborhoodAr: 'النصيرات'
      }
    ],
    auditLogs: [
      {
        id: 'log-1',
        action: 'Water Point Verified',
        actionAr: 'توثيق نقطة مياه الأقصى ومطابقة معايير TDS',
        actor: 'Admin / ملاك أبو خاطر (Malak)',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'log-2',
        action: 'Merchant Validated',
        actionAr: 'اعتماد مؤسسة النور للطاقة وتدقيق أسعار الألواح',
        actor: 'Admin / ملاك أبو خاطر (Malak)',
        timestamp: new Date(Date.now() - 3600000 * 14).toISOString()
      }
    ]
  };
}


// Ensure database file exists
function loadDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read db.json, returning initial data:', err);
    return getInitialData();
  }
}

function saveDatabase(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to db.json:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Global state loaded from DB
  let db = loadDatabase();

  // API Endpoints
  // 1. Health check & configuration info
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'MADAR | مَدَار',
      founder: 'Malak',
      version: '1.0.0',
      aiConfigured: !!process.env.GEMINI_API_KEY,
      storage: 'Persistent JSON Store (.data/db.json)',
      serverTime: new Date().toISOString()
    });
  });

  // 2. Full state dump for offline caching
  app.get('/api/bootstrap', (req, res) => {
    res.json(db);
  });

  // 3. Requests: List, Create, Update Status
  app.get('/api/requests', (req, res) => {
    res.json(db.requests);
  });

  app.post('/api/requests', (req, res) => {
    const newReq = {
      id: 'req-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'New',
      timeline: [
        {
          status: 'New',
          time: new Date().toISOString(),
          note: req.body.noteAr || 'تم استلام وتوثيق الطلب بنجاح'
        }
      ],
      ...req.body
    };

    // Calculate urgency score if not set
    if (!newReq.urgencyScore) {
      let score = 50;
      if (newReq.urgency === 'urgent') score += 40;
      if (newReq.urgency === 'high') score += 25;
      if (newReq.hasInfants) score += 15;
      if (newReq.hasSickOrElderly) score += 15;
      if (newReq.floodedTent) score += 20;
      newReq.urgencyScore = Math.min(100, score);
    }

    db.requests.unshift(newReq);
    db.auditLogs.unshift({
      id: 'log-' + Date.now(),
      action: 'Request Created',
      actionAr: `تم إنشاء طلب جديد #${newReq.id.slice(-4)} (${newReq.title})`,
      actor: newReq.requesterName || 'Resident',
      timestamp: new Date().toISOString()
    });

    saveDatabase(db);
    res.status(201).json(newReq);
  });

  app.patch('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const index = db.requests.findIndex((r: any) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const current = db.requests[index];
    const updated = { ...current, ...req.body };

    if (req.body.status && req.body.status !== current.status) {
      updated.timeline = [
        ...(updated.timeline || []),
        {
          status: req.body.status,
          time: new Date().toISOString(),
          note: req.body.statusNote || `تغيرت حالة الطلب إلى: ${req.body.status}`
        }
      ];
    }

    db.requests[index] = updated;
    saveDatabase(db);
    res.json(updated);
  });

  // 4. Marketplace items
  app.get('/api/marketplace', (req, res) => {
    res.json(db.marketplaceItems);
  });

  app.post('/api/marketplace', (req, res) => {
    const item = {
      id: 'wasel-' + Date.now(),
      lastVerified: new Date().toISOString(),
      isAvailable: true,
      rating: 5.0,
      reviewCount: 1,
      ...req.body
    };
    db.marketplaceItems.unshift(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  // 5. Water points
  app.get('/api/water', (req, res) => {
    res.json(db.waterPoints);
  });

  app.post('/api/water/report', (req, res) => {
    const report = {
      id: 'water-rep-' + Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    // Also create a water shortage request in unified requests if urgent
    if (req.body.type === 'shortage') {
      const shortageReq = {
        id: 'req-' + Date.now(),
        title: `بلاغ شح مياه: ${req.body.location}`,
        module: 'qatra',
        category: 'water_shortage',
        neighborhood: req.body.neighborhood || 'Deir al-Balah',
        neighborhoodAr: req.body.neighborhoodAr || req.body.neighborhood,
        status: 'Under Review',
        urgency: 'urgent',
        urgencyScore: 92,
        requesterName: req.body.reporterName || 'مواطن مساهم',
        createdAt: new Date().toISOString(),
        description: req.body.details,
        timeline: [
          { status: 'New', time: new Date().toISOString(), note: 'تم رفع بلاغ شح المياه' }
        ]
      };
      db.requests.unshift(shortageReq);
    }
    saveDatabase(db);
    res.status(201).json({ success: true, report });
  });

  // 6. Repair Technicians
  app.get('/api/repair-technicians', (req, res) => {
    res.json(db.repairTechnicians);
  });

  // 7. Group Purchases
  app.get('/api/group-purchases', (req, res) => {
    res.json(db.groupPurchases);
  });

  app.post('/api/group-purchases/:id/join', (req, res) => {
    const { id } = req.params;
    const grp = db.groupPurchases.find((g: any) => g.id === id);
    if (!grp) return res.status(404).json({ error: 'Group buy not found' });
    grp.currentQty = (grp.currentQty || 0) + (req.body.qty || 1);
    if (grp.currentQty >= grp.targetQty) {
      grp.status = 'fulfilled';
    }
    saveDatabase(db);
    res.json(grp);
  });

  // 8. Offline Sync Endpoint (takes array of queued mutations from browser and processes them sequentially)
  app.post('/api/sync', (req, res) => {
    const { mutations } = req.body;
    if (!Array.isArray(mutations)) {
      return res.status(400).json({ error: 'Invalid mutations payload' });
    }

    const results = [];
    for (const m of mutations) {
      try {
        if (m.type === 'CREATE_REQUEST') {
          const newReq = {
            id: m.payload.id || 'req-' + Date.now(),
            createdAt: m.payload.createdAt || new Date().toISOString(),
            status: m.payload.status || 'New',
            timeline: m.payload.timeline || [
              { status: 'New', time: new Date().toISOString(), note: 'تمت مزامنة الطلب المخزن محلياً' }
            ],
            ...m.payload
          };
          db.requests.unshift(newReq);
          results.push({ id: m.id, success: true, entityId: newReq.id });
        } else if (m.type === 'UPDATE_REQUEST_STATUS') {
          const reqItem = db.requests.find((r: any) => r.id === m.payload.id);
          if (reqItem) {
            reqItem.status = m.payload.status;
            reqItem.timeline.push({
              status: m.payload.status,
              time: new Date().toISOString(),
              note: m.payload.note || 'مزامنة تغيير الحالة'
            });
            results.push({ id: m.id, success: true });
          }
        } else if (m.type === 'CREATE_PRODUCT') {
          const item = {
            id: 'wasel-' + Date.now(),
            lastVerified: new Date().toISOString(),
            ...m.payload
          };
          db.marketplaceItems.unshift(item);
          results.push({ id: m.id, success: true, entityId: item.id });
        }
      } catch (err: any) {
        results.push({ id: m.id, success: false, error: err.message });
      }
    }

    saveDatabase(db);
    res.json({ processed: results.length, results, serverTimestamp: new Date().toISOString() });
  });

  // 9. MADAR Intelligence Engine (AI Assistant & Semantic Matcher)
  app.post('/api/ai/analyze', async (req, res) => {
    const { query, language = 'ar' } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Try Gemini first if API key is present
    if (geminiClient && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are MADAR (مَدَار) Community Intelligence Engine for Gaza.
Analyze this user need or problem: "${query}".

MADAR has 5 core modules:
1. "wasel" (Marketplace: food, solar panels, batteries, water containers, fuel, stoves)
2. "aoun" (Repair & Reuse: fixing solar inverters, phones, electronics, tarps, shoes, sewing, reusable tools)
3. "defa" (Shelter: tent rain leakage, flooding, raised flooring, storm protection, tarpaulins, blankets)
4. "qatra" (Water: drinking water points, RO stations, water shortage reports, filling schedules, utility water)
5. "mahara" (Skills: translation, tutoring, calligraphy, graphic design, tutoring children, handicrafts)

Return a strictly valid JSON object with these keys:
{
  "recommendedModule": "wasel" | "aoun" | "defa" | "qatra" | "mahara",
  "moduleNameAr": "اسم الوحدة بالعربية",
  "moduleNameEn": "Module Name in English",
  "urgency": "low" | "medium" | "high" | "urgent",
  "urgencyReasonAr": "سبب التقييم بالعربية مع مراعاة السلامة والأطفال",
  "urgencyReasonEn": "Reason for urgency assessment in English",
  "suggestedActionsAr": ["خطوة 1", "خطوة 2"],
  "suggestedActionsEn": ["Step 1", "Step 2"],
  "alternativeSolutionsAr": ["بديل عملي متاح محلياً 1", "بديل 2"],
  "alternativeSolutionsEn": ["Alternative 1", "Alternative 2"],
  "matchedCategory": "category_slug",
  "safetyDisclaimer": "ملاحظة سلامة واضحة"
}`;

        const geminiPromise = geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'You are an intelligent, empathetic, practical community resource routing system for emergency and economic resilience in Gaza. Always output strictly valid JSON.'
          }
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI request timed out, switching to local engine')), 3500)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            mode: 'gemini-live',
            model: 'gemini-3.8-flash',
            analysis: parsed
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call timed out or failed, falling back to deterministic local rule engine:', geminiError);
      }
    }

    // Deterministic Rule-Based Fallback (Honest & Transparent)
    const qLower = query.toLowerCase();
    let module = 'wasel';
    let moduleNameAr = 'واصل (سوق الاحتياجات)';
    let moduleNameEn = 'WASEL (Local Marketplace)';
    let urgency = 'medium';
    let urgencyReasonAr = 'طلب مجتمعي اعتيادي لتأمين مستلزمات';
    let urgencyReasonEn = 'Standard community procurement request';
    let alternativesAr = ['البحث عن بدائل محلية قابلة لإعادة التدوير', 'طلب شراء جماعي لخفض التكلفة'];
    let alternativesEn = ['Search local recycled alternatives', 'Group purchase request to reduce costs'];
    let actionsAr = ['تصفح المنتجات المتوفرة والمتحقق منها في منطقتك', 'التواصل المباشر مع التاجر لتأكيد التوفر'];
    let actionsEn = ['Browse verified available items in your neighborhood', 'Contact merchant directly to confirm availability'];
    let safetyNotice = 'تأكد من المعاينة قبل الاستلام وتحقق من تاريخ التوفر المحدث.';

    if (qLower.includes('مطر') || qLower.includes('تسرب') || qLower.includes('شادر') || qLower.includes('سقف') || qLower.includes('خيمة') || qLower.includes('طين') || qLower.includes('برد') || qLower.includes('تشتي') || qLower.includes('tent') || qLower.includes('rain') || qLower.includes('leak') || qLower.includes('shelter')) {
      module = 'defa';
      moduleNameAr = 'دفا (خدمات الإيواء والحماية من الشتاء)';
      moduleNameEn = 'DEFA (Shelter & Winterization)';
      urgency = (qLower.includes('غرق') || qLower.includes('اطفال') || qLower.includes('رضيع') || qLower.includes('severe') || qLower.includes('flood')) ? 'urgent' : 'high';
      urgencyReasonAr = 'تسرب مياه الأمطار أو تلف الخيام يهدد سلامة الأسرة خاصة الأطفال وكبار السن.';
      urgencyReasonEn = 'Rainwater leakage and tent damage threaten family safety, especially children.';
      alternativesAr = ['استخدام شوادر زراعية مزدوجة كطبقة إضافية', 'رفع الأمتعة على منصات خشبية مجتمعية (Pallets)'];
      alternativesEn = ['Use dual agricultural tarps as barrier', 'Elevate belongings on raised wooden pallets'];
      actionsAr = ['رفع طلب صيانة وإيواء فوري في مركز الطلبات', 'التواصل مع فرق مبادرة دفا في حيك'];
      actionsEn = ['Submit immediate shelter repair ticket', 'Connect with local DEFA neighborhood volunteers'];
      safetyNotice = 'تجنب إشعال الحطب داخل الخيمة المغلقة لمنع الاختناق والحرائق.';
    } else if (qLower.includes('ماء') || qLower.includes('مياه') || qLower.includes('شرب') || qLower.includes('تحلية') || qLower.includes('بئر') || qLower.includes('جالون') || qLower.includes('عطش') || qLower.includes('water') || qLower.includes('ro') || qLower.includes('drink')) {
      module = 'qatra';
      moduleNameAr = 'قطرة (خدمات المياه وتوزيعها)';
      moduleNameEn = 'QATRA (Water Services)';
      urgency = (qLower.includes('انقطاع') || qLower.includes('شح') || qLower.includes('معدوم') || qLower.includes('urgent')) ? 'urgent' : 'high';
      urgencyReasonAr = 'المياه الصالحة للاستخدام عنصر حيوي لمنع انتشار الأوبئة والجفاف.';
      urgencyReasonEn = 'Clean water is vital for preventing dehydration and waterborne disease.';
      alternativesAr = ['التوجه لأقرب محطة تحلية تعمل بالطاقة الشمسية في دير البلح أو خانيونس', 'استخدام حبوب الكلورة أو غلي المياه قبل الشرب'];
      alternativesEn = ['Locate nearest solar-powered RO station', 'Use chlorine purification tablets or boil before consumption'];
      actionsAr = ['استعراض خريطة نقاط المياه ومواعيد الضخ الحالية', 'الإبلاغ عن كسر خط مياه أو توقف محطة'];
      actionsEn = ['Check community water point distribution map', 'Report pipeline break or station outage'];
      safetyNotice = 'تنبيه صحي: مياه الآبار غير المحلاة للاستخدام المنزلي فقط وليست للشرب دون معالجة.';
    } else if (qLower.includes('صلح') || qLower.includes('تصليح') || qLower.includes('عطل') || qLower.includes('إنفرتر') || qLower.includes('بطارية') || qLower.includes('جوال') || qLower.includes('خياطة') || qLower.includes('repair') || qLower.includes('fix') || qLower.includes('solar inverter') || qLower.includes('battery')) {
      module = 'aoun';
      moduleNameAr = 'عون (إصلاح وإعادة استخدام)';
      moduleNameEn = 'AOUN (Repair & Reuse)';
      urgency = (qLower.includes('انفجار') || qLower.includes('شورت') || qLower.includes('حريق')) ? 'urgent' : 'medium';
      urgencyReasonAr = 'الحفاظ على الأجهزة القائمة وإصلاحها أقل تكلفة وأسرع من الشراء الجديد.';
      urgencyReasonEn = 'Maintaining and repairing existing gear is affordable and resourceful.';
      alternativesAr = ['استشارة فني مدار المعتمد لفحص المكونات التالفة قبل الاستبدال الكامل', 'تصفح قسم الأدوات المستعملة المتبادلة'];
      alternativesEn = ['Consult verified MADAR technician', 'Browse community tool exchange section'];
      actionsAr = ['إرسال طلب إصلاح مع وصف العطل والصور', 'الحصول على تقدير تكلفة مبدئي وموقع أقرب ورشة'];
      actionsEn = ['Submit repair ticket with photos', 'Receive estimated quote and technician location'];
      safetyNotice = 'افصل البطاريات فوراً عند ملاحظة حرارة غير معتادة أو رائحة احتراق.';
    } else if (qLower.includes('وظيفة') || qLower.includes('عمل') || qLower.includes('ترجمة') || qLower.includes('تصميم') || qLower.includes('تدريس') || qLower.includes('مهارة') || qLower.includes('خطاط') || qLower.includes('job') || qLower.includes('skill') || qLower.includes('teach') || qLower.includes('translate')) {
      module = 'mahara';
      moduleNameAr = 'مهارة (سوق المهارات وفرص العمل)';
      moduleNameEn = 'MAHARA (Skills & Opportunities)';
      urgency = 'medium';
      urgencyReasonAr = 'تمكين الكفاءات المحلية وخلق مصادر دخل كريمة عبر تقديم الخدمات الرقمية والحرفية.';
      urgencyReasonEn = 'Empowering local talent with dignified income opportunities.';
      alternativesAr = ['عرض المهارة في دليل المستقلين', 'البحث في لوحة المهام والمشاريع المطلوبة'];
      alternativesEn = ['List your portfolio on directory', 'Search active community task board'];
      actionsAr = ['إنشاء ملف مقدم خدمة في مهارة', 'إضافة نماذج الأعمال ووسائل التواصل المتاحة'];
      actionsEn = ['Create freelance profile', 'Add portfolio samples and contact info'];
      safetyNotice = 'اعتمد الاتفاقات المكتوبة الواضحة لتحديد نطاق العمل وموعد التسليم.';
    }

    res.json({
      mode: 'deterministic-fallback',
      noticeAr: 'يعمل النظام في وضع التحليل المحلي الدقيق (بدون تكلفة أو استهلاك بيانات إضافية).',
      noticeEn: 'Running in deterministic local reasoning mode (Zero extra bandwidth).',
      analysis: {
        recommendedModule: module,
        moduleNameAr,
        moduleNameEn,
        urgency,
        urgencyReasonAr,
        urgencyReasonEn,
        suggestedActionsAr: actionsAr,
        suggestedActionsEn: actionsEn,
        alternativeSolutionsAr: alternativesAr,
        alternativeSolutionsEn: alternativesEn,
        safetyDisclaimer: safetyNotice
      }
    });
  });

  // Client Static Serving / Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===========================================`);
    console.log(`MADAR | مَدَار Platform Server active on port ${PORT}`);
    console.log(`Founder: Malak | Mode: Full-Stack Express + Vite`);
    console.log(`Database: .data/db.json (Persistent)`);
    console.log(`AI Engine: ${process.env.GEMINI_API_KEY ? 'Connected (Gemini 3.8 Flash)' : 'Deterministic Gaza-Resilient Fallback Mode'}`);
    console.log(`===========================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
