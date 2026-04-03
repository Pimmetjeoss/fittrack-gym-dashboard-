import { z } from 'zod';

// Member
export const createMemberSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  goal: z.string().optional(),
  startWeight: z.string().optional(),
  height: z.string().optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
});

export const updateMemberSchema = createMemberSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Weight Entry
export const createWeightEntrySchema = z.object({
  date: z.string().min(1),
  weight: z.string().min(1),
  bodyFatPercentage: z.string().optional(),
  notes: z.string().optional(),
});

// Nutrition Plan
export const createNutritionPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  calories: z.number().int().optional(),
  protein: z.number().int().optional(),
  carbs: z.number().int().optional(),
  fat: z.number().int().optional(),
});

export const updateNutritionPlanSchema = createNutritionPlanSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Nutrition Meal
export const createNutritionMealSchema = z.object({
  name: z.string().min(1),
  time: z.string().optional(),
  description: z.string().optional(),
  calories: z.number().int().optional(),
  protein: z.number().int().optional(),
  carbs: z.number().int().optional(),
  fat: z.number().int().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateNutritionMealSchema = createNutritionMealSchema.partial();

// Training Plan
export const createTrainingPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  daysPerWeek: z.number().int().min(1).max(7).optional(),
});

export const updateTrainingPlanSchema = createTrainingPlanSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Training Day
export const createTrainingDaySchema = z.object({
  dayNumber: z.number().int().min(1),
  name: z.string().min(1),
  notes: z.string().optional(),
});

export const updateTrainingDaySchema = createTrainingDaySchema.partial();

// Exercise
export const createExerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.number().int().optional(),
  reps: z.string().optional(),
  weight: z.string().optional(),
  restSeconds: z.number().int().optional(),
  notes: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();
