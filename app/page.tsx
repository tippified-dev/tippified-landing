"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import {
  FiArrowRight,
  FiAtSign,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiGift,
  FiGrid,
  FiHeart,
  FiHelpCircle,
  FiInfo,
  FiLock,
  FiPhone,
  FiSearch,
  FiShield,
  FiShieldOff,
  FiTarget,
  FiTrendingUp,
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

        {/* GOALS - PREMIUM */}
        <section
          className="relative overflow-hidden bg-[#FCFAFF] border-y border-[#F3E8FF] py-20 px-6"
          id="pubic-goals"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-150 w-225 rounded-full bg-linear-to-b from-[#E9D5FF]/40 to-transparent blur-[80px]" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E9D5FF] shadow-sm mb-3">
                  <span className="h-7 w-7 rounded-full bg-linear-to-br from-[#4C1D95] to-[#6D28D9] grid place-items-center">
                    <FiTarget className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#4C1D95]">
                    Active Goals
                  </span>
                </div>
                <h2 className="text-3xl md:text-[38px] font-extrabold tracking-tight text-[#15052E]">
                  Support a Creator&apos;s{" "}
                  <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                    Goal
                  </span>
                </h2>
                <p className="text-[14px] text-[#52525B] font-medium mt-2 max-w-xl">
                  Real people, real dreams. Tip directly and watch their
                  progress grow.
                </p>
              </div>
            </motion.div>

            {loadingGoals ? (
              <div className="flex gap-5 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-85 h-70 rounded-[28px] bg-white border border-[#F3E8FF] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 pb-6">
                <div className="flex gap-5">
                  {goals.slice(0, 10).map((goal: PublicGoal, idx: number) => {
                    const target = Number(goal.target_amount) || 1;
                    const current = Number(goal.current_amount) || 0;
                    const progress = Math.min(
                      100,
                      Math.max(8, (current / target) * 100),
                    );

                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: idx * 0.07,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ y: -6 }}
                        className="group min-w-85 max-w-90 shrink-0 rounded-[28px] bg-white border border-[#E9D5FF] p-px shadow-[0_12px_40px_-20px_rgba(76,29,149,0.25)] hover:shadow-[0_20px_50px_-18px_rgba(76,29,149,0.35)] transition-shadow"
                      >
                        <div className="rounded-[27px] bg-linear-to-b from-white to-[#FDFAFF] p-6 h-full flex flex-col relative overflow-hidden">
                          {/* soft glow */}
                          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#F5F0FF] group-hover:bg-[#EDE9FE] transition-colors pointer-events-none" />

                          {/* top */}
                          <div className="relative flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#15052E] text-white grid place-items-center font-bold text-sm">
                                {goal.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-[#18181B] leading-tight flex items-center gap-1">
                                  {capitalizeWords(goal.username)}
                                </p>
                                <p className="text-[11px] font-medium text-[#71717A] flex items-center gap-1">
                                  <FiAtSign size={10} /> {goal.referral_code}
                                </p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F0FF] border border-[#E9D5FF] text-[10px] font-bold tracking-wide uppercase text-[#4C1D95]">
                              <FiClock size={10} />{" "}
                              {new Date(goal.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          {/* title */}
                          <h3 className="relative text-[18px] font-extrabold tracking-tight text-[#15052E] leading-[1.15] line-clamp-2 min-h-11">
                            {capitalizeWords(goal.title)}
                          </h3>

                          {/* progress */}
                          <div className="mt-5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[12px] font-semibold text-[#52525B] flex items-center gap-1">
                                <FiTrendingUp className="text-[#4C1D95]" />{" "}
                                Progress
                              </span>
                              <span className="text-[12px] font-bold text-[#4C1D95]">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-[#F3E8FF] overflow-hidden p-1">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${progress}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 1.1,
                                  delay: 0.2 + idx * 0.05,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="h-full rounded-full bg-linear-to-r from-[#4C1D95] to-[#7C3AED] relative"
                              >
                                <motion.div
                                  animate={{ x: ["-100%", "200%"] }}
                                  transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                    repeatDelay: 1.2,
                                  }}
                                  className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-white/30 to-transparent"
                                />
                              </motion.div>
                            </div>
                          </div>

                          {/* stats - not packed */}
                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-[#F9F5FF] border border-[#F3E8FF] p-3">
                              <p className="text-[10px] font-bold tracking-widest uppercase text-[#7C3AED] flex items-center gap-1 mb-1">
                                <FiTarget size={10} /> Target
                              </p>
                              <p className="text-[14px] font-extrabold text-[#15052E]">
                                ₦{formatAmount(goal.target_amount)}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-[#15052E] p-3">
                              <p className="text-[10px] font-bold tracking-widest uppercase text-[#C4B5FD] flex items-center gap-1 mb-1">
                                <FiGift size={10} /> Raised
                              </p>
                              <p className="text-[14px] font-extrabold text-white">
                                ₦{formatAmount(goal.current_amount)}
                              </p>
                            </div>
                            {goal.current_foreign_usd && (
                              <div className="col-span-2 rounded-2xl bg-white border border-[#E9D5FF] p-3 flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-[#52525B] flex items-center gap-1">
                                  <FiDollarSign className="text-[#4C1D95]" />{" "}
                                  Foreign support
                                </span>
                                <span className="text-[13px] font-bold text-[#15052E]">
                                  ${formatAmount(goal.current_foreign_usd)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* actions */}
                          <div className="mt-auto pt-5 flex gap-2.5">
                            <a
                              href={`https://app.tippified.com/tip/${goal.referral_code}`}
                              onClick={rememberScroll}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[13px] bg-[#4C1D95] text-white py-3 rounded-full font-bold hover:bg-[#3B1F8A] transition shadow-[0_8px_20px_-10px_rgba(76,29,149,0.6)]"
                            >
                              <FiHeart size={14} /> Support
                            </a>
                            <button
                              onClick={() => setModalGoal(goal)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[13px] bg-white border border-[#E9D5FF] text-[#4C1D95] py-3 rounded-full font-bold hover:bg-[#F5F0FF] transition"
                            >
                              <FiInfo size={14} /> About
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {!loadingGoals && goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col items-center"
          >
            {/* divider */}
            <div className="w-full max-w-6xl h-px bg-linear-to-r from-transparent via-[#E9D5FF] to-transparent mb-10" />

            <motion.a
              href="/search-goals"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0, scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#15052E] border border-[#2A1A4A] text-white font-bold text-[14px] tracking-wide shadow-[0_12px_30px_-12px_rgba(21,5,46,0.6),0_0_0_1px_rgba(255,255,255,0.08)_inset] overflow-hidden"
            >
              {/* hover glow */}
              <div className="absolute inset-0 bg-linear-to-r from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* shimmer */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: "easeInOut",
                }}
                className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/15 to-transparent pointer-events-none"
              />

              <span className="relative flex items-center gap-2">
                <FiGrid className="w-4 h-4 text-[#C4B5FD]" />
                Explore all goals
              </span>

              <span className="relative h-7 w-7 rounded-full bg-white text-[#15052E] grid place-items-center group-hover:bg-[#15052E] group-hover:text-white border border-white/10 transition-colors">
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                >
                  <FiArrowRight size={14} />
                </motion.span>
              </span>

              <span className="relative ml-1 pl-4 border-l border-white/15 text-[12px] font-medium text-white/70">
                {goals.length}+ live
              </span>
            </motion.a>

            <p className="mt-3 text-[12px] font-medium text-[#71717A] flex items-center gap-1.5">
              <FiSearch size={12} className="text-[#7C3AED]" /> Find goals by
              creator, category or amount
            </p>
          </motion.div>
        )}

        {/* PAYMENTS - PREMIUM */}
        <section
          className="relative overflow-hidden bg-white border-t border-[#F3E8FF] py-20 px-6"
          id="payment"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-100 w-200 rounded-full bg-linear-to-b from-[#F5F0FF] to-transparent blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-6xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F0FF] border border-[#E9D5FF] mb-5">
              <FiShieldOff className="w-4 h-4 text-[#4C1D95]" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#4C1D95]">
                Bank-grade security
              </span>
            </div>

            <h2 className="text-2xl md:text-[32px] font-extrabold tracking-tight text-[#15052E] max-w-2xl mx-auto leading-[1.1]">
              Secure Payments Powered by{" "}
              <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                Trusted Partners
              </span>
            </h2>

            <p className="text-[14px] leading-6 text-[#52525B] font-medium max-w-2xl mx-auto mt-4">
              Payments securely processed by Paystack. Creator balances
              maintained within Tippified secure ledger, settlements via Wema
              Bank.
              <span className="text-[#71717A]">
                {" "}
                Tippified does not operate as a bank.
              </span>
            </p>

            {/* Logos - no background box, premium grayscale to color */}
            <div className="mt-12 flex justify-center items-center gap-8 md:gap-14 flex-wrap">
              {["visa", "mastercard", "verve", "paystack", "wema"].map(
                (img, idx) => (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="group relative"
                  >
                    <Image
                      src={`/${img}.png`}
                      alt={img}
                      width={110}
                      height={42}
                      className="object-contain h-8 md:h-9 w-auto grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  </motion.div>
                ),
              )}
            </div>

            {/* trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center gap-3"
            >
              {[
                { icon: FiLock, text: "256-bit SSL Encrypted" },
                { icon: FiCheckCircle, text: "PCI DSS Compliant" },
                { icon: FiShieldOff, text: "Paystack Secured" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FCFAFF] border border-[#F3E8FF] text-[12px] font-semibold text-[#3F3F46]"
                >
                  <item.icon className="w-3.5 h-3.5 text-[#4C1D95]" />
                  {item.text}
                </div>
              ))}
            </motion.div>
          </motion.div>
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
