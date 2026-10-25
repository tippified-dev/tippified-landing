"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiAtSign,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiGift,
  FiGrid,
  FiHeart,
  FiInfo,
  FiLock,
  FiSearch,
  FiShield,
  FiShieldOff,
  FiTarget,
  FiTrendingUp,
  FiX,
  FiZap,
} from "react-icons/fi";
import ActivityTeaserSection from "./components/ActivityTeaserSection";
import BannerSlider from "./components/BannerSlider";
import BlogCardHorizontal from "./components/BlogCardHorizontal";
import CreatorSignupBanner from "./components/CreatorSignupBanner";
import CreatorTipBanner from "./components/CreatorTipBanner";
import EarningsProof from "./components/EarningsProof";
import LiveNowBar from "./components/LiveNowBar";
import NavBar from "./components/NavBar";
import PremiumHero from "./components/PremiumHero";
import StickyGemBanner from "./components/StickyGemBanner";
import TrendingCreatorsBar from "./components/TrendingCreatorsBar";
import WhoUsesTippified from "./components/WhoUsesTippified";
import { bricolage, fredoka } from "./font";
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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  published_at: string;
  author_name: string;
  excerpt?: string; // ADDED: if your API adds this, it will show. If not, fallback below works.
  category?: string;
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

// SAFE FALLBACK: if API has no excerpt yet, we still show real text so AdSense sees content
function getExcerpt(blog: BlogPost): string {
  if (blog.excerpt && blog.excerpt.trim().length > 20) return blog.excerpt;
  return `Learn how Nigerian creators use Tippified to grow their audience, receive tips from fans, and turn support into steady income. In this article: ${blog.title}.`;
}

export default function HomePage({
  initialBlogs = [],
}: {
  initialBlogs?: BlogPost[];
}): ReactElement {
  const aboutRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const rememberScroll = useScrollRestoration("home-scroll");
  // REMOVED showAllBlogs state - blog modal deleted, replaced with /blog link
  const blogs = initialBlogs; // was useQuery, now server prop - same data, visible to crawler

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
      desc: "Fans can send tips from anywhere in the world using secure payments powered by Paystack. Creators receive support instantly, whether it is a one-time tip, a birthday gift, or a contribution to a goal.",
      icon: FiZap,
    },
    {
      title: "Creator Tracked Tips",
      desc: "Every tip is tracked inside your creator dashboard. You can see who tipped, how much you earned, and your progress toward each goal in real time.",
      icon: FiCreditCard,
    },
    {
      title: "Secure & Transparent",
      desc: "All payments are processed by trusted partners like Paystack. Tippified does not operate as a bank and does not hold or store user funds, so every transaction remains transparent and secure.",
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
        <PremiumHero />
        <EarningsProof />
        <StickyGemBanner />
        <section id="banner">
          <BannerSlider />
        </section>
        <CreatorSignupBanner width={400} />
        <section id="discover">
          <ActivityTeaserSection />
        </section>
        <CreatorTipBanner className="mt-8" />
        <div className="sticky top-0 z-40" id="live">
          <LiveNowBar />
        </div>

        {/* BLOGS - SAME DESIGN, NOW SERVER RENDERED */}
        <section className="py-12 px-6" id="blog">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-extrabold tracking-tight">
                Latest Blog Posts
              </h2>
              <span className="rounded-full bg-purple-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-600 ring-1 ring-purple-100">
                {blogs.length} posts
              </span>
            </div>
            {blogs.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {blogs.slice(0, 6).map((blog: BlogPost) => (
                    <article
                      key={blog.id}
                      className="rounded-3xl bg-white border border-purple-100 p-4 shadow-sm"
                    >
                      <BlogCardHorizontal blog={blog} />
                      <p className="mt-3 text-[13.5px] leading-6 text-[#52525B] font-medium px-1">
                        {getExcerpt(blog)}
                      </p>
                      <a
                        href={`/blog/${blog.slug}`}
                        className="mt-2 inline-flex items-center gap-1 px-1 text-[13px] font-bold text-[#7C3AED]"
                      >
                        Read full article <FiArrowRight size={14} />
                      </a>
                    </article>
                  ))}
                </div>
                <Link
                  href="/blog"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-purple-100 bg-white py-3.5 text-base font-bold text-purple-700 shadow-sm hover:bg-purple-50"
                >
                  <FiGrid size={16} /> More blog posts
                  <span className="ml-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px]">
                    View all articles
                  </span>
                </Link>
              </>
            ) : (
              <p className="text-center text-purple-400">
                No blog posts found.
              </p>
            )}
          </div>
        </section>

        {/* CREATOR GUIDE - STATIC CONTENT FOR ADSENSE, DOES NOT CHANGE DESIGN */}
        <section
          className="py-12 px-6 bg-white border-y border-[#F3E8FF]"
          id="creator-guide"
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className={`${fredoka.className} text-[28px] leading-tight tracking-tight text-[#15052E]`}
            >
              What is Tippified and how do creators earn from it?
            </h2>
            <p
              className={`${bricolage.className} mt-4 text-[15px] leading-8 text-[#3F3F46] font-medium`}
            >
              Tippified is Africa&apos;s all-in-one creator monetization
              platform that enables creators to receive monetary tips, virtual
              gifts, birthday wishlist purchases, goal contributions and live
              stream support from fans worldwide. For Nigerian creators, this
              means you can turn followers on Instagram, TikTok, YouTube, and
              Threads into real income without waiting for brand deals. Fans
              support you directly through a single link, and you can track
              everything in one dashboard.
            </p>
            <h3
              className={`${fredoka.className} mt-8 text-[20px] text-[#15052E]`}
            >
              How tipping works
            </h3>
            <p
              className={`${bricolage.className} mt-3 text-[15px] leading-8 text-[#3F3F46] font-medium`}
            >
              A creator creates a page and shares their Tippified link. A fan
              opens the link, chooses an amount, and pays securely with
              Paystack. The creator sees the tip instantly in their dashboard
              and can thank the fan. Creators can also set goals, for example
              raising money for new equipment, a music video, or a birthday
              project, and fans can contribute directly to that goal and watch
              the progress bar grow.
            </p>
            <h3
              className={`${fredoka.className} mt-8 text-[20px] text-[#15052E]`}
            >
              Who uses Tippified?
            </h3>
            <p
              className={`${bricolage.className} mt-3 text-[15px] leading-8 text-[#3F3F46] font-medium`}
            >
              Musicians, fitness creators, comedians, writers, streamers, and
              lifestyle creators all use Tippified. If you create content and
              people enjoy it, you can ask your audience to support you. It
              works for small creators with a loyal community and for large
              creators who want an extra income stream beyond ads and
              sponsorships.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="rounded-full bg-[#15052E] text-white px-5 py-2.5 text-[13px] font-bold"
              >
                Read creator guides
              </Link>
              <Link
                href="/creator-monetization"
                className="rounded-full border border-purple-200 bg-white px-5 py-2.5 text-[13px] font-bold text-purple-700"
              >
                Learn about monetization
              </Link>
            </div>
          </div>
        </section>

        {/* REST OF YOUR PAGE - UNCHANGED FROM HERE */}
        <section id="users">
          <WhoUsesTippified />
        </section>
        <section id="trending">
          <TrendingCreatorsBar />
        </section>

        {/* FEATURES - PREMIUM - descriptions expanded only */}
        <section
          className="relative overflow-hidden bg-[#FCFAFF] py-16 sm:py-20 px-6"
          id="features"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 rounded-full bg-linear-to-b from-[#E9D5FF]/50 to-transparent blur-[80px]" />
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto">
              <div
                className={`mb-4 inline-flex items-center rounded-full bg-white px-3 py-1 ring-1 ring-[#E9D5FF] shadow-sm ${bricolage.className}`}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#6D28D9]">
                  Why Tippified?
                </span>
              </div>
              <h2
                className={`${fredoka.className} text-[32px] sm:text-[42px] leading-[0.95] tracking-tight text-[#15052E]`}
              >
                Built for creators who{" "}
                <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                  deserve more
                </span>
              </h2>
              <p
                className={`${bricolage.className} mt-3 text-[14px] sm:text-[15px] leading-6 font-medium text-[#71717A]`}
              >
                Built for Nigerian creators. Trusted by fans worldwide. Secure,
                fast, and made to help you earn.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {features.map((feature: FeatureItem, i: number) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    ref={(el: HTMLDivElement | null) => {
                      featuresRef.current[i] = el;
                    }}
                    initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                    animate={
                      featuresVisible[i]
                        ? { opacity: 1, y: 0, filter: "blur(0px)" }
                        : {}
                    }
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -6 }}
                    className="group relative rounded-4xl bg-white p-px shadow-[0_16px_40px_-20px_rgba(76,29,149,0.2)] hover:shadow-[0_24px_50px_-18px_rgba(76,29,149,0.35)] transition-all duration-300"
                  >
                    <div className="relative rounded-[1.95rem] bg-linear-to-b from-white to-[#FDFAFF] p-7 h-full overflow-hidden">
                      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#F5F0FF] group-hover:bg-[#EDE9FE] transition-colors" />
                      <div className="relative h-12 w-12 grid place-items-center rounded-2xl bg-linear-to-br from-[#15052E] to-[#4C1D95] text-white shadow-[0_10px_20px_-10px_rgba(21,5,46,0.7)] mb-5">
                        <Icon size={20} />
                      </div>
                      <h3
                        className={`${fredoka.className} text-[18px] leading-tight tracking-tight text-[#15052E]`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`${bricolage.className} mt-2.5 text-[13.5px] leading-6 font-medium text-[#52525B]`}
                      >
                        {feature.desc}
                      </p>
                    </div>
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

        {/* GOALS - PREMIUM - UNCHANGED LOGIC */}
        <section
          className="relative overflow-hidden bg-[#FCFAFF] border-y border-[#F3E8FF] py-12 px-6"
          id="pubic-goals"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-150 w-255 rounded-full bg-linear-to-b from-[#E9D5FF]/40 to-transparent blur-[80px]" />
          </div>
          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
            >
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E9D5FF] shadow-sm mb-3 ${bricolage.className}`}
                >
                  <span className="h-7 w-7 rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] grid place-items-center">
                    <FiTarget className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#4C1D95]">
                    Active Goals
                  </span>
                </div>
                <h2
                  className={`${fredoka.className} text-3xl md:text-[40px] leading-[0.9] tracking-tight text-[#15052E]`}
                >
                  Support a Creator&apos;s{" "}
                  <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                    Goal
                  </span>
                </h2>
                <p
                  className={`${bricolage.className} text-[14px] font-medium text-[#52525B] mt-2 max-w-xl`}
                >
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
                          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#F5F0FF] group-hover:bg-[#EDE9FE] transition-colors pointer-events-none" />
                          <div className="relative flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-10 w-10 rounded-full blinear-to-br from-[#15052E] to-[#4C1D95] text-white grid place-items-center font-bold text-sm ${fredoka.className}`}
                              >
                                {goal.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p
                                  className={`${fredoka.className} text-[13px] font-bold text-[#15052E] leading-tight`}
                                >
                                  {capitalizeWords(goal.username)}
                                </p>
                                <p
                                  className={`${bricolage.className} text-[11px] font-medium text-[#71717A] flex items-center gap-1`}
                                >
                                  <FiAtSign size={10} /> {goal.referral_code}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`${bricolage.className} inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F0FF] border border-[#E9D5FF] text-[10px] font-bold tracking-wide uppercase text-[#4C1D95]`}
                            >
                              <FiClock size={10} />{" "}
                              {new Date(goal.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3
                            className={`${fredoka.className} relative text-[18px] font-bold tracking-tight text-[#15052E] leading-[1.15] line-clamp-2 min-h-11`}
                          >
                            {capitalizeWords(goal.title)}
                          </h3>
                          <div className="mt-5">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`${bricolage.className} text-[12px] font-semibold text-[#52525B] flex items-center gap-1`}
                              >
                                <FiTrendingUp className="text-[#4C1D95]" />{" "}
                                Progress
                              </span>
                              <span
                                className={`${bricolage.className} text-[12px] font-bold text-[#4C1D95]`}
                              >
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
                                className="h-full rounded-full bg-linear-to-r from-[#15052E] to-[#7C3AED] relative"
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
                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-[#F9F5FF] border border-[#F3E8FF] p-3">
                              <p
                                className={`${bricolage.className} text-[10px] font-bold tracking-widest uppercase text-[#7C3AED] flex items-center gap-1 mb-1`}
                              >
                                <FiTarget size={10} /> Target
                              </p>
                              <p
                                className={`${fredoka.className} text-[14px] font-bold text-[#15052E]`}
                              >
                                ₦{formatAmount(goal.target_amount)}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-[#15052E] p-3">
                              <p
                                className={`${bricolage.className} text-[10px] font-bold tracking-widest uppercase text-[#C4B5FD] flex items-center gap-1 mb-1`}
                              >
                                <FiGift size={10} /> Raised
                              </p>
                              <p
                                className={`${fredoka.className} text-[14px] font-bold text-white`}
                              >
                                ₦{formatAmount(goal.current_amount)}
                              </p>
                            </div>
                            {goal.current_foreign_usd && (
                              <div className="col-span-2 rounded-2xl bg-white border border-[#E9D5FF] p-3 flex items-center justify-between">
                                <span
                                  className={`${bricolage.className} text-[11px] font-semibold text-[#52525B] flex items-center gap-1`}
                                >
                                  <FiDollarSign className="text-[#4C1D95]" />{" "}
                                  Foreign support
                                </span>
                                <span
                                  className={`${fredoka.className} text-[13px] font-bold text-[#15052E]`}
                                >
                                  ${formatAmount(goal.current_foreign_usd)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-auto pt-5 flex gap-2.5">
                            <a
                              href={`https://app.tippified.com/tip/${goal.referral_code}`}
                              onClick={rememberScroll}
                              className={`${bricolage.className} flex-1 inline-flex items-center justify-center gap-1.5 text-[13px] bg-[#15052E] text-white py-3 rounded-full font-bold hover:bg-[#1e1065] transition shadow-[0_8px_20px_-10px_rgba(21,5,46,0.6)]`}
                            >
                              <FiHeart size={14} /> Support
                            </a>
                            <button
                              onClick={() => setModalGoal(goal)}
                              className={`${bricolage.className} flex-1 inline-flex items-center justify-center gap-1.5 text-[13px] bg-white border border-[#E9D5FF] text-[#4C1D95] py-3 rounded-full font-bold hover:bg-[#F5F0FF] transition`}
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
            {!loadingGoals && goals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 flex flex-col items-center"
              >
                <div className="w-full max-w-6xl h-px bg-linear-to-r from-transparent via-[#E9D5FF] to-transparent mb-10" />
                <motion.a
                  href="/search-goals"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  className={`${bricolage.className} group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#15052E] border border-[#2A1A4A] text-white font-bold text-[14px] tracking-wide shadow-[0_12px_30px_-12px_rgba(21,5,46,0.6),0_0_0_1px_rgba(255,255,255,0.08)_inset] overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center gap-2">
                    <FiGrid className="w-4 h-4 text-[#C4B5FD]" /> Explore all
                    goals
                  </span>
                  <span className="relative h-7 w-7 rounded-full bg-white text-[#15052E] grid place-items-center group-hover:bg-[#15052E] group-hover:text-white border border-white/10 transition-colors">
                    <FiArrowRight size={14} />
                  </span>
                  <span className="relative ml-1 pl-4 border-l border-white/15 text-[12px] font-medium text-white/70">
                    {goals.length}+ live
                  </span>
                </motion.a>
                <p
                  className={`${bricolage.className} mt-3 text-[12px] font-medium text-[#71717A] flex items-center gap-1.5`}
                >
                  <FiSearch size={12} className="text-[#7C3AED]" /> Find goals
                  by creator, category or amount
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* PAYMENTS - UNCHANGED */}
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
              Payments securely processed by Paystack. Creator tracked tips
              maintained within Tippified dashboard.{" "}
              <span className="text-[#71717A]">
                {" "}
                Tippified does not operate as a bank.
              </span>
            </p>
            <div className="mt-12 flex justify-center items-center gap-8 md:gap-14 flex-wrap">
              {[
                "visa",
                "mastercard",
                "verve",
                "paystack",
                "wema",
                "【entity-paypal¦canonical_name=paypal】",
                "stripe",
              ].map((img, idx) => (
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
                    alt={`${img} payment logo`}
                    width={
                      img === "stripe" ||
                      img === "【entity-paypal¦canonical_name=paypal】"
                        ? 150
                        : 110
                    }
                    height={
                      img === "stripe" ||
                      img === "【entity-paypal¦canonical_name=paypal】"
                        ? 55
                        : 42
                    }
                    className={`object-contain w-auto grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 ${img === "stripe" || img === "paypal" ? "h-10 md:h-12" : "h-8 md:h-9"}`}
                  />
                </motion.div>
              ))}
            </div>
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

        {/* ABOUT - SAME TEXT + EXPANDED FOR ADSENSE */}
        <section
          id="about"
          ref={aboutRef}
          className="relative overflow-hidden bg-[#FCFAFF] py-16 px-6"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-100 w-175 -translate-x-1/2 rounded-full bg-[#E9D5FF]/40 blur-[80px]" />
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={
              aboutVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-3xl"
          >
            <div className="rounded-[2.5rem] bg-white p-px shadow-[0_20px_60px_-24px_rgba(76,29,149,0.3)]">
              <div className="rounded-[2.45rem] bg-linear-to-b from-white to-[#FDFAFF] px-7 py-10 sm:px-10 sm:py-12 text-center">
                <div
                  className={`mb-4 inline-flex items-center rounded-full bg-[#F5F0FF] px-3 py-1 ring-1 ring-[#E9D5FF] ${bricolage.className}`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#6D28D9]">
                    About us
                  </span>
                </div>
                <h2
                  className={`${fredoka.className} text-[30px] sm:text-[40px] leading-[0.9] tracking-tight text-[#15052E]`}
                >
                  About{" "}
                  <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                    Tippified
                  </span>
                </h2>
                <p
                  className={`${bricolage.className} mx-auto mt-5 max-w-2xl text-[15px] sm:text-[16px] leading-8 font-medium text-[#3F3F46]`}
                >
                  <a
                    href="/about"
                    className={`${fredoka.className} font-bold text-[#4C1D95] underline decoration-[#E9D5FF] decoration-2 underline-offset-4 hover:decoration-[#7C3AED] transition`}
                  >
                    Tippified
                  </a>{" "}
                  is Africa&apos;s all-in-one creator monetization platform that
                  enables creators to receive monetary tips, virtual gifts,
                  birthday wishlist purchases, goal contributions and live
                  stream support from fans worldwide. For Nigerian creators, it
                  means turning your audience into support without waiting for
                  brand deals. Every tip is tracked in your dashboard, and fans
                  can support you from anywhere with a single link.
                </p>
                <div
                  className={`${bricolage.className} mt-6 inline-flex items-center gap-2 rounded-full bg-[#15052E] px-4 py-2 text-[11px] font-bold text-white`}
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#A78BFA]" />
                  Payments securely processed through our partner.
                </div>
                <p
                  className={`${bricolage.className} mt-4 text-[12px] font-semibold text-[#A1A1AA]`}
                >
                  Creator tracked tips maintained within dashboard • Not a bank
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA - UNCHANGED */}
        <section
          id="cta"
          ref={ctaRef}
          className="relative py-24 md:py-32 px-6 bg-linear-to-br from-[#150821] via-[#2E1065] to-[#3D1A6B] text-white text-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute -top-40 -left-40 w-175 h-175 bg-violet-500/20 rounded-full blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-150 h-150 bg-purple-500/20 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
          </div>
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-[11px] tracking-widest uppercase font-semibold text-violet-200 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Creator Monetization in Nigeria & Africa
            </div>
            <h2 className="text-[28px] md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-4">
              Ready to start receiving
              <br />
              <span className="bg-linear-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
                tips from your fans?
              </span>
            </h2>
            <p className="text-violet-200/70 text-[15px] md:text-[17px] leading-relaxed max-w-xl mx-auto mb-9">
              Turn your audience into support. Tips, gifts, goals & fan funding
              — all in one premium link.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href="https://app.tippified.com/creator/signup"
                className="group px-8 py-3.5 bg-white text-[#2E1065] font-bold rounded-full shadow-[0_10px_30px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_15px_40px_-12px_rgba(255,255,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2"
              >
                <FiHeart className="group-hover:scale-110 transition-transform" />{" "}
                Get Started
              </a>
              <a
                href="https://app.tippified.com/creator/signin"
                className="px-8 py-3.5 bg-white/8 border border-white/15 text-white font-semibold rounded-full backdrop-blur-md hover:bg-white/0.12 hover:border-white/20 transition-all duration-300"
              >
                Sign In
              </a>
            </div>
            <div className="mt-8 grid gap-3">
              <a
                href="/creator-monetization"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 p-4 transition-all duration-300 hover:border-violet-300/30 hover:bg-white/[0.07]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/15 bg-violet-400/10 text-violet-200">
                    <FiTrendingUp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-white">
                      Creator monetization
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-violet-200/55">
                      Turn your creativity into income
                    </span>
                  </div>
                </div>
                <FiArrowUpRight className="h-4 w-4 shrink-0 text-violet-200/50" />
              </a>
              <a
                href="/exclusive-content"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 p-4 transition-all duration-300 hover:border-violet-300/30 hover:bg-white/[0.07]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/15 bg-violet-400/10 text-violet-200">
                    <FiLock className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-white">
                      Exclusive content
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-violet-200/55">
                      Share premium content with your fans
                    </span>
                  </div>
                </div>
                <FiArrowUpRight className="h-4 w-4 shrink-0 text-violet-200/50" />
              </a>
              <a
                href="/creator-giveaway"
                className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-amber-300/20 bg-linear-to-r from-amber-300/8 to-violet-400/6 p-4 transition-all duration-300 hover:border-amber-300/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-200">
                    <FiGift className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        Creator giveaway
                      </span>
                      <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-200">
                        ₦50,000
                      </span>
                    </div>
                    <span className="mt-1 block text-xs leading-relaxed text-violet-100/55">
                      Discover the giveaway and how to enter
                    </span>
                  </div>
                </div>
                <FiArrowUpRight className="h-4 w-4 shrink-0 text-amber-200/60" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* GOAL MODAL - KEPT, UNCHANGED */}
        <AnimatePresence>
          {modalGoal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-purple-600 backdrop-blur-xl flex items-center justify-center p-4 z-50"
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

        {/* FOOTER - UNCHANGED */}
        <footer className="relative py-12 px-6 bg-linear-to-br from-[#150821] via-[#2E1065] to-[#3D1A6B] text-purple-100 border-t border-white/[0.07] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-200 h-100 bg-violet-600/10 rounded-full blur-[100px]" />
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
          </div>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <span className="font-black tracking-tight text-white text-[22px]">
                  Tippified
                </span>
                <div className="h-4 w-px bg-white/10 hidden md:block" />
                <nav className="flex items-center gap-6 text-[13px] font-medium text-violet-200/70">
                  <a
                    href="/creator-monetization"
                    className="hover:text-white transition-colors"
                  >
                    Creator Monetization
                  </a>
                  <a
                    href="/support"
                    className="hover:text-white transition-colors"
                  >
                    Support
                  </a>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </a>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </nav>
              </div>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com/tippified_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 grid place-items-center rounded-full bg-white/[0.07] border border-white/8 backdrop-blur-md hover:bg-white/12 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-300 text-white"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://facebook.com/tippified"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 grid place-items-center rounded-full bg-white/[0.07] border border-white/8 backdrop-blur-md hover:bg-white/12 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-300 text-white"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://x.com/tippified"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 grid place-items-center rounded-full bg-white/[0.07] border border-white/8 backdrop-blur-md hover:bg-white/12 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-300 text-white"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
            <div className="pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
              <div className="text-[13px] text-violet-200/50">
                &copy; {new Date().getFullYear()} Tippified. All rights
                reserved.
              </div>
              <p className="text-[11px] text-violet-200/40 max-w-md leading-relaxed">
                Tippified is a product of Grundex Limited. Payments securely
                powered our Payment Partner.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
