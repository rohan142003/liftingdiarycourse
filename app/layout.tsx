import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lifting Diary",
  description: "Track your workouts, exercises, and progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="border-b">
            <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-lg font-bold">
                  Lifting Diary
                </Link>
                <SignedIn>
                  <nav className="flex items-center gap-4 text-sm">
                    <Link
                      href="/dashboard"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/exercises"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Exercises
                    </Link>
                    <Link
                      href="/dashboard/workout/new"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      New Workout
                    </Link>
                  </nav>
                </SignedIn>
              </div>
              <div className="flex items-center gap-2">
                <SignedOut>
                  <SignInButton mode="modal" />
                  <SignUpButton mode="modal" />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
