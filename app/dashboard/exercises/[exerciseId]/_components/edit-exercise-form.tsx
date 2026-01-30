"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateExerciseAction, deleteExerciseAction } from "../actions";
import type { Exercise, MuscleGroup } from "@/db/schema";

export function EditExerciseForm({
  userId,
  exercise,
  muscleGroups,
}: {
  userId: string;
  exercise: Exercise & { muscleGroup: MuscleGroup };
  muscleGroups: MuscleGroup[];
}) {
  const router = useRouter();
  const [name, setName] = useState(exercise.name);
  const [muscleGroupId, setMuscleGroupId] = useState(
    String(exercise.muscleGroupId)
  );
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!muscleGroupId) return;
    setIsPending(true);
    try {
      await updateExerciseAction(
        exercise.id,
        userId,
        name,
        Number(muscleGroupId)
      );
      router.push("/dashboard/exercises");
    } catch {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this exercise?")) return;
    setIsDeleting(true);
    try {
      await deleteExerciseAction(exercise.id, userId);
      router.push("/dashboard/exercises");
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Exercise Name</Label>
        <Input
          id="name"
          placeholder="e.g. Bench Press, Squat..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={256}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="muscleGroup">Muscle Group</Label>
        <Select value={muscleGroupId} onValueChange={setMuscleGroupId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a muscle group" />
          </SelectTrigger>
          <SelectContent>
            {muscleGroups.map((mg) => (
              <SelectItem key={mg.id} value={String(mg.id)}>
                {mg.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending || !muscleGroupId}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Exercise"}
        </Button>
      </div>
    </form>
  );
}
