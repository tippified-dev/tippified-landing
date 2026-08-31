"use client";
import { FiGift, FiHeart, FiVideo } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#15052E] text-white">
      {/* Premium background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#15052E] via-[#1e0a42] to-[#4C1D95]" />
      <div className="absolute -top-32 -left-32 w-150 h-150 rounded-full bg-[#4C1D95]/30 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-150 h-150 rounded-full bg-[#7C3AED]/20 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size[24px_24px] opacity-30" />

      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="inline-flex mx-auto mb-8 items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur text-[11px] font-bold tracking-widest uppercase text-purple-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live creator economy
        </div>

        <h1 className="text-5xl md:text-[68px] font-extrabold text-center leading-[0.95] tracking-tight">
          <span className="bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent">
            Creator Monetization
          </span>
          <br />
          <span className="bg-linear-to-b from-white to-purple-200/60 bg-clip-text text-transparent">
            Made Simple
          </span>
        </h1>

        <p className="max-w-3xl mx-auto mt-8 text-center text-[17px] leading-8 text-purple-100/70">
          Tippified is a creator monetization platform that empowers creators,
          influencers, artists, musicians, streamers and public figures to
          receive support directly from the people who love their work.
        </p>

        <p className="max-w-2xl mx-auto mt-4 text-center text-[14px] leading-7 text-purple-200/50">
          Fans can send tips, purchase virtual gifts, contribute towards goals,
          fulfil wishlists, celebrate birthdays, and interact during live
          sessions — all from a single platform.
        </p>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {[
            {
              icon: FiHeart,
              title: "Support Creators",
              desc: "Send monetary tips and help creators continue producing amazing content.",
            },
            {
              icon: FiGift,
              title: "Send Virtual Gifts",
              desc: "Purchase beautiful digital gifts and instantly send them to your favourite creators.",
            },
            {
              icon: FiVideo,
              title: "Join Live Streams",
              desc: "Watch creators live while sending tips and virtual gifts in real-time.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group relative rounded-[20px] p-px bg-linear-to-b from-white/20 to-white/5"
            >
              <div className="rounded-[19px] bg-linear-to-b from-white/8 to-white/2 backdrop-blur-xl p-6 h-full border border-white/5 group-hover:from-white/12 group-hover:to-white/4 transition">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-white/15 to-white/5 border border-white/10 grid place-items-center mb-4">
                  <card.icon className="text-white" size={18} />
                </div>
                <h3 className="text-[16px] font-bold mb-2 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-[13.5px] leading-6 text-purple-100/60">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
