"use client";

import {
  ArrowUpIcon,
  BanknotesIcon,
  BoltIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import NavBar from "./components/NavBar";
import StatsCounterSection from "./components/StatsCounterSection";
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
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
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
        setGoals(data.results || data);
      } catch (err) {
        console.error("Failed to load goals", err);
      } finally {
        setLoadingGoals(false);
      }
    };
    fetchGoals();
  }, []);

  const capitalizeWords = (text: string): string =>
    text
      ?.trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "";

  const features = [
    {
      title: "Fast & Global Tips",
      desc: "Fans can send tips from anywhere in the world using secure payment methods powered by Paystack.",
      icon: BoltIcon,
    },
    {
      title: "Creator Wallets",
      desc: "Creators receive their funds in wallets provided by OPay, giving them easy access and control of their money.",
      icon: BanknotesIcon,
    },
    {
      title: "Secure & Transparent",
      desc: "All payments are processed by trusted partners. Tippified does not hold or store user funds.",
      icon: ShieldCheckIcon,
    },
  ];

  const observeElement = (el: Element | null, callback: () => void) => {
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
        {/* HERO */}
        <section
          ref={heroRef}
          className={`bg-linear-to-br from-purple-600 to-purple-800 text-white py-8 px-6 transition-all duration-700 ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className={`text-xl mb-4  ${pacifico.className}`}>tippified.</p>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Get Tipped for What You Create
              </h1>

              <p className="text-lg md:text-xl mb-8 max-w-xl">
                Tippified is a Nigerian tipping platform that helps creators
                receive financial support from fans worldwide. Share your
                tipping link and receive funds securely into your OPay wallet.
              </p>

              <div className="flex flex-col md:flex-row gap-4">
  <a
    href="https://app.tippified.com/creator/signup"
    className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-xl shadow hover:bg-gray-100 transition"
  >
    <UserPlusIcon className="w-5 h-5" />
    Become a Creator
  </a>

  <a
    href="/how-it-works"
    className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-400 text-white font-bold rounded-xl shadow hover:bg-purple-500 transition"
  >
    <InformationCircleIcon className="w-5 h-5" />
    How it works
  </a>

  <a
    href="/contact-us"
    className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-500 text-white font-bold rounded-xl shadow hover:bg-purple-400 transition"
  >
    <PhoneIcon className="w-5 h-5" />
    Contact Us
  </a>
</div>
            </div>

           
          </div>
        </section>

         <div className="block mt-2 px-3 md:hidden">
              <Image
                src="/banner-tippified.png"
                alt="Tippified tipping platform"
                width={450}
                height={500}
                className="rounded shadow-xl"
                priority
              />
            </div>

        <StatsCounterSection />

        {/* FEATURES */}
        <section className="py-20 px-6 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Use Tippified?
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Built for Nigerian creators. Trusted by fans worldwide.
          </p>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  ref={(el: HTMLDivElement | null) => {featuresRef.current[i] = el}}
                  className={`bg-purple-50 border border-l-purple-200 p-8 rounded-2xl shadow hover:shadow-xl transition-all duration-700 ${
                    featuresVisible[i]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <div className="w-12 h-12 bg-purple-200 text-purple-700 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        
        {/* Public Goals Section */}
<section className="py-2 px-6 bg-white">
  <h2 className="text-3xl font-bold text-center mb-9">
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
        className="min-w-62.5 bg-purple-50 border border-black rounded-lg p-6 shadow hover:shadow-lg transition shrink-0"
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

 {!loadingGoals && goals.length > 0 && (
  <div className="mt-5 flex justify-center mb-1">
    <a
      href="/search-goals"
      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700 transition"
    >
      See more goals →
    </a>
  </div>
)}
 

 {/* PAYMENTS */}
<section className="py-14 px-6 bg-gray-50 text-center">
  <h2 className="text-2xl md:text-3xl font-bold mb-6">
    Secure Payments Powered by Trusted Partners
  </h2>

  <p className="text-gray-700 max-w-3xl mx-auto mb-10">
    Payments on Tippified are processed using licensed payment providers such as{" "}
    <b>Paystack</b> for card and bank payments, and creator wallets are provided
    by <b>OPay</b>. Tippified does not operate as a bank or hold customer funds.
    All funds are settled directly to creators through our payment partners.
  </p>

  <div className="flex justify-center items-center gap-6 flex-wrap">
    {["visa", "mastercard", "verve", "paystack", "opay"].map((img) => (
      <Image
        key={img}
        src={`/${img}.png`}
        alt={img}
        width={90}
        height={40}
        className="object-contain"
      />
    ))}
  </div>
 </section>

        {/* ABOUT */}
        <section
          ref={aboutRef}
          className={`py-16 px-6 max-w-4xl mx-auto text-center transition-all duration-700 ${
            aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6">About Tippified</h2>
          <p className="text-gray-700 md:text-lg">
            <span className="text-purple-600 font-bold"><a href="/about" className="text-purple-600">Tippified</a></span> is a
            Nigerian platform built to help creators receive tips directly from
            their fans. We provide creators with a unique tipping link that can
            be shared across social media and websites.
            <br />
            <br />
            Payments are processed securely via <b>Paystack</b>, while creator
            wallets are provided by <b>OPay</b>, giving creators fast access to
            their funds.
            <br />
            <br />
            Our mission is to strengthen the Nigerian creator economy by
            providing safe, transparent, and easy-to-use tipping infrastructure.
          </p>
        </section>

        {/* CTA */}
        <section
          ref={ctaRef}
          className={`py-20 px-6 bg-purple-700 text-white text-center transition-all duration-700 ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            Ready to start receiving tips from your fans?
          </h2>
          <div className="flex gap-4 justify-center">
            <a
              href="https://app.tippified.com/creator/signup"
              className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl shadow hover:bg-gray-100 transition"
            >
              Get Started
            </a>
            <a
              href="https://app.tippified.com/creator/signin"
              className="px-6 py-3 bg-purple-500 text-white font-bold rounded-xl shadow hover:bg-purple-400 transition"
            >
              Sign In
            </a>
          </div>
        </section>

        {/* MODAL */}
        {modalGoal && (
          <div
            className="fixed inset-0 bg-purple-500 bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setModalGoal(null)}
          >
            <div
              className="bg-white rounded-lg max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setModalGoal(null)}
              >
                ✖
              </button>
              <h3 className="text-xl font-bold mb-4">
                {capitalizeWords(modalGoal.title)}
              </h3>
              <p className="text-gray-700 mb-2">
                By{" "}
                <span className="font-semibold">
                  {capitalizeWords(modalGoal.username)}
                </span>
              </p>
              <p className="text-gray-700">{modalGoal.about}</p>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="py-8 bg-gray-900 text-gray-300 text-center text-sm">
          &copy; {new Date().getFullYear()} Tippified. All rights reserved.
          <p className="text-xs text-gray-500 mt-2">
            Tippified is a product of Grundex Limited. Payments powered by Paystack
            and OPay.
          </p>
        </footer>

        <a
  href="/about"
  className="fixed right-4 bottom-20 md:bottom-10 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition transform hover:scale-105"
  aria-label="About Tippified"
>
  <InformationCircleIcon className="w-7 h-7 md:w-8 md:h-8" />
</a>
      </main>
    </>
  );
}