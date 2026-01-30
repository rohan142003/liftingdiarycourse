import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { startOfDay, addDays } from "date-fns";

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
