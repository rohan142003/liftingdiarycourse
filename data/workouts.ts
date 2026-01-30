import { db } from "@/db";
import { workouts, workoutExercises, sets } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { startOfDay, addDays } from "date-fns";

export async function getWorkoutById(workoutId: number, userId: string) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
}

export async function getWorkoutWithExercises(
  workoutId: number,
  userId: string
) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.order)],
        with: {
          exercise: {
            with: {
              muscleGroup: true,
            },
          },
          sets: {
            orderBy: (s, { asc }) => [asc(s.order)],
          },
        },
      },
    },
  });
}

export async function updateWorkout(
  workoutId: number,
  userId: string,
  name: string | null,
  startedAt: Date,
  completedAt: Date | null
) {
  const [workout] = await db
    .update(workouts)
    .set({ name, startedAt, completedAt })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
  return workout;
}

export async function createWorkout(
  name: string | null,
  userId: string,
  startedAt: Date,
  completedAt: Date | null
) {
  const [workout] = await db
    .insert(workouts)
    .values({ name, userId, startedAt, completedAt })
    .returning();
  return workout;
}

export async function deleteWorkout(workoutId: number, userId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

export async function getWorkoutsByDate(userId: string, date: Date) {
  const dayStart = startOfDay(date);
  const nextDayStart = startOfDay(addDays(date, 1));

  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.startedAt, dayStart),
      lt(workouts.startedAt, nextDayStart)
    ),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.order)],
        with: {
          exercise: {
            with: {
              muscleGroup: true,
            },
          },
          sets: {
            orderBy: (s, { asc }) => [asc(s.order)],
          },
        },
      },
    },
    orderBy: (w, { asc }) => [asc(w.startedAt)],
  });
}

export async function addExerciseToWorkout(
  workoutId: number,
  exerciseId: number,
  order: number,
  notes?: string
) {
  const [we] = await db
    .insert(workoutExercises)
    .values({ workoutId, exerciseId, order, notes: notes ?? null })
    .returning();
  return we;
}

export async function removeExerciseFromWorkout(workoutExerciseId: number) {
  await db
    .delete(workoutExercises)
    .where(eq(workoutExercises.id, workoutExerciseId));
}

export async function addSet(
  workoutExerciseId: number,
  order: number,
  weight: number | null,
  reps: number | null,
  rpe: number | null,
  isWarmup: boolean,
  durationSeconds?: number | null
) {
  const [set] = await db
    .insert(sets)
    .values({
      workoutExerciseId,
      order,
      weight,
      reps,
      rpe,
      isWarmup,
      durationSeconds: durationSeconds ?? null,
    })
    .returning();
  return set;
}

export async function updateSet(
  setId: number,
  weight: number | null,
  reps: number | null,
  rpe: number | null,
  isWarmup: boolean,
  durationSeconds?: number | null
) {
  const [set] = await db
    .update(sets)
    .set({
      weight,
      reps,
      rpe,
      isWarmup,
      durationSeconds: durationSeconds ?? null,
    })
    .where(eq(sets.id, setId))
    .returning();
  return set;
}

export async function deleteSet(setId: number) {
  await db.delete(sets).where(eq(sets.id, setId));
}
