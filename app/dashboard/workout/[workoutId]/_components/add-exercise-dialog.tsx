"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addExerciseToWorkoutAction } from "../actions";
import type { Exercise, MuscleGroup } from "@/db/schema";

export function AddExerciseDialog({
  workoutId,
  availableExercises,
  nextOrder,
}: {
  workoutId: number;
  availableExercises: (Exercise & { muscleGroup: MuscleGroup })[];
  nextOrder: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [exerciseId, setExerciseId] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleAdd() {
    if (!exerciseId) return;
    setIsPending(true);
    try {
      await addExerciseToWorkoutAction(
        workoutId,
        Number(exerciseId),
        nextOrder
      );
      setOpen(false);
      setExerciseId("");
      router.refresh();
    } catch {
      // keep dialog open on error
    } finally {
      setIsPending(false);
    }
  }

  if (availableExercises.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Plus className="h-4 w-4" />
        No exercises available
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Add Exercise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Exercise to Workout</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={exerciseId} onValueChange={setExerciseId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an exercise" />
            </SelectTrigger>
            <SelectContent>
              {availableExercises.map((exercise) => (
                <SelectItem key={exercise.id} value={String(exercise.id)}>
                  {exercise.name} ({exercise.muscleGroup.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAdd}
            disabled={!exerciseId || isPending}
            className="w-full"
          >
            {isPending ? "Adding..." : "Add to Workout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
