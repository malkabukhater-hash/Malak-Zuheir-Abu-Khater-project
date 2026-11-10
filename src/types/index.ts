export type Language = 'ar' | 'en';

export type EyeMode = 'default' | 'soft-sky' | 'warm' | 'dim' | 'high-contrast';
export type TextScale = 'normal' | 'large' | 'xlarge';

export type UserRole =
  | 'resident'
  | 'merchant'
  | 'provider'
  | 'freelancer'
  | 'organization'
  | 'admin';

export interface User {
  id: string;
  name: string;
  nameAr?: string;
  titleAr?: string;
  titleEn?: string;
  bioAr?: string;
  bioEn?: string;
  email: string;
  role: UserRole;
  neighborhood: string;
  neighborhoodAr?: string;
  phone?: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface MarketplaceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'solar' | 'water-tools' | 'shelter' | 'cooking' | 'health' | 'food';
  price: number;
  currency: 'ILS' | 'USD';
  merchantId: string;
  merchantName: string;
  neighborhood: string;
  neighborhoodAr: string;
  availableQty: number;
  isAvailable: boolean;
  lastVerified: string;
  descriptionAr: string;
  descriptionEn: string;
  alternatives: string[];
  groupBuyEligible?: boolean;
  groupBuyDiscount?: number;
  minGroupQty?: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
}

export interface RepairTechnician {
  id: string;
  nameAr: string;
  nameEn: string;
  specialtyAr: string;
  specialtyEn: string;
  neighborhood: string;
  neighborhoodAr: string;
  phone: string;
  rating: number;
  jobsCompleted: number;
  isAvailable: boolean;
  hourlyRate: string;
  experienceYears: number;
}

export interface WaterPoint {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'potable' | 'utility' | 'truck';
  typeLabelAr: string;
  typeLabelEn: string;
  neighborhood: string;
  neighborhoodAr: string;
  status: 'active' | 'scheduled' | 'maintenance' | 'depleted';
  operatingHours: string;
  capacityNotesAr: string;
  capacityNotesEn: string;
  lastReported: string;
  reporter: string;
  verified: boolean;
  waterQualityNoticeAr: string;
  waterQualityNoticeEn: string;
  lat?: number;
  lng?: number;
}

export interface ShelterSupply {
  id: string;
  titleAr: string;
  titleEn: string;
  available: number;
  organization: string;
  neighborhood: string;
  neighborhoodAr: string;
  priorityCriterion: string;
  urgencyMin: 'urgent' | 'high' | 'medium';
}

export interface SkillItem {
  id: string;
  titleAr: string;
  titleEn: string;
  providerName: string;
  category: 'translation' | 'education' | 'design' | 'crafts' | 'tech' | 'writing';
  rate: string;
  rating: number;
  reviewsCount: number;
  neighborhood: string;
  neighborhoodAr: string;
  bioAr: string;
  bioEn: string;
  badges: string[];
}

export type RequestStatus =
  | 'New'
  | 'Under Review'
  | 'Matched'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface RequestTimelineEntry {
  status: RequestStatus;
  time: string;
  note: string;
}

export interface SmartRequest {
  id: string;
  title: string;
  module: 'wasel' | 'aoun' | 'defa' | 'qatra' | 'mahara';
  category: string;
  neighborhood: string;
  neighborhoodAr: string;
  status: RequestStatus;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  urgencyScore: number;
  requesterName: string;
  requesterRole: UserRole;
  createdAt: string;
  description: string;
  assignedTo?: string;
  hasInfants?: boolean;
  hasSickOrElderly?: boolean;
  floodedTent?: boolean;
  timeline: RequestTimelineEntry[];
}

export interface GroupPurchase {
  id: string;
  titleAr: string;
  titleEn: string;
  targetQty: number;
  currentQty: number;
  unitPrice: number;
  regularPrice: number;
  savingsPercent: number;
  deadline: string;
  neighborhood: string;
  neighborhoodAr: string;
  status: 'collecting' | 'fulfilled' | 'closed';
}

export interface ReusableGood {
  id: string;
  titleAr: string;
  titleEn: string;
  condition: string;
  exchangeType: 'donation' | 'barter';
  exchangeTypeLabelAr: string;
  ownerName: string;
  neighborhood: string;
  neighborhoodAr: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actionAr: string;
  actor: string;
  timestamp: string;
}

export interface OfflineMutation {
  id: string;
  type: 'CREATE_REQUEST' | 'UPDATE_REQUEST_STATUS' | 'CREATE_PRODUCT';
  payload: any;
  timestamp: string;
  retries: number;
  status: 'pending' | 'syncing' | 'failed';
}

export interface EyeComfortSettings {
  mode: EyeMode;
  textScale: TextScale;
  reducedMotion: boolean;
  readingFocus: boolean;
  breakReminder20: boolean;
  blinkReminder: boolean;
  audioNavEnabled: boolean;
  ambientSound: 'off' | 'rain' | 'breeze' | 'night';
  ambientVolume: number;
}
