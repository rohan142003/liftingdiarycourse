import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateWorkoutForm } from "./_components/create-workout-form";

export default async function NewWorkoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">New Workout</h1>
      <CreateWorkoutForm userId={userId} />
    </div>
  );
}
