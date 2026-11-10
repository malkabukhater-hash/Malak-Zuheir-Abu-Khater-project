import { pgTable, text, serial, integer, timestamp, boolean, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table linked with Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull().default(''),
  nameAr: text('name_ar').notNull().default(''),
  role: text('role').notNull().default('resident'),
  neighborhood: text('neighborhood').notNull().default('Deir al-Balah'),
  phone: text('phone').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Mahara Skills Directory
export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  skillId: text('skill_id').notNull().unique(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en').notNull(),
  providerName: text('provider_name').notNull(),
  providerUid: text('provider_uid').default(''),
  category: text('category').notNull().default('tech'),
  rate: text('rate').notNull().default(''),
  rating: doublePrecision('rating').default(5.0),
  reviewsCount: integer('reviews_count').default(1),
  neighborhood: text('neighborhood').notNull().default('Deir al-Balah'),
  neighborhoodAr: text('neighborhood_ar').notNull().default('دير البلح'),
  bioAr: text('bio_ar').default(''),
  bioEn: text('bio_en').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Smart Requests & Service Tickets
export const requests = pgTable('requests', {
  id: serial('id').primaryKey(),
  requestId: text('request_id').notNull().unique(),
  title: text('title').notNull(),
  module: text('module').notNull().default('wasel'),
  category: text('category').notNull().default('general'),
  neighborhood: text('neighborhood').notNull().default('Deir al-Balah'),
  neighborhoodAr: text('neighborhood_ar').notNull().default('دير البلح'),
  status: text('status').notNull().default('New'),
  urgency: text('urgency').notNull().default('medium'),
  urgencyScore: integer('urgency_score').default(50),
  requesterName: text('requester_name').notNull().default('عضو مجتمعي'),
  requesterUid: text('requester_uid').default(''),
  requesterRole: text('requester_role').default('resident'),
  description: text('description').notNull().default(''),
  assignedTo: text('assigned_to').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Wasel Marketplace Items
export const marketplaceItems = pgTable('marketplace_items', {
  id: serial('id').primaryKey(),
  itemId: text('item_id').notNull().unique(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en').notNull(),
  category: text('category').notNull().default('solar'),
  price: doublePrecision('price').notNull().default(0),
  currency: text('currency').notNull().default('ILS'),
  merchantId: text('merchant_id').default(''),
  merchantName: text('merchant_name').notNull().default('مورد معتمد'),
  neighborhood: text('neighborhood').notNull().default('Deir al-Balah'),
  availableQty: integer('available_qty').default(1),
  isAvailable: boolean('is_available').default(true),
  descriptionAr: text('description_ar').default(''),
  descriptionEn: text('description_en').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(),
  actionAr: text('action_ar').default(''),
  actor: text('actor').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  requests: many(requests),
}));
