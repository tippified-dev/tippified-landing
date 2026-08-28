import { Metadata } from "next";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Discover Nigerian Creators | Tippified",
  description:
    "Discover talented Nigerian creators on Tippified. Explore creators across entertainment, comedy, music, fashion, lifestyle and more. Send tips, gifts and support the creators you love.",
  keywords: [
    "Tippified",
    "Tippified Explore",
    "Tippified creators",
    "Nigerian creators",
    "Nigerian content creators",
    "discover Nigerian creators",
    "support Nigerian creators",
    "creator platform Nigeria",
    "creators on tippified",
  ],
  alternates: {
    canonical: "https://tippified.com/explore",
  },
  openGraph: {
    title: "Discover Nigerian Creators | Tippified",
    description:
      "Discover talented Nigerian creators on Tippified. Explore creators, send tips and gifts, and support the creators you love.",
    url: "https://tippified.com/explore",
    siteName: "Tippified",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Nigerian Creators | Tippified",
    description:
      "Discover talented Nigerian creators on Tippified. Explore creators, send tips and gifts, and support the creators you love.",
  },
};

async function getInitialCreators() {
  try {
    const res = await fetch(
      "https://api.tippified.com/api/auth/creators/explore/?page=1",
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (!res.ok) {
      return {
        results: [],
        next: null,
      };
    }

    return await res.json();
  } catch {
    return {
      results: [],
      next: null,
    };
  }
}

export default async function ExplorePage() {
  const initialData = await getInitialCreators();

  return (
    <main className="min-h-screen bg-[#fcfbff]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* SEO / Page Introduction */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm mb-5">
            <span
              className="h-2 w-2 rounded-full bg-green-500 animate-pulse"
              aria-hidden="true"
            />

            <span className="text-[11px] font-bold tracking-widest uppercase text-purple-600">
              Creators on Tippified
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-purple-900">
            Discover Nigerian Creators on Tippified
          </h1>

          <p className="text-[15px] leading-7 text-gray-600 mt-5 max-w-3xl mx-auto">
            Discover talented Nigerian creators across entertainment, comedy,
            music, fashion, lifestyle, education and more. Explore creators you
            love, send tips and gifts, and support the people whose content you
            enjoy.
          </p>
        </header>

        {/* Creator discovery section */}
        <section aria-labelledby="explore-creators-heading">
          <ExploreClient initialData={initialData} />
        </section>
      </div>
    </main>
  );
}
