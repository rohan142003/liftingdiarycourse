# Data Fetching

## Core Rule: Server Components Only

**ALL data fetching in this application MUST be done via React Server Components.** This is non-negotiable.

Data must **NOT** be fetched via:

- Route Handlers (`app/api/*`)
- Client Components (`"use client"`)
- `useEffect`, `fetch` in the browser, or any client-side data fetching library (e.g. React Query, SWR)
- Any other method

Server Components are the **only** permitted way to fetch data in this application.

## Database Queries: The `/data` Directory

All database queries must be implemented as helper functions inside the `/data` directory. These helper functions:

- **Must use Drizzle ORM** to query the database. **Do NOT use raw SQL.**
- Must be imported and called from Server Components.
- Must never be imported or called from Client Components or Route Handlers.

### Example structure

```
data/
  workouts.ts    — helper functions for workout queries
  exercises.ts   — helper functions for exercise queries
  sets.ts        — helper functions for set queries
```

### Example helper function

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}
```

## User Data Isolation (Critical)

**A logged-in user must ONLY be able to access their own data. They must NOT be able to access any other user's data under any circumstances.**

Every data helper function must:

1. Accept the authenticated user's ID as a parameter.
2. Include a `WHERE` clause (via Drizzle's `eq` / `and`) that filters by `userId`.
3. Never expose an endpoint or query path that allows one user to read, update, or delete another user's data.

### Checklist for every data helper

- [ ] Does the function require a `userId` parameter?
- [ ] Is the query filtered by `userId`?
- [ ] Is there any code path that could bypass the `userId` filter?

Violating user data isolation is a **security vulnerability** and must be treated as a blocking issue.
