"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().max(256).optional(),
  userId: z.string().min(1),
  startedAt: z.string().min(1),
  completedAt: z.string().optional(),
});

export async function createWorkoutAction(
  name: string | undefined,
  userId: string,
  startedAt: string,
  completedAt: string | undefined
) {
  const validated = createWorkoutSchema.parse({
    name,
    userId,
    startedAt,
    completedAt,
  });

  await createWorkout(
    validated.name ?? null,
    validated.userId,
    new Date(validated.startedAt),
    validated.completedAt ? new Date(validated.completedAt) : null
  );
}
