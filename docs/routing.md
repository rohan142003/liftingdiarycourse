# Routing

## All Routes Live Under `/dashboard`

Every authenticated page in this application is nested under the `/dashboard` route segment. The root page (`app/page.tsx`) is the only public page and serves as the landing/sign-in entry point.

## Route Protection via Next.js Middleware

All `/dashboard` routes (including any sub-pages) are **protected routes** accessible only to logged-in users. Route protection is handled by Next.js middleware (`middleware.ts` at the project root), **not** at the page level.

### Rules

1. **Use Clerk middleware to protect `/dashboard`.** The `middleware.ts` file must use `clerkMiddleware` from `@clerk/nextjs/server` to intercept requests to `/dashboard` and all sub-paths. Unauthenticated users should be redirected away.

2. **Do not add auth redirects inside page components.** Since middleware handles protection, individual page components under `/dashboard` should not call `auth()` solely to redirect unauthenticated users. They may still call `auth()` to obtain `userId` for data fetching.

3. **New routes go under `/dashboard`.** When adding a new feature page, create it inside `app/dashboard/`. Do not create top-level route segments outside of `/dashboard` for authenticated content.

4. **Middleware matcher must cover `/dashboard` paths.** The middleware config should use a matcher that targets `/dashboard` and all nested routes:

   ```ts
   export const config = {
     matcher: ["/dashboard(.*)"],
   };
   ```

## Current Route Map

| Path                              | Description           |
| --------------------------------- | --------------------- |
| `/`                               | Public landing page   |
| `/dashboard`                      | Main dashboard        |
| `/dashboard/workout/new`          | Create a new workout  |
| `/dashboard/workout/[workoutId]`  | View a single workout |
