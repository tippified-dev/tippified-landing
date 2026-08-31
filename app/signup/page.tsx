import type { Metadata } from "next";
import { Suspense } from "react";
import CreatorSignupForm from "./CreatorSignupForm";

export const metadata: Metadata = {
  title: "Tippified Signup | Become a Creator",
  description:
    "Sign up for Tippified and create your creator account. Join Tippified to connect with your audience, receive support and monetize your content.",
  keywords: [
    "Tippified signup",
    "Tippified sign up",
    "signup on Tippified",
    "Tippified creator signup",
    "become a creator",
    "Tippified creator",
    "how to signup on tippified",
  ],
  alternates: {
    canonical: "https://www.tippified.com/signup",
  },
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_460px]">
          {/* SEO CONTENT */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-purple-600">
              Tippified for Creators
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-purple-950 sm:text-5xl">
              Create your Tippified creator account
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
              Join Tippified and create a direct way for your fans and
              supporters to support what you do. Set up your creator profile,
              share your Tippified tip link and start building your audience.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <h2 className="font-bold text-gray-900">
                  Become a creator on Tippified
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Create your profile, tell your audience what you create and
                  give your fans an easy way to support you.
                </p>
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Monetize your audience
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Tippified gives creators tools to receive support from their
                  audience and build a direct relationship with their fans
                  worldwide.
                </p>
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Create your free creator account
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Sign up, verify your email and start setting up your Tippified
                  creator profile.
                </p>
              </div>
            </div>
          </div>

          {/* SIGNUP FORM */}
          <Suspense fallback={<div className="min-h-150" />}>
            <CreatorSignupForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
