import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMuscleGroups } from "@/data/muscle-groups";
import { CreateExerciseForm } from "./_components/create-exercise-form";

export default async function NewExercisePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const muscleGroups = await getMuscleGroups();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">New Exercise</h1>
      <CreateExerciseForm userId={userId} muscleGroups={muscleGroups} />
    </div>
  );
}
