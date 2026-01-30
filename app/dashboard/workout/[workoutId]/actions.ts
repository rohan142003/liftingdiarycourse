"use server";

import { z } from "zod";
import {
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  addSet,
  updateSet,
  deleteSet,
} from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().max(256).optional(),
  userId: z.string().min(1),
  startedAt: z.string().min(1),
  completedAt: z.string().optional(),
});

export async function updateWorkoutAction(
  workoutId: number,
  name: string | undefined,
  userId: string,
  startedAt: string,
  completedAt: string | undefined
) {
  const validated = updateWorkoutSchema.parse({
    workoutId,
    name,
    userId,
    startedAt,
    completedAt,
  });

  await updateWorkout(
    validated.workoutId,
    validated.userId,
    validated.name ?? null,
    new Date(validated.startedAt),
    validated.completedAt ? new Date(validated.completedAt) : null
  );
}

const deleteWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  userId: z.string().min(1),
});

export async function deleteWorkoutAction(
  workoutId: number,
  userId: string
) {
  const validated = deleteWorkoutSchema.parse({ workoutId, userId });

  await deleteWorkout(validated.workoutId, validated.userId);
}

const addExerciseToWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  exerciseId: z.number().int().positive(),
  order: z.number().int().nonnegative(),
});

export async function addExerciseToWorkoutAction(
  workoutId: number,
  exerciseId: number,
  order: number
) {
  const validated = addExerciseToWorkoutSchema.parse({
    workoutId,
    exerciseId,
    order,
  });

  await addExerciseToWorkout(
    validated.workoutId,
    validated.exerciseId,
    validated.order
  );
}

const removeExerciseFromWorkoutSchema = z.object({
  workoutExerciseId: z.number().int().positive(),
});

export async function removeExerciseFromWorkoutAction(
  workoutExerciseId: number
) {
  const validated = removeExerciseFromWorkoutSchema.parse({
    workoutExerciseId,
  });

  await removeExerciseFromWorkout(validated.workoutExerciseId);
}

const addSetSchema = z.object({
  workoutExerciseId: z.number().int().positive(),
  order: z.number().int().positive(),
  weight: z.number().nullable(),
  reps: z.number().int().nullable(),
  rpe: z.number().nullable(),
  isWarmup: z.boolean(),
});

export async function addSetAction(
  workoutExerciseId: number,
  order: number,
  weight: number | null,
  reps: number | null,
  rpe: number | null,
  isWarmup: boolean
) {
  const validated = addSetSchema.parse({
    workoutExerciseId,
    order,
    weight,
    reps,
    rpe,
    isWarmup,
  });

  await addSet(
    validated.workoutExerciseId,
    validated.order,
    validated.weight,
    validated.reps,
    validated.rpe,
    validated.isWarmup
  );
}

const updateSetSchema = z.object({
  setId: z.number().int().positive(),
  weight: z.number().nullable(),
  reps: z.number().int().nullable(),
  rpe: z.number().nullable(),
  isWarmup: z.boolean(),
});

export async function updateSetAction(
  setId: number,
  weight: number | null,
  reps: number | null,
  rpe: number | null,
  isWarmup: boolean
) {
  const validated = updateSetSchema.parse({
    setId,
    weight,
    reps,
    rpe,
    isWarmup,
  });

  await updateSet(
    validated.setId,
    validated.weight,
    validated.reps,
    validated.rpe,
    validated.isWarmup
  );
}

const deleteSetSchema = z.object({
  setId: z.number().int().positive(),
});

export async function deleteSetAction(setId: number) {
  const validated = deleteSetSchema.parse({ setId });

  await deleteSet(validated.setId);
}
