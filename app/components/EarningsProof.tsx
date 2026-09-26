import Image from "next/image";
import { useEffect, useState } from "react";

export default function EarningsProof() {
  const [earnings, setEarnings] = useState(356248);
  const [activeTab, setActiveTab] = useState("NGN");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    const t = setTimeout(() => setEarnings(6655290), 1200);
    return () => clearTimeout(t);
  }, []);

  const displayEarnings = activeTab === "USD" ? 4120 : earnings;

  return (
    <section className="relative w-full min-h-screen overflow-x-clip bg-[#0B0616] text-white selection:bg-[#8B5CF6]/30 py-20 lg:py-28">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *{font-family:"Plus Jakarta Sans",system-ui,sans-serif}
       .serif{font-family:"Instrument Serif",serif}
        @keyframes float1{0%,100%{transform:translateY(0) rotate(-12deg)}50%{transform:translateY(-14px) rotate(-10deg)}}
        @keyframes float2{0%,100%{transform:translateY(0) rotate(8deg)}50%{transform:translateY(-10px) rotate(6deg)}}
        @keyframes floatPhone{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
       .glass-impossible{
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          background: linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%);
          box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.32), inset 0 -1px 0 0 rgba(0,0,0,0.25), 0 20px 60px -20px rgba(139,92,246,0.35), 0 0 0 1px rgba(255,255,255,0.08);
        }
       .glass-impossible::before{
          content:""; position:absolute; inset:0; border-radius:inherit;
          background: linear-gradient(105deg, rgba(255,255,255,0.18) 0%, transparent 40%, transparent 100%);
          pointer-events:none;
        }
       .chromatic{position:relative}
       .chromatic::after{
          content:""; position:absolute; inset:-1px; border-radius:inherit; padding:1px;
          background: conic-gradient(from 180deg at 50% 50%, rgba(139,92,246,0.8), rgba(196,181,253,0.6), rgba(255,255,255,0.4), rgba(139,92,246,0.8));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events:none; opacity:.9;
        }
      `}</style>

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-b from-[#150821] via-[#0B0616] to-[#0B0616]" />
        <div className="absolute top-0 inset-x-0 h-[60%] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(139,92,246,0.25),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-7x1 px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-6 items-center">
          {/* LEFT */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 backdrop-blur-xl px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] tracking-widest uppercase font-semibold text-white/70">
                Live earnings on Tippified
              </span>
              <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                ● Real
              </span>
            </div>

            <h1 className="serif mt-8 text-[38px] lg:text-[64px] leading-[0.95] tracking-[-0.03em]">
              <span className="block text-white">Creators are</span>
              <span className="block text-white/90">already getting</span>
              <span className="block relative">
                <span className="bg-linear-to-r from-[#C4B5FD] via-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent italic">
                  tipped
                </span>
                <span className="absolute -top-2 -right-6 lg:right-10 text-[14px] font-medium tracking-widest text-[#C4B5FD]/60 rotate-14">
                  ✦
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-[44ch] text-[16px] lg:text-[18px] leading-[1.6] text-white/60">
              Real tips, real Naira, settled directly to their bank. No hold, no
              stories. Just creators cashing out.
            </p>

            <div className="mt-8 flex gap-3">
              <a
                href="https://app.tippified.com/creator/signup"
                className="relative group"
              >
                <div className="absolute -inset-1 rounded-full bg-linear-to-r from-[#8B5CF6] to-[#C4B5FD] blur-[10px] opacity-60 group-hover:opacity-90 transition" />
                <div className="relative rounded-full bg-white text-[#150821] px-6 py-3 text-[14px] font-semibold tracking-tight hover:bg-white/90 transition inline-block">
                  Start earning →
                </div>
              </a>
              <button
                onClick={() =>
                  showToast(
                    "How it works: 1. Share link 2. Get tipped 3. Paystack payout instantly",
                  )
                }
                className="rounded-full border border-white/15 bg-white/120 backdrop-blur-xl px-5 py-3 text-[13px] font-medium text-white/80 hover:bg-white/8 transition"
              >
                See how it works
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-0 rounded-[20px] border border-white/8 bg-white/3 backdrop-blur-2xl overflow-hidden max-w-120 w-full">
              {[
                { k: "₦6M+", v: "tracked" },
                { k: "1000+", v: "creators" },
                { k: "Paystack", v: "direct payout" },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`px-5 py-4 ${i !== 2 ? "border-r border-white/6" : ""}`}
                >
                  <div className="text-[18px] font-bold tracking-tight text-white">
                    {s.k}
                  </div>
                  <div className="text-[11px] tracking-wide uppercase text-white/45 font-medium mt-0.5">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - PHONE + PROOFS */}
          <div className="relative lg:h-190 h-170 flex items-center justify-center overflow-visible">
            <div className="absolute top-[8%] right-[12%] w-[320px] h-80 rounded-full bg-[#8B5CF6] blur-[70px] opacity-30" />
            <div className="absolute bottom-[10%] left-[5%] w-70 h-70 rounded-full bg-[#3D1A6B] blur-[80px] opacity-40" />

            {/* earning1.jpeg */}
            <div
              className="absolute left-[0%] lg:left-[2%] top-[2%] lg:top-[6%] z-1 w-47.5 lg:w-70 select-none"
              style={{ animation: "float1 6s ease-in-out infinite" }}
            >
              <div className="relative rounded-[22px] p-px bg-linear-to-b from-white/30 via-[#C4B5FD]/30 to-transparent">
                <div className="relative glass-impossible chromatic rounded-[21px] overflow-hidden">
                  <div className="p-2.5">
                    <div className="rounded-[14px] overflow-hidden bg-black/40 border border-white/10">
                      <Image
                        src="/earning1.jpeg"
                        alt="Earnings ₦356,248"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between px-1 pb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] tracking-wide font-semibold text-white/70 uppercase">
                          Tracked
                        </span>
                      </div>
                      <span className="text-[10px] text-white/40">
                        Direct via Paystack
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* earning2.jpeg */}
            <div
              className="absolute right-[0%] bottom-[4%] lg:bottom-[10%] z-1 w-52.5 lg:w-75 select-none"
              style={{ animation: "float2 7s ease-in-out infinite" }}
            >
              <div className="relative rounded-3x1 p-px bg-linear-to-b from-[#C4B5FD]/50 via-white/20 to-transparent">
                <div className="relative glass-impossible chromatic rounded-[23px] overflow-hidden">
                  <div className="p-2.5">
                    <div className="rounded-[15px] overflow-hidden bg-black/50 border border-white/10">
                      <Image
                        src="/earning2.jpeg"
                        alt="Earnings ₦6,655,290"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-2 px-1 pb-1">
                      <div className="flex items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        <span className="text-[10px] font-medium text-white/80">
                          Verified payout
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30">
                        • bank settled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* iPhone */}
            <div
              className="relative z-10 scale-[0.92] lg:scale-100"
              style={{ animation: "floatPhone 5s ease-in-out infinite" }}
            >
              <div className="absolute -inset-12 rounded-[70px] bg-[#8B5CF6]/25 blur-[48px]" />
              <div className="relative w-77.5 lg:w-85 rounded-[56px] border-12 border-[#101014] bg-[#101014] shadow-[0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_0_0_rgba(255,255,255,0.22),0_40px_80px_-20px_rgba(0,0,0,0.8),0_20px_60px_-30px_rgba(139,92,246,0.6)]">
                <div className="pointer-events-none absolute top-0 inset-x-0 h-[42%] rounded-t-[44px] bg-linear-to-b from-white/18 via-white/4 to-transparent opacity-70" />
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 h-7 w-23 rounded-full bg-black border border-white/8" />
                <div className="relative rounded-[44px] overflow-hidden bg-[#0A0612] h-165 lg:h-175">
                  <div className="absolute inset-0 bg-[#0E0820]" />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="relative px-5 pt-12 pb-4">
                      <div className="absolute inset-0 bg-linear-to-b from-[#2E1065] via-[#2E1065]/80 to-transparent" />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <div className="text-[11px] tracking-widest uppercase text-white/50 font-semibold">
                            Tippified • Creator OS
                          </div>
                          <div className="mt-1 text-[15px] font-semibold text-white leading-tight">
                            Welcome back,
                            <br />
                            Grace Okorocha!
                          </div>
                        </div>
                        <div className="relative h-10 w-10 rounded-full p-[1.5px] bg-linear-to-b from-white/30 to-white/5">
                          <div className="h-full w-full rounded-full bg-linear-to-br from-[#C4B5FD] to-[#8B5CF6] flex items-center justify-center text-[13px] font-bold text-white">
                            G
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-3.5 -mt-1">
                      <div className="relative rounded-[20px] p-px bg-linear-to-b from-white/20 to-white/5">
                        <div className="rounded-[19px] bg-[#18112E]/80 backdrop-blur-2xl border border-white/10 overflow-hidden">
                          <div className="flex items-center justify-between px-4 pt-3.5">
                            <div className="text-[12px] font-semibold tracking-wide text-white/80">
                              Earnings Overview
                            </div>
                            <div className="flex rounded-full bg-black/40 p-0.5 border border-white/10">
                              {["NGN", "USD"].map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setActiveTab(t)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide transition ${activeTab === t ? "bg-white text-black shadow" : "text-white/50 hover:text-white/80"}`}
                                >
                                  {t === "NGN" ? "Naira" : "USD"}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="px-4 pt-3 pb-4">
                            <div className="flex items-baseline gap-2">
                              <div className="text-[32px] font-bold tracking-[-0.03em] text-white leading-none">
                                {activeTab === "NGN"
                                  ? `₦${displayEarnings.toLocaleString()}`
                                  : `$${displayEarnings.toLocaleString()}`}
                              </div>
                              <div className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                +12.4%
                              </div>
                            </div>
                            <div className="mt-3 h-9 flex items-end gap-0.75">
                              {[
                                18, 28, 20, 36, 26, 42, 30, 48, 38, 52, 44, 56,
                              ].map((h, i) => (
                                <div
                                  key={i}
                                  className="flex-1 rounded-full bg-linear-to-t from-[#8B5CF6]/20 to-[#C4B5FD]"
                                  style={{
                                    height: `${h}%`,
                                    opacity: i > 8 ? 1 : 0.5 + i * 0.05,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 px-3.5 flex-1 flex flex-col min-h-0">
                      <div className="flex items-center justify-between">
                        <div className="text-[12px] font-semibold text-white/80">
                          Recent Tips
                        </div>
                        <div className="text-[10px] text-white/40">
                          Live • 3 new
                        </div>
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {[
                          {
                            name: "Adaora",
                            amount: "₦10,000",
                            msg: "Love your content! Keep going 💜",
                            color: "from-[#C4B5FD] to-[#8B5CF6]",
                          },
                          {
                            name: "Chinedu",
                            amount: "₦5,000",
                            msg: "",
                            color: "from-[#FDE68A] to-[#F59E0B]",
                          },
                          {
                            name: "Blessing",
                            amount: "₦15,000",
                            msg: "For the makeup tut! ",
                            color: "from-[#FDA4AF] to-[#EC4899]",
                          },
                        ].map((t, i) => (
                          <div
                            key={i}
                            className="relative rounded-[14px] p-px bg-linear-to-b from-white/15 to-white/3"
                          >
                            <div className="rounded-[13px] bg-white/6 backdrop-blur-xl border border-white/6 px-3 py-2.5 flex gap-2.5 items-start">
                              <div
                                className={`h-8 w-8 rounded-full bg-linear-to-br ${t.color} flex items-center justify-center text-[11px] font-bold text-black shrink-0`}
                              >
                                {t.name[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[12px] font-semibold text-white">
                                    {t.name}
                                  </span>
                                  <span className="text-[11px] text-white/45">
                                    tipped
                                  </span>
                                  <span className="rounded-full bg-white text-black px-2 py-0.5 text-[10px] font-bold">
                                    {t.amount}
                                  </span>
                                </div>
                                {t.msg && (
                                  <div className="mt-1 text-[11px] leading-[1.35] text-white/60">
                                    {t.msg}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto pt-4 pb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] text-white/40">
                          <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                            ⚡
                          </div>
                          Settled instantly
                        </div>
                        <button className="text-[11px] font-medium text-[#C4B5FD]">
                          View all →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-full bg-white text-black px-4 py-2 text-[12px] font-medium shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/20">
            {toast}
          </div>
        </div>
      )}
    </section>
  );
}
