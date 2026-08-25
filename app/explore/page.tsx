import { Metadata } from "next";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore Creators on Tippified | Support Top Nigerian Creators",
  description:
    "Discover verified creators on Tippified. Tip, send gifts, watch exclusive paid videos and support your favourite creators in Nigeria and Ghana.",
  keywords: [
    "tippified explore",
    "tippified creators",
    "nigeria creators",
    "support creators",
    "tippified",
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
