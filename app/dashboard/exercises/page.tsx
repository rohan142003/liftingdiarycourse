import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getExercisesByUser } from "@/data/exercises";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ExercisesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const exercises = await getExercisesByUser(userId);

  const grouped = new Map<string, typeof exercises>();
  for (const exercise of exercises) {
    const groupName = exercise.muscleGroup.name;
    const group = grouped.get(groupName);
    if (group) {
      group.push(exercise);
    } else {
      grouped.set(groupName, [exercise]);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exercises</h1>
        <Button asChild>
          <Link href="/dashboard/exercises/new">
            <Plus className="h-4 w-4" />
            New Exercise
          </Link>
        </Button>
      </div>

      {exercises.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-lg">
              No exercises yet. Create your first exercise to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([groupName, groupExercises]) => (
            <Card key={groupName}>
              <CardHeader>
                <CardTitle>{groupName}</CardTitle>
                <CardDescription>
                  {groupExercises.length} exercise
                  {groupExercises.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {groupExercises.map((exercise) => (
                    <Link
                      key={exercise.id}
                      href={`/dashboard/exercises/${exercise.id}`}
                      className="hover:bg-muted flex items-center justify-between rounded-md border px-4 py-3 transition-colors"
                    >
                      <span className="font-medium">{exercise.name}</span>
                      <Badge variant="outline">{exercise.muscleGroup.name}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
