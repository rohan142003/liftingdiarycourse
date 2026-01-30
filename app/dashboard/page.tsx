import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import { getWorkoutsByDate } from "@/data/workouts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardDatePicker } from "./_components/dashboard-date-picker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const params = await searchParams;
  const date = params.date ? new Date(params.date + "T00:00:00") : new Date();

  const workouts = await getWorkoutsByDate(userId, date);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardDatePicker dateISO={date.toISOString()} />
      </div>

      {workouts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Dumbbell className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground text-lg">
              No workouts logged for this day.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{workout.name ?? "Untitled Workout"}</CardTitle>
                  <Badge
                    variant={workout.completedAt ? "default" : "secondary"}
                  >
                    {workout.completedAt ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <CardDescription>
                  Started at {format(workout.startedAt, "h:mm a")}
                  {workout.completedAt &&
                    ` — Finished at ${format(workout.completedAt, "h:mm a")}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workout.workoutExercises.map((we) => (
                    <div key={we.id}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-medium">
                          {we.exercise.name}
                        </span>
                        <Badge variant="outline">
                          {we.exercise.muscleGroup.name}
                        </Badge>
                      </div>
                      <div className="bg-muted/50 rounded-md border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-muted-foreground border-b">
                              <th className="px-3 py-2 text-left font-medium">
                                Set
                              </th>
                              <th className="px-3 py-2 text-left font-medium">
                                Weight (kg)
                              </th>
                              <th className="px-3 py-2 text-left font-medium">
                                Reps
                              </th>
                              <th className="px-3 py-2 text-left font-medium">
                                RPE
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {we.sets.map((set) => (
                              <tr
                                key={set.id}
                                className="border-b last:border-0"
                              >
                                <td className="px-3 py-2">
                                  {set.isWarmup ? (
                                    <span className="text-muted-foreground">
                                      W{set.order}
                                    </span>
                                  ) : (
                                    set.order
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  {set.weight ?? "—"}
                                </td>
                                <td className="px-3 py-2">
                                  {set.reps ?? "—"}
                                </td>
                                <td className="px-3 py-2">
                                  {set.rpe ?? "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
