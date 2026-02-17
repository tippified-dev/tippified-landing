"use client";

import { useEffect, useRef, useState } from "react";
import NavBar from "./components/NavBar";
import { pacifico } from "./font";


export default function HomePage() {
  // Refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<Array<HTMLDivElement | null>>([]);
  const aboutRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState([false, false, false]);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  const features = [
    {
      title: "Fast Tips",
      desc: "Fans can easily send tips very quickly and in different currencies, made possible by Paystack.",
    },
    {
      title: "Secure Wallet",
      desc: "As a creator you see first hand and in real time all your tips from fans boldly displayed in your transaction history and also in your wallets which are strongly encypted. .",
    },
    {
      title: "Discover Creators",
      desc: "Find and support creators who have set goals that might just interest you, these could be either goals to support a philantrophic cause or goals for personal reasons.",
    },
  ];

  // Helper function for intersection observer
  const observeElement = (el: HTMLElement | null, callback: () => void) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
  };

  useEffect(() => {
    observeElement(heroRef.current, () => setHeroVisible(true));
    observeElement(aboutRef.current, () => setAboutVisible(true));
    observeElement(ctaRef.current, () => setCtaVisible(true));

    featuresRef.current.forEach((el, i) =>
      observeElement(el, () =>
        setFeaturesVisible((prev) => {
          const newState = [...prev];
          newState[i] = true;
          return newState;
        })
      )
    );
  }, []);

  return (
    <>
      <NavBar />

      <main className="bg-white text-gray-900 pb-20 md:pb-0">
        {/* Hero Section */}
        <section
  ref={heroRef}
  className={`bg-purple-600 text-white pt-6 pb-16 px-6 transition-all duration-700 ease-out ${
    heroVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
  }`}
 >
          <div className="max-w-4xl max-auto text-left">
  <p className={`text-white text-sm mb-6 -ml-4 ${pacifico.className}`}>
    tippified.
  </p>

  <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-3">
    Welcome to Tippified
  </h1>

  <p className="text-lg md:text-2xl mb-6 max-w-xl">
   Dear creators! let your fans support you with tips from anywhere and in any currency.
  </p>

  <div className="flex flex-col md:flex-row gap-4">
    <a
      href="https://app.tippified.com/creator/signup"
      className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition"
    >
      Signup as Creator
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
 </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">Why Tippified?</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                ref={(el) => {
                  if (el) featuresRef.current[i] =el;
                }}
                className={`bg-white p-6 rounded-lg shadow hover:shadow-lg transition-transform duration-700 ease-out ${
                  featuresVisible[i]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section
          ref={aboutRef}
          className={`py-7 px-6 max-w-4xl mx-auto text-center transition-all duration-700 ease-out ${
            aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6">About Tippified</h2>
          <p className="text-sm text-gray-700 md:text-lg">
            <span className="text-purple-500 font-bold">Tippified</span> is Nigeria`s premier platform for empowering creators and connecting them with their fans. 
            Our mission is simple: help creators monetize their talent while giving fans a seamless way to show appreciation through instant tips.

Whether you are an influencer, artist, gamer, or content creator, <span className="text-purple-500 font-bold">Tippified</span> makes it effortless for your supporters to reward your work. Built on a secure and reliable payment system powered by <b>Paystack</b>, every tip reaches you safely and instantly.

We are dedicated to growing the Nigerian creator ecosystem by providing the tools and infrastructure creators need to thrive. With <span className="text-purple-500 font-bold">Tippified</span>, turning passion into sustainable income has never been easier.
          </p>
        </section>

        {/* CTA Footer */}
        <section
          ref={ctaRef}
          className={`py-20 px-6 bg-purple-600 text-white text-center transition-all duration-700 ease-out ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-sm font-bold mb-5 md:text-lg">
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
          <p className="text-xs text-gray-500 text-center">
            A product of Grundex Limited.
          </p>
        </footer>
      </main>
    </>
  );
}