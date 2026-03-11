

import { notFound } from "next/navigation";

interface Goal {
  id: number;
  slug: string;
  title: string;
  target_amount: number;
  current_amount: number;
  current_foreign_usd: number;
  about?: string | null;
  is_active: boolean;
  is_completed: boolean;
  created_at: string;
  completed_at?: string | null;
  creator_name: string;
}

interface GoalPageProps {
  params: { slug: string };
}

export const revalidate = 3600;

export default async function GoalPage({ params }: GoalPageProps) {
  // Fetch current goal
  const res = await fetch(
    `https://api.tippified.com/api/auth/public/goals/${params.slug}/`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) notFound();

  const goal: Goal = await res.json();
  const progress = (goal.current_amount / goal.target_amount) * 100;

  // Fetch 3 other goals for dynamic section
  const otherRes = await fetch(
    "https://api.tippified.com/api/auth/public/goals/",
    { next: { revalidate: 3600 } }
  );
  let otherGoals: Goal[] = [];
  if (otherRes.ok) {
    const data = await otherRes.json();
    const allGoals: Goal[] = data.results || data;
    otherGoals = allGoals
      .filter((g) => g.slug !== params.slug) 
      .slice(0, 3);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Support {goal.creator_name} Goal: {goal.title}
      </h1>

      {/* Intro */}
      <p className="text-lg text-gray-700 mb-6">
        {goal.creator_name} created this goal on <strong>Tippified</strong> to
        raise <strong>₦{goal.target_amount.toLocaleString()}</strong>. Fans,
        supporters, and the community can contribute tips to help this creator
        reach their goal and continue creating valuable content.
      </p>

      {/* Progress */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 h-4 rounded">
          <div
            className="bg-purple-600 h-4 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ₦{goal.current_amount.toLocaleString()} raised of ₦
          {goal.target_amount.toLocaleString()}
        </p>
      </div>

      {/* Goal Description */}
      {goal.about && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">About this goal</h2>
          <p className="text-gray-700 leading-relaxed">{goal.about}</p>
        </section>
      )}

      {/* Platform Explanation for SEO */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Support creators through Tippified</h2>
        <p className="text-gray-700 mb-4">
          Tippified, developed by <strong>Grundex Limited</strong>, is a Nigerian creator tipping platform
          that allows fans and supporters to send financial tips directly to content creators. Instead of
          relying solely on advertising revenue or sponsorships, creators receive direct support from their audience.
        </p>
        <p className="text-gray-700 mb-4">
          Each creator is provided a unique tipping link that can be shared across social platforms for easy tipping.
          Payments are processed securely via <strong>Paystack</strong>, allowing fans to tip in multiple currencies
          from anywhere in the world. Tips are settled into the creator’s <strong>OPay wallet</strong>, where privacy
          and security are handled according to OPay’s policies.
        </p>
        <p className="text-gray-700 mb-4">
          Tippified charges a platform fee from each transaction to maintain and improve the service while creators
          keep the majority of the tips they receive.
        </p>
        <p className="text-gray-700">
          Creators can also set up goals—either personal or public—to raise funds for a specific purpose, making it
          easier than ever to receive financial support from fans.
        </p>
      </section>

      {/* CTA */}
      <div className="bg-gray-50 p-6 rounded-lg border mb-12">
        <h3 className="text-lg font-semibold mb-2">Help {goal.creator_name} reach this goal</h3>
        <p className="text-gray-700 mb-4">
          You can support this goal by sending a tip through Tippified. Every contribution helps the creator move
          closer to achieving their goal.
        </p>
        <a
          href={`/tip/${params.slug}`}
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Send a Tip
        </a>
      </div>

      {/* Explore More Creator Goals */}
      {otherGoals.length > 0 && (
        <section className="mb-12">
          <h3 className="text-xl font-bold mb-6 text-center">Explore More Creator Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherGoals.map((g) => {
              const gProgress = (g.current_amount / g.target_amount) * 100;
              return (
                <a
                  key={g.id}
                  href={`/goals/${g.slug}`}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{g.title}</h4>
                    <p className="text-gray-500 text-sm mb-2">by <span className="font-semibold">{g.creator_name}</span></p>
                    <div className="w-full bg-gray-200 h-2 rounded mb-1">
                      <div
                        className="bg-purple-600 h-2 rounded"
                        style={{ width: `${gProgress}%` }}
                      />
                    </div>
                    <p className="text-gray-600 text-sm">
                      ₦{g.current_amount.toLocaleString()} raised of ₦{g.target_amount.toLocaleString()}
                    </p>
                  </div>
                  <span className="mt-2 inline-block bg-purple-600 text-white px-3 py-1 text-sm rounded hover:bg-purple-700 transition text-center">
                    Support
                  </span>
                </a>
              );
            })}
          </div>

          {/* Link to browse all goals */}
          <div className="mt-6 text-center">
            <a
              href="/search-goals"
              className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
            >
              Browse All Goals
            </a>
          </div>
        </section>
      )}

      {/* Structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: goal.title,
            author: { "@type": "Person", name: goal.creator_name },
            description: goal.about,
            url: `https://tippified.com/goals/${params.slug}`,
          }),
        }}
      />
    </main>
  );
}