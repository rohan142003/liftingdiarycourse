"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWorkoutAction, deleteWorkoutAction } from "../actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Workout } from "@/db/schema";

function toLocalDatetimeValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function EditWorkoutForm({
  userId,
  workout,
}: {
  userId: string;
  workout: Workout;
}) {
  const router = useRouter();
  const [name, setName] = useState(workout.name ?? "");
  const [startedAt, setStartedAt] = useState(
    toLocalDatetimeValue(new Date(workout.startedAt))
  );
  const [completedAt, setCompletedAt] = useState(
    workout.completedAt
      ? toLocalDatetimeValue(new Date(workout.completedAt))
      : ""
  );
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    try {
      await updateWorkoutAction(
        workout.id,
        name || undefined,
        userId,
        new Date(startedAt).toISOString(),
        completedAt ? new Date(completedAt).toISOString() : undefined
      );
      router.push("/dashboard");
    } catch {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this workout?")) return;
    setIsDeleting(true);
    try {
      await deleteWorkoutAction(workout.id, userId);
      router.push("/dashboard");
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Workout Name (optional)</Label>
        <Input
          id="name"
          placeholder="e.g. Push Day, Upper Body..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={256}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startedAt">Start Time</Label>
        <Input
          id="startedAt"
          type="datetime-local"
          value={startedAt}
          onChange={(e) => setStartedAt(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="completedAt">End Time (optional)</Label>
        <Input
          id="completedAt"
          type="datetime-local"
          value={completedAt}
          onChange={(e) => setCompletedAt(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Workout"}
        </Button>
      </div>
    </form>
  );
}
