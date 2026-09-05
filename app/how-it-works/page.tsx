import NavBar from "../components/NavBar";

import AdsterraBanner from "../components/AdsterraBanner";
import CreatorTipBanner from "../components/CreatorTipBanner";
import CreatorFeatures from "./CreatorFeatures";
import FanWallet from "./FanWallet";
import Hero from "./Hero";
import HowTipsWork from "./HowTipsWork";
import TippifiedFeatures from "./TippifiedFeatures";
import WhyFansLoveTippified from "./WhyFansLoveTippified";

export default function HowItWorks() {
  return (
    <>
      <NavBar />

      <main className="bg-white">
        <Hero />
        <AdsterraBanner />
        <CreatorTipBanner className="mt-8" />

        <CreatorFeatures />
        <HowTipsWork />
        <FanWallet />
        <TippifiedFeatures />
        <WhyFansLoveTippified />

        {/* Remaining sections */}
      </main>
    </>
  );
}
