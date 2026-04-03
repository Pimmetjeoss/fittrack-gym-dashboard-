import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Gym Dashboard Models
// ---------------------------------------------------------------------------

export const userRoleEnum = pgEnum('user_role', ['TRAINER', 'MEMBER']);

export const memberSchema = pgTable('member', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  clerkUserId: text('clerk_user_id'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  goal: text('goal'),
  startWeight: numeric('start_weight', { precision: 5, scale: 2 }),
  height: numeric('height', { precision: 5, scale: 2 }),
  birthDate: date('birth_date', { mode: 'date' }),
  notes: text('notes'),
  isActive: boolean('is_active').default(true).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const weightEntrySchema = pgTable('weight_entry', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id')
    .notNull()
    .references(() => memberSchema.id, { onDelete: 'cascade' }),
  date: date('date', { mode: 'date' }).notNull(),
  weight: numeric('weight', { precision: 5, scale: 2 }).notNull(),
  bodyFatPercentage: numeric('body_fat_percentage', { precision: 4, scale: 1 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const nutritionPlanSchema = pgTable('nutrition_plan', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id')
    .notNull()
    .references(() => memberSchema.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  calories: integer('calories'),
  protein: integer('protein'),
  carbs: integer('carbs'),
  fat: integer('fat'),
  isActive: boolean('is_active').default(true).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const nutritionMealSchema = pgTable('nutrition_meal', {
  id: serial('id').primaryKey(),
  planId: integer('plan_id')
    .notNull()
    .references(() => nutritionPlanSchema.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  time: text('time'),
  description: text('description'),
  calories: integer('calories'),
  protein: integer('protein'),
  carbs: integer('carbs'),
  fat: integer('fat'),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const trainingPlanSchema = pgTable('training_plan', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id')
    .notNull()
    .references(() => memberSchema.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  daysPerWeek: integer('days_per_week').default(3).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const trainingDaySchema = pgTable('training_day', {
  id: serial('id').primaryKey(),
  planId: integer('plan_id')
    .notNull()
    .references(() => trainingPlanSchema.id, { onDelete: 'cascade' }),
  dayNumber: integer('day_number').notNull(),
  name: text('name').notNull(),
  notes: text('notes'),
});

export const exerciseSchema = pgTable('exercise', {
  id: serial('id').primaryKey(),
  dayId: integer('day_id')
    .notNull()
    .references(() => trainingDaySchema.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sets: integer('sets').default(3).notNull(),
  reps: text('reps').default('10').notNull(),
  weight: numeric('weight', { precision: 5, scale: 2 }),
  restSeconds: integer('rest_seconds').default(90),
  notes: text('notes'),
  sortOrder: integer('sort_order').default(0).notNull(),
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const memberRelations = relations(memberSchema, ({ many }) => ({
  weightEntries: many(weightEntrySchema),
  nutritionPlans: many(nutritionPlanSchema),
  trainingPlans: many(trainingPlanSchema),
}));

export const weightEntryRelations = relations(weightEntrySchema, ({ one }) => ({
  member: one(memberSchema, {
    fields: [weightEntrySchema.memberId],
    references: [memberSchema.id],
  }),
}));

export const nutritionPlanRelations = relations(nutritionPlanSchema, ({ one, many }) => ({
  member: one(memberSchema, {
    fields: [nutritionPlanSchema.memberId],
    references: [memberSchema.id],
  }),
  meals: many(nutritionMealSchema),
}));

export const nutritionMealRelations = relations(nutritionMealSchema, ({ one }) => ({
  plan: one(nutritionPlanSchema, {
    fields: [nutritionMealSchema.planId],
    references: [nutritionPlanSchema.id],
  }),
}));

export const trainingPlanRelations = relations(trainingPlanSchema, ({ one, many }) => ({
  member: one(memberSchema, {
    fields: [trainingPlanSchema.memberId],
    references: [memberSchema.id],
  }),
  days: many(trainingDaySchema),
}));

export const trainingDayRelations = relations(trainingDaySchema, ({ one, many }) => ({
  plan: one(trainingPlanSchema, {
    fields: [trainingDaySchema.planId],
    references: [trainingPlanSchema.id],
  }),
  exercises: many(exerciseSchema),
}));

export const exerciseRelations = relations(exerciseSchema, ({ one }) => ({
  day: one(trainingDaySchema, {
    fields: [exerciseSchema.dayId],
    references: [trainingDaySchema.id],
  }),
}));
