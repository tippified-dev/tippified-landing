import { Metadata } from "next";

interface Creator {
  username: string;
  referral_code: string;
  current_amount: string;
  about?: string;
}

 
  export async function generateMetadata({
  params,
 }: {
  params: { referral_code: string };
 }): Promise<Metadata> {
  const res = await fetch(
    `https://api.tippified.com/api/auth/public/creators/${params.referral_code}`,
    { cache: "no-store" }
  );
  const creator: Creator = await res.json();

  return {
    title: `${creator.username} | Tippified Creator`,
    description: `Tip ${creator.username} directly on Tippified using their unique link ${creator.referral_code}. Support Nigerian creators securely via OPay and Paystack.`,
    alternates: {
        canonical: `https://www.tippified.com/tip/${creator.referral_code}`,
    }
  };
}

export default async function CreatorTipPage({ params }: { params: { referral_code: string } }) {
  const res = await fetch(
    `https://api.tippified.com/api/auth/public/creators/${params.referral_code}`,
    { cache: "no-store" }
  );

  if (!res.ok) return <p>Creator not found.</p>;

  const creator: Creator = await res.json();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">{creator.username}</h1>
      <p className="text-gray-700 mb-6">Referral Code: @{creator.referral_code}</p>
      <p className="text-purple-700 font-semibold mb-4">₦{creator.current_amount} raised</p>
      <p className="text-gray-600">{creator.about || "Support this creator and help them achieve their goal!"}</p>

      <a
        href={`https://app.tippified.com/tip/${creator.referral_code}`}
        className="mt-6 inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition"
      >
        Tip Now
      </a>
    </main>
  );
}