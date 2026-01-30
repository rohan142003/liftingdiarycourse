import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getExerciseById } from "@/data/exercises";
import { getMuscleGroups } from "@/data/muscle-groups";
import { EditExerciseForm } from "./_components/edit-exercise-form";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { exerciseId } = await params;
  const id = Number(exerciseId);

  if (Number.isNaN(id) || id <= 0) {
    notFound();
  }

  const [exercise, muscleGroups] = await Promise.all([
    getExerciseById(id, userId),
    getMuscleGroups(),
  ]);

  if (!exercise) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Exercise</h1>
      <EditExerciseForm
        userId={userId}
        exercise={exercise}
        muscleGroups={muscleGroups}
      />
    </div>
  );
}
