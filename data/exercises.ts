import { db } from "@/db";
import { exercises } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getExercisesByUser(userId: string) {
  return db.query.exercises.findMany({
    where: eq(exercises.userId, userId),
    with: {
      muscleGroup: true,
    },
    orderBy: (e, { asc }) => [asc(e.name)],
  });
}

export async function getExerciseById(exerciseId: number, userId: string) {
  return db.query.exercises.findFirst({
    where: and(eq(exercises.id, exerciseId), eq(exercises.userId, userId)),
    with: {
      muscleGroup: true,
    },
  });
}

export async function createExercise(
  name: string,
  userId: string,
  muscleGroupId: number
) {
  const [exercise] = await db
    .insert(exercises)
    .values({ name, userId, muscleGroupId })
    .returning();
  return exercise;
}

export async function updateExercise(
  exerciseId: number,
  userId: string,
  name: string,
  muscleGroupId: number
) {
  const [exercise] = await db
    .update(exercises)
    .set({ name, muscleGroupId })
    .where(and(eq(exercises.id, exerciseId), eq(exercises.userId, userId)))
    .returning();
  return exercise;
}

export async function deleteExercise(exerciseId: number, userId: string) {
  await db
    .delete(exercises)
    .where(and(eq(exercises.id, exerciseId), eq(exercises.userId, userId)));
}
