"use server";

import { z } from "zod";
import { updateExercise, deleteExercise } from "@/data/exercises";

const updateExerciseSchema = z.object({
  exerciseId: z.number().int().positive(),
  userId: z.string().min(1),
  name: z.string().min(1).max(256),
  muscleGroupId: z.number().int().positive(),
});

export async function updateExerciseAction(
  exerciseId: number,
  userId: string,
  name: string,
  muscleGroupId: number
) {
  const validated = updateExerciseSchema.parse({
    exerciseId,
    userId,
    name,
    muscleGroupId,
  });

  await updateExercise(
    validated.exerciseId,
    validated.userId,
    validated.name,
    validated.muscleGroupId
  );
}

const deleteExerciseSchema = z.object({
  exerciseId: z.number().int().positive(),
  userId: z.string().min(1),
});

export async function deleteExerciseAction(
  exerciseId: number,
  userId: string
) {
  const validated = deleteExerciseSchema.parse({ exerciseId, userId });

  await deleteExercise(validated.exerciseId, validated.userId);
}
