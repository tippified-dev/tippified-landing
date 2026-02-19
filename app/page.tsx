"use client";

import { ArrowUpIcon, BanknotesIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import NavBar from "./components/NavBar";
import { pacifico } from "./font";


interface PublicGoal { 

  id: number;
  username: string;
  referral_code: string;
  title: string;
  about: string;
  target_amount: string;
  current_amount: string;
  current_foreign_usd: string;
  created_at: string;
}



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
  const [goals, setGoals] = useState<PublicGoal[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [modalGoal, setModalGoal] = useState<PublicGoal | null>(null);



  useEffect(() => {
  const fetchGoals = async () => {
    try {
      setLoadingGoals(true);
      const res = await fetch("https://api.tippified.com/api/auth/public-goals/");
      const data = await res.json();
      setGoals(data.results || data); // supports pagination
    } catch (err) {
      console.error("Failed to load goals", err);
    } finally {
      setLoadingGoals(false);
    }
  };

  fetchGoals();
 }, []);

 
  const capitalizeWords = (text: string): string => {
    if (!text) return "";
    return text
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


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
  className={`bg-purple-600 text-white pt-4 pb-16 px-6 transition-all duration-700 ease-out ${
    heroVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
  }`}
 >
          <div className="max-w-4xl max-auto text-left">
  <p className={`text-white text-lg mb-12 -ml-5 ${pacifico.className}`}>
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

        {/* Public Goals Section */}
<section className="py-12 px-6 bg-white">
  <h2 className="text-3xl font-bold text-center mb-10">
    Support a Creator’s Goal
  </h2>

  {loadingGoals && (
    <p className="text-center text-gray-500">Loading goals...</p>
  )}
 <div className="max-w-6xl mx-auto overflow-x-auto scrollbar-hide">
  <div className="flex gap-4">
    {goals.slice(0, 10).map((goal) => (
      <div
        key={goal.id}
        className="min-w-62.5 border rounded-lg p-6 shadow hover:shadow-lg transition shrink-0"
      >
        <h3 className="font-bold text-lg mb-1">{capitalizeWords(goal.title)}</h3>
        <p className="text-sm text-gray-500 mb-2">
          by <span className="font-semibold">{capitalizeWords(goal.username)} </span>
          - (<span className="font-semibold">{goal.referral_code} </span>)
        </p>

        <p className="text-sm mb-1 flex items-center gap-1">
  <ArrowUpIcon className="w-4 h-4 text-purple-600" /> Target: ₦{goal.target_amount}
</p>

<p className="text-sm mb-1 flex items-center gap-1">
  <BanknotesIcon className="w-4 h-4 text-purple-600" /> Local: ₦{goal.current_amount}
</p>

<p className="text-sm mb-1 flex items-center gap-1">
  <CurrencyDollarIcon className="w-4 h-4 text-purple-600" /> Foreign: ${goal.current_foreign_usd}
</p>
        <p className="text-xs text-gray-400 mt-2">
          Created: {new Date(goal.created_at).toLocaleDateString()}
        </p>

        <div className="flex gap-2 mt-4">
          <a
            href={`https://app.tippified.com/tip/${goal.referral_code}`}
            className="flex-1 text-center text-xs bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Support 
          </a>

          <button
            className="flex-1 text-center text-xs bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
            onClick={() => setModalGoal(goal)}
          >
            About
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
 </section>
 {
  goals && (
    <section className="py-3 px-6 bg-white">
  <a
      href="/search-goals"
      className="px-3 py-3 bg-gray-100 text-xs text-purple-600 font-bold rounded-lg shadow hover:bg-purple-800 transition"
    >
      see more to support
    </a>
 </section>
  )
 }

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

        {modalGoal && (
  <div
    className="fixed inset-0 bg-purple-500 bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={() => setModalGoal(null)}
  >
    <div
      className="bg-white rounded-lg max-w-md w-full p-6 relative"
      onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={() => setModalGoal(null)}
      >
        ✖
      </button>
      <h3 className="text-xl font-bold mb-4">{capitalizeWords(modalGoal.title)}</h3>
      <p className="text-gray-700 mb-2">
        By: <span className="font-semibold">{capitalizeWords(modalGoal.username)}</span>
      </p>
      <p className="text-gray-700">{modalGoal.about}</p>
    </div>
  </div>
 )}

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