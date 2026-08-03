"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import {
  FiArrowRight,
  FiArrowUp,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiGift,
  FiHeart,
  FiHelpCircle,
  FiInfo,
  FiPhone,
  FiShield,
  FiTarget,
  FiUserPlus,
  FiX,
  FiZap,
} from "react-icons/fi";

import ActivityTeaserSection from "./components/ActivityTeaserSection";
import BannerSlider from "./components/BannerSlider";
import BlogCardHorizontal from "./components/BlogCardHorizontal";
import LiveNowBar from "./components/LiveNowBar";
import NavBar from "./components/NavBar";
import TrendingCreatorsBar from "./components/TrendingCreatorsBar";
import WhoUsesTippified from "./components/WhoUsesTippified";
import { pacifico } from "./font";
import { useScrollRestoration } from "./useScrollRestoration";

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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  published_at: string;
  author_name: string;
}

interface FeatureItem {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled: T[] = [...array];
  for (let i: number = shuffled.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function HomePage(): ReactElement {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const rememberScroll = useScrollRestoration("home-scroll");

  const { data: blogs = [], isLoading: loadingBlogs } = useQuery<BlogPost[]>({
    queryKey: ["blogs"],
    queryFn: async (): Promise<BlogPost[]> => {
      const res: Response = await fetch(
        "https://api.tippified.com/api/adminpanel/public/blogs/",
      );
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data: { results: BlogPost[] } = await res.json();
      return data.results.slice(0, 10);
    },
  });

  const { data: goals = [], isLoading: loadingGoals } = useQuery<PublicGoal[]>({
    queryKey: ["goals"],
    queryFn: async (): Promise<PublicGoal[]> => {
      const res: Response = await fetch(
        "https://api.tippified.com/api/auth/public-goals/",
      );
      if (!res.ok) throw new Error("Failed to fetch goals");
      const data: { results?: PublicGoal[] } | PublicGoal[] = await res.json();
      const results: PublicGoal[] = Array.isArray(data)
        ? data
        : (data.results ?? []);
      return shuffleArray(results);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const [heroVisible, setHeroVisible] = useState<boolean>(false);
  const [featuresVisible, setFeaturesVisible] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [aboutVisible, setAboutVisible] = useState<boolean>(false);
  const [ctaVisible, setCtaVisible] = useState<boolean>(false);
  const [modalGoal, setModalGoal] = useState<PublicGoal | null>(null);

  const capitalizeWords = (text: string): string =>
    text
      ?.trim()
      .split(/\s+/)
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "";

  const formatAmount = (amount: string): string => {
    const num: number = Number(amount);
    if (isNaN(num)) return amount;
    return num.toLocaleString("en-NG");
  };

  const features: FeatureItem[] = [
    {
      title: "Fast & Global Tips",
      desc: "Fans can send tips from anywhere using secure payments powered by Paystack.",
      icon: FiZap,
    },
    {
      title: "Secure Creator Wallets",
      desc: "Creators can cashout anytime to your verified bank account.",
      icon: FiCreditCard,
    },
    {
      title: "Secure & Transparent",
      desc: "All payments processed by trusted partners. We don't hold or store user funds.",
      icon: FiShield,
    },
  ];

  const observeElement = (el: Element | null, callback: () => void): void => {
    if (!el) return;
    const observer: IntersectionObserver = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
  };

  useEffect(() => {
    observeElement(heroRef.current, () => setHeroVisible(true));
    observeElement(aboutRef.current, () => setAboutVisible(true));
    observeElement(ctaRef.current, () => setCtaVisible(true));
    featuresRef.current.forEach((el: HTMLDivElement | null, i: number) =>
      observeElement(el, () =>
        setFeaturesVisible((prev: boolean[]) => {
          const newState: boolean[] = [...prev];
          newState[i] = true;
          return newState;
        }),
      ),
    );
  }, []);

  return (
    <>
      <NavBar onNavigate={rememberScroll} />
      <main className="bg-[#fdfcff] text-purple-900 pb-20 md:pb-0">
        {/* HERO */}
        <section
          id="hero"
          ref={heroRef}
          className="relative overflow-hidden bg-linear-to-br from-[#15052E] via-[#4C1D95] to-[#6D28D9] text-white py-16 px-6 isolate"
        >
          {/* dashboard gradient orbs - darker so text stays readable */}
          <div className="absolute -right-24 -top-24 h-105 w-105 rounded-full bg-[#7C3AED]/30 blur-[80px] pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 h-105 w-105 rounded-full bg-[#2E1065]/80 blur-[90px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center"
          >
            <div>
              <p className={`text-xl mb-4 text-white ${pacifico.className}`}>
                tippified.
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[0.95] tracking-tight mb-6 text-white">
                Get Tipped for What You Create
              </h1>
              {/* Don't use text-purple-100 on purple - fails contrast. Use white 85% */}
              <p className="text-[15px] md:text-[17px] leading-7 text-white/85 mb-8 max-w-xl font-medium">
                Nigeria&apos;s all-in-one creator monetization platform. Receive
                tips, gifts, goal contributions and wishlist purchases with
                secure payments powered by Paystack and settlements via Wema
                Bank.
              </p>
              <div className="flex flex-wrap gap-3">
                {/* Primary: stays white bg, but text is now #4C1D95 not 700 */}
                <a
                  href="https://app.tippified.com/creator/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#4C1D95] font-bold shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)] hover:bg-zinc-100 transition"
                >
                  <FiUserPlus /> Become a Creator
                </a>

                {/* Secondary: all same dark solid for contrast, not translucent white */}
                <a
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2E1065]/80 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-[#3B1F8A] hover:border-white/30 transition"
                >
                  <FiInfo /> How it works
                </a>
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2E1065]/80 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-[#3B1F8A] hover:border-white/30 transition"
                >
                  <FiHelpCircle /> FAQ
                </a>
                <a
                  href="/contact-us"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E1040]/80 backdrop-blur-md border border-white/15 text-white font-semibold hover:bg-[#2A1760] transition"
                >
                  <FiPhone /> Contact
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="banner">
          <BannerSlider />
        </section>
        <section id="discover">
          <ActivityTeaserSection />
        </section>
        <div className="sticky top-0 z-40" id="live">
          <LiveNowBar />
        </div>

        {/* BLOGS */}
        <section className="py-12 px-6" id="blog">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-extrabold tracking-tight">
                Latest Blog Posts
              </h2>
              <span className="rounded-full bg-purple-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-600 ring-1 ring-purple-100">
                Fresh
              </span>
            </div>
            {loadingBlogs && (
              <p className="text-center text-purple-400">Loading blogs...</p>
            )}
            {!loadingBlogs && blogs.length > 0 && (
              <div className="flex flex-col gap-4">
                {blogs.map((blog: BlogPost) => (
                  <BlogCardHorizontal key={blog.id} blog={blog} />
                ))}
              </div>
            )}
            {!loadingBlogs && blogs.length === 0 && (
              <p className="text-center text-purple-400">
                No blog posts found.
              </p>
            )}
          </div>
        </section>

        <section id="users">
          <WhoUsesTippified />
        </section>
        <section id="trending">
          <TrendingCreatorsBar />
        </section>

        {/* FEATURES */}
        <section
          className="py-14 px-6 bg-linear-to-b from-purple-50/70 to-white"
          id="features"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center tracking-tight">
              Why Use Tippified?
            </h2>
            <p className="text-purple-600/70 text-center mt-2 mb-8 text-[14px]">
              Built for Nigerian creators. Trusted by fans worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {features.map((feature: FeatureItem, i: number) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    ref={(el: HTMLDivElement | null) => {
                      featuresRef.current[i] = el;
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={featuresVisible[i] ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group rounded-[1.6rem] border border-purple-100 bg-white p-6 shadow-[0_12px_30px_-18px_rgba(124,58,237,0.25)] hover:shadow-[0_20px_40px_-16px_rgba(124,58,237,0.3)] transition-all"
                  >
                    <div className="h-11 w-11 grid place-items-center rounded-2xl bg-linear-to-br from-purple-600 to-violet-600 text-white shadow-[0_8px_16px_-8px_rgba(124,58,237,0.6)] mb-4">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-[15px] font-bold">{feature.title}</h3>
                    <p className="mt-2 text-[13px] leading-6 text-purple-700/60">
                      {feature.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="block mb-1.5 px-3 md:hidden" id="image">
          <Image
            src="/banner-tippified.png"
            alt="Tippified tipping platform"
            width={450}
            height={500}
            className="rounded-3xl border border-purple-100 shadow-xl"
            priority
          />
        </div>

        {/* GOALS */}
        <section className="py-6 px-6 bg-white" id="pubic-goals">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-extrabold tracking-tight text-center mb-7">
              Support a Creator&apos;s Goal
            </h2>
            {loadingGoals && (
              <p className="text-center text-purple-400">Loading goals...</p>
            )}
            <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
              <div className="flex gap-4">
                {goals.slice(0, 10).map((goal: PublicGoal) => (
                  <motion.div
                    key={goal.id}
                    whileHover={{ y: -3 }}
                    className="min-w-65px shrink-0 rounded-[1.4rem] border border-purple-100 bg-linear-to-br from-white to-purple-50/60 p-px shadow-sm"
                  >
                    <div className="rounded-[1.35rem] bg-white p-5 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="h-7 w-7 grid place-items-center rounded-full bg-purple-600 text-white">
                          <FiTarget size={12} />
                        </span>
                        <h3 className="font-bold text-[14px] leading-tight truncate">
                          {capitalizeWords(goal.title)}
                        </h3>
                      </div>
                      <p className="text-[11px] text-purple-500 mb-3">
                        by{" "}
                        <span className="font-bold text-purple-700">
                          {capitalizeWords(goal.username)}
                        </span>{" "}
                        • {goal.referral_code}
                      </p>
                      <div className="space-y-1.5 text-[12px]">
                        <p className="flex items-center gap-1.5 text-purple-700/80">
                          <FiArrowUp className="text-purple-600" /> Target: ₦
                          {formatAmount(goal.target_amount)}
                        </p>
                        <p className="flex items-center gap-1.5 text-purple-700/80">
                          <FiGift className="text-purple-600" /> Local: ₦
                          {formatAmount(goal.current_amount)}
                        </p>
                        <p className="flex items-center gap-1.5 text-purple-700/80">
                          <FiDollarSign className="text-purple-600" /> Foreign:
                          ${formatAmount(goal.current_foreign_usd)}
                        </p>
                      </div>
                      <p className="text-[10px] text-purple-400 mt-3 flex items-center gap-1">
                        <FiClock size={10} />{" "}
                        {new Date(goal.created_at).toLocaleDateString()}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <a
                          href={`https://app.tippified.com/tip/${goal.referral_code}`}
                          onClick={rememberScroll}
                          className="flex-1 text-center text-[12px] bg-linear-to-r from-purple-600 to-violet-600 text-white py-2.5 rounded-full font-bold shadow-[0_8px_16px_-8px_rgba(124,58,237,0.6)] hover:opacity-95 transition"
                        >
                          Support
                        </a>
                        <button
                          onClick={() => setModalGoal(goal)}
                          className="flex-1 text-[12px] bg-purple-50 border border-purple-100 text-purple-700 py-2.5 rounded-full font-bold hover:bg-purple-100 transition"
                        >
                          About
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {!loadingGoals && goals.length > 0 && (
          <div className="mt-2 flex justify-center mb-6">
            <a
              href="/search-goals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 text-white font-bold rounded-full shadow-[0_10px_20px_-10px_rgba(124,58,237,0.6)] hover:opacity-95 transition"
            >
              See more goals <FiArrowRight />
            </a>
          </div>
        )}

        {/* PAYMENTS */}
        <section
          className="py-14 px-6 bg-linear-to-br from-purple-50 to-white text-center"
          id="payment"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
            Secure Payments Powered by Trusted Partners
          </h2>
          <p className="text-purple-700/60 max-w-3xl mx-auto mb-10 text-[14px] leading-6">
            Payments securely processed by Paystack. Creator balances maintained
            within Tippified secure ledger, settlements via Wema Bank. Tippified
            does not operate as a bank.
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {["visa", "mastercard", "verve", "paystack", "wema"].map(
              (img: string) => (
                <div
                  key={img}
                  className="h-12 px-4 grid place-items-center rounded-2xl bg-white border border-purple-100 shadow-sm"
                >
                  <Image
                    src={`/${img}.png`}
                    alt={img}
                    width={90}
                    height={40}
                    className="object-contain"
                  />
                </div>
              ),
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          ref={aboutRef}
          className="py-16 px-6 max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={aboutVisible ? { opacity: 1, y: 0 } : {}}
            className="rounded-[1.8rem] border border-purple-100 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(124,58,237,0.25)]"
          >
            <h2 className="text-3xl font-extrabold tracking-tight mb-6">
              About Tippified
            </h2>
            <p className="text-purple-700/70 md:text-[15px] leading-7">
              <a href="/about" className="font-bold text-purple-700 underline">
                Tippified
              </a>{" "}
              is Nigeria&apos;s all-in-one creator monetization platform that
              enables creators to receive monetary tips, virtual gifts, birthday
              wishlist purchases, goal contributions and live stream support
              from fans worldwide.
              <br />
              <br />
              Payments securely processed through Paystack. Creator balances
              maintained securely within Tippified, while settlements processed
              through our regulated banking partner, Wema Bank, into verified
              bank accounts.
            </p>
          </motion.div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          ref={ctaRef}
          className="py-20 px-6 bg-linear-to-br from-purple-600 via-violet-600 to-indigo-600 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
            className="relative"
          >
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight mb-6">
              Ready to start receiving tips from your fans?
            </h2>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href="https://app.tippified.com/creator/signup"
                className="px-7 py-3 bg-white text-purple-700 font-bold rounded-full shadow hover:bg-purple-50 transition inline-flex items-center gap-2"
              >
                <FiHeart /> Get Started
              </a>
              <a
                href="https://app.tippified.com/creator/signin"
                className="px-7 py-3 bg-white/15 border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition"
              >
                Sign In
              </a>
            </div>
          </motion.div>
        </section>

        {/* MODAL */}
        <AnimatePresence>
          {modalGoal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-purple-900/40 backdrop-blur-xl flex items-center justify-center p-4 z-50"
              onClick={() => setModalGoal(null)}
            >
              <motion.div
                initial={{ scale: 0.96, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 10 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 relative border border-purple-100 shadow-[0_20px_60px_-20px_rgba(124,58,237,0.4)]"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100"
                  onClick={() => setModalGoal(null)}
                >
                  <FiX />
                </button>
                <div className="h-10 w-10 grid place-items-center rounded-2xl bg-linear-to-br from-purple-600 to-violet-600 text-white mb-3">
                  <FiTarget />
                </div>
                <h3 className="text-[18px] font-extrabold tracking-tight">
                  {capitalizeWords(modalGoal.title)}
                </h3>
                <p className="text-[12px] text-purple-500 mt-1">
                  By{" "}
                  <span className="font-bold text-purple-700">
                    {capitalizeWords(modalGoal.username)}
                  </span>
                </p>
                <p className="text-[13px] leading-6 text-purple-700/70 mt-3">
                  {modalGoal.about}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <footer className="py-10 bg-linear-to-br from-purple-900 via-violet-900 to-indigo-900 text-purple-100 text-center text-sm border-t border-white/10">
          <div className="flex justify-center gap-5 mb-4">
            <a
              href="https://instagram.com/tippified_app"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com/tippified"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com/tippified"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15 transition"
            >
              <FaTwitter />
            </a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Tippified. All rights reserved.
            <p className="text-[11px] text-purple-200/60 mt-2 max-w-2xl mx-auto">
              Tippified is a product of Grundex Limited. Payments securely
              powered by Paystack. Settlement via Wema Bank.
            </p>
          </div>
        </footer>

        <a
          href="/about"
          className="fixed right-4 bottom-20 md:bottom-10 z-50 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-linear-to-br from-purple-600 to-violet-600 text-white shadow-[0_12px_24px_-8px_rgba(124,58,237,0.7)] hover:scale-105 transition"
        >
          <FiInfo className="w-6 h-6" />
        </a>
      </main>
    </>
  );
}
