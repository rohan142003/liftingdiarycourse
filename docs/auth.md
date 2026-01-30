# Authentication

## Provider: Clerk Only

This application uses **Clerk** (`@clerk/nextjs`) as its sole authentication provider. Do not introduce any other auth library or custom auth solution.

## Setup

- `ClerkProvider` wraps the entire application in the root layout (`app/layout.tsx`).
- Sign-in and sign-up use **modal mode** via `<SignInButton mode="modal" />` and `<SignUpButton mode="modal" />`. There are no dedicated sign-in/sign-up pages.
- Environment variables `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` must be set in `.env`.

## Rules

1. **Use `auth()` in Server Components.** To get the current user's ID, call `auth()` from `@clerk/nextjs/server`. This is the only permitted way to retrieve the authenticated user in server-side code.

   ```ts
   import { auth } from "@clerk/nextjs/server";

   const { userId } = await auth();
   ```

2. **Route protection is handled by middleware.** All `/dashboard` routes are protected via Next.js middleware using `clerkMiddleware`. See `docs/routing.md` for details. Individual page components do not need to redirect unauthenticated users — they may call `auth()` to obtain `userId` for data fetching.

3. **Pass `userId` to data helpers.** After obtaining `userId` from `auth()`, pass it to data helper functions in the `/data` directory. Never call `auth()` inside data helpers — the user ID must be provided as a parameter. See `docs/data-fetching.md` for details.

4. **Use Clerk's React components for UI.** Use `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<SignUpButton>`, and `<UserButton>` from `@clerk/nextjs` for auth-related UI. Do not build custom sign-in/sign-up forms.

5. **No client-side auth checks for data access.** Auth checks that gate data access must happen on the server via `auth()`. Client Components may use Clerk's components for conditional rendering (e.g., `<SignedIn>`), but must not be used to control data fetching or access.

6. **Middleware-based auth.** This project uses `clerkMiddleware` in `middleware.ts` to protect all `/dashboard` routes. See `docs/routing.md` for the full routing and protection standards.
