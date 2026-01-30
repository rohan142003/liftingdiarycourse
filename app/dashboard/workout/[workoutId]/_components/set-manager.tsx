"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addSetAction, updateSetAction, deleteSetAction } from "../actions";
import type { Set } from "@/db/schema";

export function SetManager({
  workoutExerciseId,
  sets,
}: {
  workoutExerciseId: number;
  sets: Set[];
}) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddSet() {
    setIsAdding(true);
    try {
      await addSetAction(workoutExerciseId, sets.length + 1, null, null, null, false);
      router.refresh();
    } catch {
      // ignore
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-2">
      {sets.length > 0 && (
        <div className="bg-muted/50 rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b">
                <th className="px-3 py-2 text-left font-medium">Set</th>
                <th className="px-3 py-2 text-left font-medium">Weight (kg)</th>
                <th className="px-3 py-2 text-left font-medium">Reps</th>
                <th className="px-3 py-2 text-left font-medium">RPE</th>
                <th className="px-3 py-2 text-left font-medium">Warmup</th>
                <th className="w-8 px-1 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {sets.map((set) => (
                <SetRow key={set.id} set={set} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddSet}
        disabled={isAdding}
      >
        <Plus className="h-4 w-4" />
        {isAdding ? "Adding..." : "Add Set"}
      </Button>
    </div>
  );
}

function SetRow({ set }: { set: Set }) {
  const router = useRouter();
  const [weight, setWeight] = useState(set.weight?.toString() ?? "");
  const [reps, setReps] = useState(set.reps?.toString() ?? "");
  const [rpe, setRpe] = useState(set.rpe?.toString() ?? "");
  const [isWarmup, setIsWarmup] = useState(set.isWarmup);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleBlur() {
    const newWeight = weight ? Number(weight) : null;
    const newReps = reps ? Number(reps) : null;
    const newRpe = rpe ? Number(rpe) : null;

    if (
      newWeight === set.weight &&
      newReps === set.reps &&
      newRpe === set.rpe &&
      isWarmup === set.isWarmup
    ) {
      return;
    }

    try {
      await updateSetAction(set.id, newWeight, newReps, newRpe, isWarmup);
      router.refresh();
    } catch {
      // ignore
    }
  }

  async function handleWarmupToggle() {
    const newWarmup = !isWarmup;
    setIsWarmup(newWarmup);
    const newWeight = weight ? Number(weight) : null;
    const newReps = reps ? Number(reps) : null;
    const newRpe = rpe ? Number(rpe) : null;
    try {
      await updateSetAction(set.id, newWeight, newReps, newRpe, newWarmup);
      router.refresh();
    } catch {
      setIsWarmup(!newWarmup);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteSetAction(set.id);
      router.refresh();
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <tr className="border-b last:border-0">
      <td className="px-3 py-2">
        {isWarmup ? (
          <span className="text-muted-foreground">W{set.order}</span>
        ) : (
          set.order
        )}
      </td>
      <td className="px-3 py-1.5">
        <Input
          type="number"
          step="0.5"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onBlur={handleBlur}
          placeholder="—"
          className="h-7 w-20"
        />
      </td>
      <td className="px-3 py-1.5">
        <Input
          type="number"
          min="0"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          onBlur={handleBlur}
          placeholder="—"
          className="h-7 w-16"
        />
      </td>
      <td className="px-3 py-1.5">
        <Input
          type="number"
          step="0.5"
          min="0"
          max="10"
          value={rpe}
          onChange={(e) => setRpe(e.target.value)}
          onBlur={handleBlur}
          placeholder="—"
          className="h-7 w-16"
        />
      </td>
      <td className="px-3 py-1.5">
        <input
          type="checkbox"
          checked={isWarmup}
          onChange={handleWarmupToggle}
          className="h-4 w-4 rounded border-gray-300"
        />
      </td>
      <td className="px-1 py-1.5">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </td>
    </tr>
  );
}
