import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkoutWithExercises } from "@/data/workouts";
import { getExercisesByUser } from "@/data/exercises";
import { EditWorkoutForm } from "./_components/edit-workout-form";
import { WorkoutExerciseList } from "./_components/workout-exercise-list";
import { AddExerciseDialog } from "./_components/add-exercise-dialog";
import { Separator } from "@/components/ui/separator";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { workoutId } = await params;
  const id = Number(workoutId);

  if (Number.isNaN(id) || id <= 0) {
    notFound();
  }

  const [workout, userExercises] = await Promise.all([
    getWorkoutWithExercises(id, userId),
    getExercisesByUser(userId),
  ]);

  if (!workout) {
    notFound();
  }

  const exercisesInWorkout = new Set(
    workout.workoutExercises.map((we) => we.exerciseId)
  );
  const availableExercises = userExercises.filter(
    (e) => !exercisesInWorkout.has(e.id)
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Workout</h1>
      <EditWorkoutForm userId={userId} workout={workout} />

      <Separator className="my-8" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <AddExerciseDialog
            workoutId={workout.id}
            availableExercises={availableExercises}
            nextOrder={workout.workoutExercises.length + 1}
          />
        </div>

        <WorkoutExerciseList workoutExercises={workout.workoutExercises} />
      </div>
    </div>
  );
}
