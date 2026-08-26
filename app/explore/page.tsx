import { Metadata } from "next";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title:
    "Explore Nigerian Creators on Tippified | Support Top Creators | Social Media Creators In Nigeria | Send Real Gifts To Your Favourite Creators | Send Tips To Creators | ",
  description:
    "Discover Nigeria’s most exciting creators on Tippified. Explore exclusive content, tip your favourites, send gifts, and connect with the creators you love.",
  keywords: [
    "tippified explore",
    "tippified creators",
    "nigeria creators",
    "support creators",
    "tippified",
    "creator monetization",
    "content creators in nigeria",
    "facebook creators in nigeria",
    "instagram creators in nigeria",
    "social media creators in migeria",
    "explore tippified",

    "Tippified",
    "creators supports",
    "fans support",
    "tip creators on tippified",
    "search tippified",
    "search creators",
    "search on tippified",
  ],
  openGraph: {
    title: "Explore Creators - Tippified",
    description: "Discover and support verified creators on Tippified",
    url: "https://tippified.com/explore",
    type: "website",
  },
  alternates: {
    canonical: "https://tippified.com/explore",
  },
};

async function getInitialCreators() {
  try {
    const res = await fetch(
      `https://api.tippified.com/api/auth/creators/explore/?page=1`,
      {
        next: { revalidate: 60 },
      },
    );
    return await res.json();
  } catch {
    return { results: [], next: null };
  }
}

export default async function ExplorePage() {
  const initialData = await getInitialCreators();

  return (
    <main className="min-h-screen bg-[#fcfbff]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm mb-4">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-purple-600">
              Live on Tippified
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-purple-900">
            Explore Creators
          </h1>
          <p className="text-[15px] text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover verified creators, support them and watch exclusive
            content.
          </p>
        </div>
        <ExploreClient initialData={initialData} />
      </div>
    </main>
  );
}
