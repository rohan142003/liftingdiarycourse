"use server";

import { z } from "zod";
import { createExercise } from "@/data/exercises";

const createExerciseSchema = z.object({
  name: z.string().min(1).max(256),
  userId: z.string().min(1),
  muscleGroupId: z.number().int().positive(),
});

export async function createExerciseAction(
  name: string,
  userId: string,
  muscleGroupId: number
) {
  const validated = createExerciseSchema.parse({ name, userId, muscleGroupId });

  await createExercise(validated.name, validated.userId, validated.muscleGroupId);
}
