# Server Components

## Core Rule: Server Components by Default

**All components in this application are React Server Components unless they explicitly opt out with the `"use client"` directive.** Do not add `"use client"` to a component unless it requires browser APIs, event handlers, hooks, or other client-only features.

## When to Use `"use client"`

A component needs the `"use client"` directive **only** when it uses one or more of the following:

- React hooks (`useState`, `useEffect`, `useRouter`, etc.)
- Event handlers (`onClick`, `onChange`, `onSubmit`, etc.)
- Browser-only APIs (`window`, `document`, `localStorage`, etc.)

If a component only renders data and other components, it must remain a Server Component.

### Banned

```tsx
// DO NOT DO THIS — no hooks or interactivity, so "use client" is unnecessary
"use client";

export function WorkoutCard({ name }: { name: string }) {
  return <div>{name}</div>;
}
```

### Required

```tsx
// DO THIS — no directive needed for a purely presentational component
export function WorkoutCard({ name }: { name: string }) {
  return <div>{name}</div>;
}
```

## Page Components

All `page.tsx` files are async Server Components. Every page that requires authentication must follow this structure:

1. Call `auth()` from `@clerk/nextjs/server` to get the user ID.
2. Redirect unauthenticated users.
3. Fetch data using helpers from the `/data` directory.
4. Pass data down to child components as props.

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkoutsByDate } from "@/data/workouts";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const workouts = await getWorkoutsByDate(userId, new Date());

  return <WorkoutList workouts={workouts} />;
}
```

## Dynamic Route Parameters

Dynamic route segments (e.g. `[workoutId]`) provide `params` as a **Promise**. You must `await` it before accessing its values. Always validate dynamic parameters before using them.

```tsx
export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const id = Number(workoutId);

  if (Number.isNaN(id) || id <= 0) {
    notFound();
  }

  // ...
}
```

## Search Parameters

Search params are also a **Promise** and must be awaited.

```tsx
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date ? new Date(params.date + "T00:00:00") : new Date();

  // ...
}
```

## Passing Data to Client Components

Server Components fetch data and pass it to Client Components via props. Follow these rules:

1. **Fetch in the Server Component.** Never fetch data inside a Client Component.
2. **Pass serializable props.** All props crossing the server/client boundary must be serializable (strings, numbers, plain objects, arrays). Dates must be converted to strings (e.g. ISO format) before passing, unless the type is already serializable by the framework.
3. **Push `"use client"` as far down the tree as possible.** Keep the boundary narrow — only the interactive leaf component should be a Client Component.

### Banned

```tsx
// DO NOT DO THIS — fetching data inside a Client Component
"use client";

import { getWorkoutById } from "@/data/workouts";

export function EditWorkoutForm({ workoutId }: { workoutId: number }) {
  // Cannot call server-only data helpers in a Client Component
  const workout = await getWorkoutById(workoutId, userId);
  // ...
}
```

### Required

```tsx
// DO THIS — Server Component fetches, Client Component receives via props
// page.tsx (Server Component)
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./_components/edit-workout-form";

export default async function EditWorkoutPage() {
  const workout = await getWorkoutById(id, userId);
  return <EditWorkoutForm workout={workout} userId={userId} />;
}
```

## Client Component File Placement

Client Components must be placed in a `_components` directory colocated with the page that uses them. The underscore prefix signals that the directory is private to that route segment and is not itself a route.

```
app/
  dashboard/
    page.tsx                          -- Server Component
    _components/
      dashboard-date-picker.tsx       -- Client Component ("use client")
    workout/
      new/
        page.tsx                      -- Server Component
        _components/
          create-workout-form.tsx     -- Client Component ("use client")
      [workoutId]/
        page.tsx                      -- Server Component
        _components/
          edit-workout-form.tsx       -- Client Component ("use client")
```

## Loading States

Each route segment that performs async data fetching should have a `loading.tsx` file that exports a skeleton UI. Next.js uses this as an automatic Suspense fallback while the page data loads.

- The skeleton must visually match the layout of the page it represents.
- Use the `Skeleton` component from shadcn/ui for placeholder elements.

```tsx
// app/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Skeleton className="h-10 w-48" />
      {/* ... skeleton matching dashboard layout */}
    </div>
  );
}
```

## Summary

1. **Server Components by default** — only add `"use client"` when hooks, events, or browser APIs are required.
2. **Async pages** — all `page.tsx` files are async Server Components that fetch data directly.
3. **Await params and searchParams** — both are Promises and must be awaited before use.
4. **Validate dynamic params** — check types and return `notFound()` for invalid values.
5. **Fetch in Server, render in Client** — data fetching stays in Server Components; Client Components receive data via props.
6. **Colocated `_components`** — Client Components live in `_components` directories next to their page.
7. **Loading skeletons** — provide `loading.tsx` files for route segments with async data fetching.
