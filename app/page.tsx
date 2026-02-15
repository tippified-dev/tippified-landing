"use client";

import NavBar from "./components/NavBar";

export default function HomePage() {
  return (
    <>
      <NavBar />

      <main className="bg-white text-gray-900 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="bg-purple-600 text-white py-20 flex flex-col justify-center items-center px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Tippified
          </h1>
          <p className="text-lg md:text-2xl mb-6 max-w-xl">
            Empower your content and monetize your audience effortlessly.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <a
              href="https://app.tippified.com/creator/signup"
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Sign Up as Creator
            </a>

            <a
              href="/privacy-policy"
              className="px-8 py-4 bg-gray-100 text-purple-600 font-bold rounded-lg shadow hover:bg-gray-200 transition"
            >
              Privacy Policy
            </a>

            <a
              href="/contact-us"
              className="px-8 py-4 bg-gray-100 text-purple-600 font-bold rounded-lg shadow hover:bg-gray-200 transition"
            >
              Contact Us
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">Why Tippified?</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white text-xs p-6 rounded-lg  shadow hover:shadow-lg transition md:text-lg">
              <h3 className="text-lg font-semibold mb-2">Fast Tips</h3>
              <p>Support creators instantly with our simple tipping platform.</p>
            </div>

            <div className="bg-white p-6 text-xs rounded-lg shadow hover:shadow-lg transition md:text-lg">
              <h3 className="text-lg font-semibold mb-2">Secure Wallet</h3>
              <p>Your money is safe with our encrypted wallet system.</p>
            </div>

            <div className="bg-white p-6 text-xs rounded-lg shadow hover:shadow-lg transition md:text-lg">
              <h3 className="text-xl font-semibold mb-2">Discover Creators</h3>
              <p>Find and support creators from around the world.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-7 px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Tippified</h2>
          <p className="text-xs text-gray-700 md:text-lg">
            Tippified empowers creators to monetize their work while giving fans
            a seamless way to show support.
          </p>
        </section>

        {/* CTA Footer */}
        <section className="py-20 px-6 bg-purple-600 text-white text-center">
          <h2 className="text-xs font-bold mb-5 md:text-lg">
            Ready to start getting tips from your fans and supporters?
          </h2>

          <div className="flex flex-row gap-4 justify-center">
            <a
              href="https://app.tippified.com/creator/signup"
              className="px-4 py-2 bg-white text-sm text-purple-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Signup
            </a>

            <a
              href="https://app.tippified.com/creator/signin"
              className="px-4 py-2 text-sm bg-white text-purple-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Sign In
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 bg-gray-800 text-gray-300 text-center text-sm md:text-base">
          &copy; {new Date().getFullYear()} Tippified. All rights reserved.
          <p className="text-xs text-gray-500 text-center">A product of Grundex Limited.</p>
        </footer>
      </main>
    </>
  );
}