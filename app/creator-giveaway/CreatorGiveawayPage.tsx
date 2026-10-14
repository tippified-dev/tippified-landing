"use client";

import { motion } from "framer-motion";
import {
  FiArrowDown,
  FiArrowRight,
  FiCheckCircle,
  FiGift,
  FiHeart,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import NavBar from "../components/NavBar";

const SIGNUP_URL = "/signup";

const participationSteps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up on Tippified to create your creator account and get started.",
  },
  {
    number: "02",
    title: "Set up your creator profile",
    description:
      "Introduce yourself, showcase what you create, and prepare your profile for supporters.",
  },
  {
    number: "03",
    title: "Read the giveaway terms",
    description:
      "Review the official eligibility requirements, entry process, closing date, and winner-selection rules.",
  },
];

const benefits = [
  {
    icon: FiHeart,
    title: "Receive support from fans",
    description:
      "Give your audience another way to appreciate your work through tips and gifts.",
  },
  {
    icon: FiTrendingUp,
    title: "Build your creator presence",
    description:
      "Create a dedicated creator page you can share with your community.",
  },
  {
    icon: FiUsers,
    title: "Bring your audience closer",
    description:
      "Make it easier for the people who enjoy your content to support your creative journey.",
  },
];

const faqs = [
  {
    question: "What is the Tippified ₦50,000 creator giveaway?",
    answer:
      "It is a promotional giveaway offering a ₦50,000 prize to one eligible content creator, subject to the official giveaway terms and conditions.",
  },
  {
    question: "Who can participate?",
    answer:
      "Content creators interested in joining Tippified may participate if they meet the eligibility requirements specified in the official giveaway terms.",
  },
  {
    question: "Does signing up guarantee that I will win ₦50,000?",
    answer:
      "No. Signing up does not guarantee that you will receive the prize. The winner will be determined according to the selection process stated in the official giveaway terms.",
  },
  {
    question: "How will the winner be selected?",
    answer:
      "The winner will be selected using the process published in the official giveaway terms. Please review those terms before participating.",
  },
  {
    question: "Do I have to pay to enter the giveaway?",
    answer:
      "Review the official giveaway terms for the entry requirements. Do not make any payment to an individual claiming to guarantee you the prize.",
  },
];

export default function CreatorGiveawayPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen overflow-hidden bg-white text-[#251039]">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-[#1D0A32] text-white">
          {/* Background effects */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_10%,rgba(147,51,234,0.30),transparent_42%),radial-gradient(ellipse_at_85%_65%,rgba(192,38,211,0.19),transparent_38%)]"
          />

          <div
            aria-hidden="true"
            className="absolute -right-32 top-10 -z-10 h-96 w-96 rounded-full border border-white/[0.07] sm:h-136 sm:w-136"
          />

          <div
            aria-hidden="true"
            className="absolute -right-16 top-28 -z-10 h-64 w-64 rounded-full border border-white/0.08 sm:h-96 sm:w-96"
          />

          <div className="mx-auto grid min-h-170 max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-24">
            {/* Hero copy */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/20 bg-white/6 px-4 py-2 backdrop-blur-xl">
                <FiGift className="text-purple-300" size={15} />
                <span className="text-[10px] font-bold uppercase tracking-[0.19em] text-purple-100 sm:text-xs">
                  Tippified Creator Giveaway
                </span>
              </div>

              <p className="mt-9 text-sm font-medium text-purple-200 sm:text-base">
                To the creators building something special.
              </p>

              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">
                Your creativity
                <br />
                deserves a
                <br />
                <span className="bg-linearto-r from-purple-300 via-fuchsia-200 to-white bg-clip-text text-transparent">
                  ₦50,000 boost.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-purple-100/75 sm:text-base sm:leading-8">
                We are giving away ₦50,000 to each content creators who sign up
                on tippified. Sign up on Tippified, discover another way to earn
                from your audience, and take part in our creator giveaway.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={SIGNUP_URL}
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-sm font-extrabold text-purple-950 shadow-[0_12px_35px_-12px_rgba(216,180,254,0.45)] transition duration-300 hover:-translate-y-1 hover:bg-purple-50"
                >
                  Sign Up on Tippified
                  <FiArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>

                <a
                  href="#how-to-enter"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-4 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/6"
                >
                  How to participate
                  <FiArrowDown size={15} />
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-purple-200/70 sm:text-xs">
                <span className="inline-flex items-center gap-2">
                  <FiCheckCircle className="text-purple-300" />
                  One ₦50,000 prize
                </span>

                <span className="inline-flex items-center gap-2">
                  <FiShield className="text-purple-300" />
                  Terms and conditions apply
                </span>
              </div>
            </motion.div>

            {/* Prize artwork */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-122.5"
            >
              {/* Glow */}
              <div
                aria-hidden="true"
                className="absolute inset-10 rounded-full bg-purple-600/30 blur-[85px]"
              />

              <div className="relative overflow-hidden rounded-4xl border border-white/15 bg-linear-to-br from-white/13 via-white/5.5 to-white/2.5 p-5 shadow-[0_35px_100px_-30px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:rounded-[2.5rem] sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-purple-200">
                      The creator prize
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white/80">
                      One creator. One opportunity.
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-purple-200">
                    <FiGift size={23} />
                  </div>
                </div>

                {/* Main prize */}
                <div className="relative py-12 text-center sm:py-16">
                  <div
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/15 sm:h-60 sm:w-60"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-3xl"
                  />

                  <FiStar
                    aria-hidden="true"
                    className="absolute left-[14%] top-[18%] text-purple-200/70"
                    size={19}
                  />

                  <FiStar
                    aria-hidden="true"
                    className="absolute right-[15%] top-[25%] text-fuchsia-200/80"
                    size={14}
                  />

                  <FiStar
                    aria-hidden="true"
                    className="absolute bottom-[18%] right-[22%] text-purple-200/70"
                    size={18}
                  />

                  <p className="relative text-2xl font-bold tracking-tight text-white/80 sm:text-3xl">
                    ₦
                  </p>

                  <p className="relative mt-1 text-[4.2rem] font-black leading-none tracking-[-0.08em] text-white sm:text-[6.5rem]">
                    50,000
                  </p>

                  <div className="relative mx-auto mt-5 h-px w-24 bg-linear-to-r from-transparent via-purple-200 to-transparent" />

                  <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.2em] text-purple-200 sm:text-sm">
                    Content Creator Giveaway
                  </p>
                </div>

                {/* Card footer */}
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-400/15 text-purple-200">
                      <FiZap size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">
                        Your next chapter starts here.
                      </p>
                      <p className="mt-1 text-xs leading-5 text-purple-100/65">
                        Join Tippified and explore creator monetization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-[10px] text-purple-200/55">
                Participation and prize award are subject to the official terms.
              </p>
            </motion.div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="bg-white px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-purple-600 sm:text-xs">
                More than a giveaway
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] text-[#251039] sm:text-4xl">
                Built for the people who create.
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-8 text-gray-600 sm:text-base">
              <p>
                Creating content takes time, effort, imagination, and
                consistency. Whether you make comedy skits, lifestyle videos,
                fashion content, fitness videos, food content, or educational
                videos, your work deserves an audience that can support it.
              </p>

              <p>
                Tippified is a creator monetization platform designed to help
                creators receive tips, gifts, and financial support from their
                fans. You can build a creator page and share it with your
                community to make supporting your work easier.
              </p>

              <p>
                Our ₦50,000 creator giveaway is an opportunity to introduce more
                Nigerian content creators to Tippified and the possibilities of
                audience-powered support.
              </p>

              <a
                href={SIGNUP_URL}
                className="group inline-flex items-center gap-2 border-b-2 border-purple-200 pb-1 font-bold text-purple-700 transition hover:border-purple-600 hover:text-purple-900"
              >
                Create your creator account
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>

        {/* CREATOR BENEFITS */}
        <section className="border-y border-purple-100/70 bg-[#FBF9FF] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-purple-600 sm:text-xs">
                Your creator journey
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-[#251039] sm:text-4xl">
                More ways to connect with your audience.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
                The giveaway is an introduction to a platform built around
                creators and the people who appreciate their work.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <motion.article
                    key={benefit.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    className="group rounded-[1.75rem] border border-purple-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-[0_20px_45px_-30px_rgba(88,28,135,0.35)] sm:p-8"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-100 to-fuchsia-50 text-purple-700 transition duration-300 group-hover:scale-105">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-6 text-lg font-extrabold tracking-tight text-[#29133D]">
                      {benefit.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      {benefit.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW TO ENTER */}
        <section
          id="how-to-enter"
          className="scroll-mt-20 bg-white px-5 py-20 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-purple-600 sm:text-xs">
                Start here
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-[#251039] sm:text-4xl">
                How to participate in the ₦50,000 giveaway.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
                Follow the published entry requirements to make sure your
                participation is valid.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {participationSteps.map((step, index) => (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="relative rounded-[1.75rem] border border-purple-100 bg-[#FCFAFF] p-6 sm:p-8"
                >
                  <span className="text-4xl font-black tracking-[-0.06em] text-purple-200 sm:text-5xl">
                    {step.number}
                  </span>

                  <h3 className="mt-6 text-lg font-extrabold text-[#29133D]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {step.description}
                  </p>
                </motion.article>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50/60 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <FiShield
                  size={20}
                  className="mt-0.5 shrink-0 text-purple-700"
                />

                <div>
                  <h3 className="text-sm font-extrabold text-[#29133D]">
                    Please read before entering
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-gray-600 sm:text-sm">
                    Creating an account does not automatically guarantee a
                    prize. Review the official terms for eligibility, the entry
                    requirements, the closing date, and how the winner will be
                    selected.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href={SIGNUP_URL}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-purple-800 to-purple-600 px-8 py-4 text-sm font-extrabold text-white shadow-lg shadow-purple-900/15 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Sign Up on Tippified
                <FiArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#FBF9FF] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-purple-600 sm:text-xs">
                Need clarification?
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-[#251039] sm:text-4xl">
                Frequently asked questions.
              </h2>
            </div>

            <div className="mt-10 space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-purple-100 bg-white transition-colors open:border-purple-200"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-bold leading-6 text-[#29133D] marker:hidden sm:p-6">
                    {faq.question}

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-700 transition-transform duration-200 group-open:rotate-45">
                      <span className="text-xl font-normal leading-none">
                        +
                      </span>
                    </span>
                  </summary>

                  <div className="px-5 pb-5 text-sm leading-7 text-gray-500 sm:px-6 sm:pb-6">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* TERMS AND CONDITIONS */}
        <section
          id="terms"
          className="scroll-mt-20 bg-white px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-5xl rounded-4xl border border-purple-100 bg-linear-to-br from-white via-[#FCFAFF] to-purple-50/80 p-6 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <FiShield size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-[#251039] sm:text-2xl">
                  Terms and conditions apply.
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Participation in the Tippified ₦50,000 creator giveaway is
                  subject to the official terms and conditions established for
                  this promotion. These terms should specify the eligibility
                  criteria, entry requirements, promotion period,
                  winner-selection process, prize-award arrangements, and any
                  applicable restrictions.
                </p>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Tippified may verify eligibility and reject entries that do
                  not satisfy the published requirements. Signing up alone does
                  not guarantee winning the prize.
                </p>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Do not pay anyone who claims they can guarantee you will win.
                  Follow only official Tippified communications about the
                  promotion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative isolate overflow-hidden bg-[#1D0A32] px-5 py-20 text-white sm:px-8 sm:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_120%,rgba(147,51,234,0.35),transparent_60%)]"
          />

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-purple-300 sm:text-xs">
              Your next chapter
            </p>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
              Create. Connect.
              <span className="block text-purple-300">
                Let your audience support you.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-purple-100/70 sm:text-base">
              Join Tippified, create your creator page, and discover another way
              to receive support from the people who enjoy your work.
            </p>

            <a
              href={SIGNUP_URL}
              className="group mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-purple-950 transition duration-300 hover:-translate-y-1 hover:bg-purple-50"
            >
              Create Your Account
              <FiArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <p className="mt-5 text-[10px] leading-5 text-purple-200/55 sm:text-xs">
              ₦50,000 creator giveaway. Terms and conditions apply.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
