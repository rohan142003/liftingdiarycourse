import { db } from "@/db";

export async function getMuscleGroups() {
  return db.query.muscleGroups.findMany({
    orderBy: (mg, { asc }) => [asc(mg.name)],
  });
}
