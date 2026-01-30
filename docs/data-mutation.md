# Data Mutation

## Core Rule: Server Actions Only

**ALL data mutations in this application MUST be done via Server Actions.** This is non-negotiable.

Data must **NOT** be mutated via:

- Route Handlers (`app/api/*`)
- Client-side `fetch` calls
- Direct database calls inside Server Components
- Any other method

Server Actions are the **only** permitted way to mutate data in this application.

## Server Action Location: Colocated `actions.ts` Files

Every server action must live in a file named `actions.ts`, colocated alongside the page or feature that uses it. The file must start with the `"use server"` directive.

### Example structure

```
app/
  workouts/
    page.tsx
    actions.ts      -- server actions for the workouts page
  workouts/[id]/
    page.tsx
    actions.ts      -- server actions for the workout detail page
  exercises/
    page.tsx
    actions.ts      -- server actions for the exercises page
```

Do **not** create a single global actions file. Keep actions colocated with the UI that calls them.

## Parameter Typing: No `FormData`

**All server action parameters MUST be explicitly typed. The `FormData` type is banned.**

Do **not** write server actions that accept `FormData`. Instead, extract and type the values before calling the action, or accept a typed object directly.

### Banned

```ts
// DO NOT DO THIS
export async function createWorkout(formData: FormData) {
  const name = formData.get("name") as string;
  // ...
}
```

### Required

```ts
// DO THIS
export async function createWorkout(name: string, userId: string) {
  // ...
}
```

## Argument Validation: Zod Required

**ALL server actions MUST validate their arguments using Zod before performing any database operation.**

Every server action must:

1. Define a Zod schema for its parameters.
2. Parse the arguments through the schema at the top of the function.
3. Only proceed with the mutation if validation passes.

### Example

```ts
// app/workouts/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(256),
  userId: z.string().min(1),
});

export async function createWorkoutAction(name: string, userId: string) {
  const validated = createWorkoutSchema.parse({ name, userId });

  await createWorkout(validated.name, validated.userId);
}
```

If validation fails, `parse` will throw a `ZodError`. Do not silently ignore validation failures.

## Database Calls: The `/data` Directory

**Server actions must NOT contain Drizzle ORM calls directly.** All database mutations must be implemented as helper functions inside the `/data` directory, and server actions must call those helpers.

### Data helper functions

- **Must use Drizzle ORM** for all database operations. **Do NOT use raw SQL.**
- Must be the only place where `db.insert()`, `db.update()`, and `db.delete()` are called.
- Must never be imported or called from Client Components.

### Example data helper

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkout(name: string, userId: string) {
  const [workout] = await db
    .insert(workouts)
    .values({ name, userId })
    .returning();
  return workout;
}

export async function deleteWorkout(workoutId: number, userId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

### Example server action calling the helper

```ts
// app/workouts/actions.ts
"use server";

import { z } from "zod";
import { deleteWorkout } from "@/data/workouts";

const deleteWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  userId: z.string().min(1),
});

export async function deleteWorkoutAction(workoutId: number, userId: string) {
  const validated = deleteWorkoutSchema.parse({ workoutId, userId });

  await deleteWorkout(validated.workoutId, validated.userId);
}
```

## No Redirects in Server Actions

**Server actions must NOT call `redirect()` from `next/navigation`.** Navigation after a mutation must be handled client-side, after the server action call resolves.

### Banned

```ts
// DO NOT DO THIS
"use server";

import { redirect } from "next/navigation";

export async function createWorkoutAction(name: string, userId: string) {
  // ... mutation logic
  redirect("/dashboard"); // ❌ Not allowed
}
```

### Required

```tsx
// Client Component
"use client";

import { useRouter } from "next/navigation";

function CreateWorkoutForm() {
  const router = useRouter();

  async function handleSubmit() {
    await createWorkoutAction(name, userId);
    router.push("/dashboard"); // ✅ Redirect client-side
  }
}
```

## User Data Isolation (Critical)

The same rules from [data-fetching.md](./data-fetching.md) apply to mutations:

**A logged-in user must ONLY be able to mutate their own data. They must NOT be able to modify any other user's data under any circumstances.**

Every mutation helper function must:

1. Accept the authenticated user's ID as a parameter.
2. Include a `WHERE` clause (via Drizzle's `eq` / `and`) that filters by `userId`.
3. Never expose a code path that allows one user to create, update, or delete another user's data.

### Checklist for every mutation helper

- [ ] Does the function require a `userId` parameter?
- [ ] Is the query filtered by `userId`?
- [ ] Is there any code path that could bypass the `userId` filter?

Violating user data isolation is a **security vulnerability** and must be treated as a blocking issue.

## Summary

1. **Server Actions only** -- no Route Handlers, no client-side mutations.
2. **Colocated `actions.ts`** -- every action file lives next to the page that uses it.
3. **Typed parameters** -- no `FormData`, ever.
4. **Zod validation** -- every action validates its arguments before touching the database.
5. **`/data` helpers** -- all Drizzle ORM calls live in the `/data` directory, not in actions.
6. **No `redirect()` in server actions** -- navigation must happen client-side after the action resolves.
