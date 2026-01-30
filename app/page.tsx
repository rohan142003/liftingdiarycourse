import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <Dumbbell className="mx-auto mb-6 h-16 w-16" />
      <h1 className="mb-4 text-4xl font-bold tracking-tight">Lifting Diary</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Track your workouts, exercises, and sets. Monitor your progress and stay
        consistent with your training.
      </p>

      <SignedOut>
        <div className="flex items-center justify-center gap-4">
          <SignInButton mode="modal">
            <Button size="lg">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="lg" variant="outline">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <Button asChild size="lg">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </SignedIn>
    </div>
  );
}
