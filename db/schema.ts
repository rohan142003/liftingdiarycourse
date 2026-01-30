import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  real,
  boolean,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// ---------- Tables ----------

export const muscleGroups = pgTable("muscle_groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  muscleGroupId: integer("muscle_group_id")
    .notNull()
    .references(() => muscleGroups.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("exercises_user_id_idx").on(table.userId),
  index("exercises_muscle_group_id_idx").on(table.muscleGroupId),
]);

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("workouts_user_id_idx").on(table.userId),
  index("workouts_started_at_idx").on(table.startedAt),
]);

export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("workout_exercises_workout_id_idx").on(table.workoutId),
  index("workout_exercises_exercise_id_idx").on(table.exerciseId),
]);

export const sets = pgTable("sets", {
  id: serial("id").primaryKey(),
  workoutExerciseId: integer("workout_exercise_id")
    .notNull()
    .references(() => workoutExercises.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  weight: real("weight"),
  reps: integer("reps"),
  durationSeconds: integer("duration_seconds"),
  rpe: real("rpe"),
  isWarmup: boolean("is_warmup").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("sets_workout_exercise_id_idx").on(table.workoutExerciseId),
]);

// ---------- Relations ----------

export const muscleGroupsRelations = relations(muscleGroups, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  muscleGroup: one(muscleGroups, {
    fields: [exercises.muscleGroupId],
    references: [muscleGroups.id],
  }),
  workoutExercises: many(workoutExercises),
}));

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

// ---------- Type Exports ----------

export type MuscleGroup = InferSelectModel<typeof muscleGroups>;
export type NewMuscleGroup = InferInsertModel<typeof muscleGroups>;

export type Exercise = InferSelectModel<typeof exercises>;
export type NewExercise = InferInsertModel<typeof exercises>;

export type Workout = InferSelectModel<typeof workouts>;
export type NewWorkout = InferInsertModel<typeof workouts>;

export type WorkoutExercise = InferSelectModel<typeof workoutExercises>;
export type NewWorkoutExercise = InferInsertModel<typeof workoutExercises>;

export type Set = InferSelectModel<typeof sets>;
export type NewSet = InferInsertModel<typeof sets>;
