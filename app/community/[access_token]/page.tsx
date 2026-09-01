import { Metadata } from "next";
import CommunityClient from "./CommunityClient";

interface Community {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: "NGN" | "GHS" | "KES";
  creator_username: string;
  is_active: boolean;
}

interface CommunityResponse {
  success: boolean;
  community?: Community;
  message?: string;
}

interface CommunityPageProps {
  params: Promise<{
    access_token: string;
  }>;
}

async function getCommunity(accessToken: string): Promise<Community | null> {
  try {
    const res = await fetch(
      `https://api.tippified.com/api/auth/community/${accessToken}/`,
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (!res.ok) {
      return null;
    }

    const data: CommunityResponse = await res.json();

    if (!data.success || !data.community) {
      return null;
    }

    return data.community;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: CommunityPageProps): Promise<Metadata> {
  const { access_token } = await params;

  const community = await getCommunity(access_token);

  if (!community) {
    return {
      title: "Community Not Found | Tippified",
      description:
        "This Tippified paid community could not be found or is no longer available.",
    };
  }

  const title = `${community.name} | Tippified`;

  const description =
    community.description ||
    `Join ${community.name} by ${community.creator_username} on Tippified.`;

  return {
    title,
    description,

    keywords: [
      "Tippified",
      "Tippified community",
      "paid WhatsApp community",
      community.name,
      community.creator_username,
    ],

    openGraph: {
      title,
      description,
      url: `https://tippified.com/community/${access_token}`,
      siteName: "Tippified",
      type: "website",
    },

    twitter: {
      card: "summary",
      title,
      description,
    },

    alternates: {
      canonical: `https://tippified.com/community/${access_token}`,
    },
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { access_token } = await params;

  const community = await getCommunity(access_token);

  return (
    <main className="min-h-screen bg-[#fcfbff]">
      <CommunityClient accessToken={access_token} community={community} />
    </main>
  );
}
