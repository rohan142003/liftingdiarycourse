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
import { createExerciseAction } from "../actions";
import type { MuscleGroup } from "@/db/schema";

export function CreateExerciseForm({
  userId,
  muscleGroups,
}: {
  userId: string;
  muscleGroups: MuscleGroup[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [muscleGroupId, setMuscleGroupId] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!muscleGroupId) return;
    setIsPending(true);
    try {
      await createExerciseAction(name, userId, Number(muscleGroupId));
      router.push("/dashboard/exercises");
    } catch {
      setIsPending(false);
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
      <Button type="submit" disabled={isPending || !muscleGroupId}>
        {isPending ? "Creating..." : "Create Exercise"}
      </Button>
    </form>
  );
}
