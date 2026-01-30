"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { removeExerciseFromWorkoutAction } from "../actions";
import { SetManager } from "./set-manager";
import type { WorkoutExercise, Exercise, MuscleGroup, Set } from "@/db/schema";

type WorkoutExerciseWithDetails = WorkoutExercise & {
  exercise: Exercise & { muscleGroup: MuscleGroup };
  sets: Set[];
};

export function WorkoutExerciseList({
  workoutExercises,
}: {
  workoutExercises: WorkoutExerciseWithDetails[];
}) {
  if (workoutExercises.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center">
        No exercises added yet. Add an exercise to start tracking sets.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {workoutExercises.map((we) => (
        <WorkoutExerciseCard key={we.id} workoutExercise={we} />
      ))}
    </div>
  );
}

function WorkoutExerciseCard({
  workoutExercise,
}: {
  workoutExercise: WorkoutExerciseWithDetails;
}) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleRemove() {
    if (!confirm("Remove this exercise from the workout?")) return;
    setIsRemoving(true);
    try {
      await removeExerciseFromWorkoutAction(workoutExercise.id);
      router.refresh();
    } catch {
      setIsRemoving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">
              {workoutExercise.exercise.name}
            </CardTitle>
            <Badge variant="outline">
              {workoutExercise.exercise.muscleGroup.name}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SetManager
          workoutExerciseId={workoutExercise.id}
          sets={workoutExercise.sets}
        />
      </CardContent>
    </Card>
  );
}
