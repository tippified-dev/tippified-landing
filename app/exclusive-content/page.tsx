import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "../components/NavBar";

const pageUrl = "https://www.tippified.com/exclusive-content";

export const metadata: Metadata = {
  title:
    "How to Monetize Content in Nigeria | Exclusive Content & Social Media Monetization | Tippified",

  description:
    "Learn how to monetize your content and social media audience in Nigeria. Use Tippified to sell exclusive short videos and images, receive direct fan support and turn your audience into income.",

  keywords: [
    "how to monetize content in Nigeria",
    "monetize content in Nigeria",
    "content monetization Nigeria",
    "how to monetize social media in Nigeria",
    "social media monetization Nigeria",
    "how Nigerian creators monetize social media",
    "how to make money from social media in Nigeria",
    "where to make money from my content",
    "how to monetize my content",
    "how to monetize my social media",
    "audience monetization",
    "monetize my audience",
    "content creator monetization Nigeria",
    "creator monetization Nigeria",
    "exclusive content Nigeria",
    "sell exclusive content Nigeria",
    "paid content Nigeria",
    "paid exclusive content",
    "make money from content",
    "make money from social media",
    "monetize Instagram Nigeria",
    "monetize TikTok Nigeria",
    "monetize YouTube audience Nigeria",
    "monetize Facebook audience Nigeria",
    "earn money from followers",
    "earn money from fans",
    "social media income Nigeria",
    "Tippified exclusive content",
    "Tippified monetization",
  ],

  alternates: {
    canonical: pageUrl,
  },

  openGraph: {
    title: "How to Monetize Content in Nigeria | Exclusive Content | Tippified",
    description:
      "Learn how Nigerian creators can monetize content, social media audiences and exclusive videos or images with Tippified.",
    url: pageUrl,
    siteName: "Tippified",
    type: "article",
    locale: "en_NG",
    images: [
      {
        url: "/exclusive-content-og.jpeg",
        width: 1200,
        height: 630,
        alt: "How to monetize content in Nigeria with Tippified",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "How to Monetize Content in Nigeria | Exclusive Content | Tippified",
    description:
      "Learn how Nigerian creators can monetize content, social media audiences and exclusive content with Tippified.",
    images: ["/exclusive-content-og.jpeg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const faqs = [
  {
    question: "What platform lets me monetize my content in Nigeria?",
    answer:
      "Tippified is a creator monetization platform that allows eligible creators to receive direct support from their audiences and monetize exclusive short videos and images. Creators can set a price for exclusive content and fans can pay to access it.",
  },
  {
    question: "How do I monetize my social media in Nigeria?",
    answer:
      "One approach is to use social platforms such as Instagram, TikTok, YouTube or Facebook to build an audience and then give interested followers a direct way to support or purchase exclusive content. Tippified provides a creator page and monetization tools that can be shared through social media.",
  },
  {
    question: "Can I sell exclusive content on Tippified?",
    answer:
      "Yes. Tippified allows creators to upload exclusive short videos and images, set a price and allow fans to pay to access the content. According to Tippified's current FAQ, exclusive content is available for 24 hours after upload before it expires.",
  },
  {
    question: "What type of content can I monetize?",
    answer:
      "Creators can monetize many types of original content and audience experiences, including exclusive short videos, images, tutorials, behind-the-scenes content, previews, fitness content, beauty content, fashion content, educational material, entertainment and other content that provides value to their audience.",
  },
  {
    question: "Do I need a large social media following to monetize content?",
    answer:
      "A large following is not necessarily required to begin building an audience-monetization strategy. What matters is having people who value your content and are willing to support or purchase what you offer. A smaller, engaged audience can still be valuable.",
  },
  {
    question: "Can I use Tippified with Instagram, TikTok and YouTube?",
    answer:
      "Yes. Tippified provides a shareable creator link that can be placed across social platforms and other online channels. You can build an audience on Instagram, TikTok, YouTube, Facebook, X, WhatsApp or another platform and direct interested followers to your Tippified page.",
  },
  {
    question: "Is Tippified an alternative to YouTube monetization?",
    answer:
      "Tippified and YouTube serve different purposes. YouTube provides content distribution and has its own Partner Program and monetization features. Tippified can be used alongside YouTube as a direct audience-support and exclusive-content monetization layer.",
  },
  {
    question: "How quickly can I start monetizing my social media audience?",
    answer:
      "The time required depends on your account, content, audience and the monetization method you choose. Tippified provides direct creator monetization tools, so creators can use their audience and shareable Tippified page rather than relying exclusively on advertising-based monetization.",
  },
  {
    question: "Can Nigerian creators make money from their followers?",
    answer:
      "Yes. Nigerian creators can build direct audience-monetization strategies around tips, virtual gifts, goals and exclusive content. Tippified is designed to connect creators with fans who want to provide financial support.",
  },
  {
    question: "Can fans outside Nigeria support Nigerian creators?",
    answer:
      "Tippified states that fans outside Nigeria can send tips using international payment support provided by its payment partners, subject to payment method and country availability.",
  },
];

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-3 leading-7 text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
        {number}
      </div>

      <h3 className="text-xl font-bold text-gray-900">{title}</h3>

      <p className="mt-3 leading-7 text-gray-600">{description}</p>
    </div>
  );
}

function ComparisonCell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="font-bold text-gray-900">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-gray-600">{children}</div>
    </div>
  );
}

export default function ExclusiveContentPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.tippified.com/#organization",
        name: "Tippified",
        url: "https://www.tippified.com/",
        description:
          "Tippified is a creator monetization platform operated by Grundex Limited.",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.tippified.com/#website",
        url: "https://www.tippified.com/",
        name: "Tippified",
        publisher: {
          "@id": "https://www.tippified.com/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "How to Monetize Content in Nigeria | Exclusive Content & Social Media Monetization",
        description:
          "A practical guide to content monetization, audience monetization and exclusive-content monetization for Nigerian creators.",
        isPartOf: {
          "@id": "https://www.tippified.com/#website",
        },
        about: {
          "@id": "https://www.tippified.com/#organization",
        },
        inLanguage: "en-NG",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.tippified.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Creator Monetization",
            item: "https://www.tippified.com/creator-monetization",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Exclusive Content",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main className="min-h-screen bg-white text-gray-900">
        {/* HERO */}
        <section className="relative overflow-hidden bg-linear-to-br from-purple-950 via-purple-800 to-purple-600 px-6 py-20 text-white md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                Content Monetization in Nigeria
              </p>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl md:leading-[1.05]">
                How to Monetize Your Content and Social Media in Nigeria
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-purple-50 md:text-xl">
                If you create content on Instagram, TikTok, YouTube, Facebook,
                WhatsApp or another platform, you can turn audience attention
                into direct support and paid content with Tippified.
              </p>

              <p className="mt-5 max-w-3xl text-base leading-7 text-purple-100">
                Tippified gives creators a dedicated page for audience
                monetization, including exclusive short videos and images that
                fans can pay to access.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="rounded-xl bg-white px-7 py-4 text-center font-bold text-purple-800 transition hover:bg-purple-50"
                >
                  Start Monetizing
                </Link>

                <Link
                  href="/creator-monetization"
                  className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-center font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Explore Creator Monetization
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DIRECT ANSWER */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-purple-100 bg-purple-50 p-7 md:p-10">
              <p className="text-sm font-bold uppercase tracking-wider text-purple-700">
                Quick answer
              </p>

              <h2 className="mt-3 text-3xl font-black text-gray-900 md:text-4xl">
                What platform lets me monetize my content in Nigeria?
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-700">
                Tippified is a creator monetization platform that lets eligible
                creators receive direct support from their audiences and
                monetize exclusive content. Creators can upload exclusive short
                videos and images, set a price and allow fans to pay to access
                the content.
              </p>

              <p className="mt-4 text-gray-600 leading-7">
                This means a Nigerian creator does not have to depend on one
                source of income such as advertising, sponsorships or brand
                deals. Your social media account can remain the place where you
                build your audience, while Tippified can provide a direct
                monetization destination for people who want to support your
                work.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT IS CONTENT MONETIZATION */}
        <section className="bg-gray-50 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="font-bold text-purple-700">
                Understanding content monetization
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                What does it mean to monetize your content?
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Content monetization means turning the value you create for an
                audience into income. That income can come from advertising,
                sponsorships, subscriptions, product sales, paid communities,
                tips, gifts, paid content or direct audience support.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                For Nigerian creators, audience monetization can be especially
                useful because the same audience you build on social media can
                also become a source of direct financial support. Instead of
                treating followers only as views or engagement, creators can
                give interested fans ways to contribute financially.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <FeatureCard
                title="Audience monetization"
                description="Turn an engaged audience into direct financial support through tips, gifts, goals and paid content."
              />

              <FeatureCard
                title="Exclusive content"
                description="Give your most interested followers access to short videos and images they can pay to view."
              />

              <FeatureCard
                title="Multiple income paths"
                description="Combine direct fan support with advertising, sponsorships, affiliate income, products or other creator businesses."
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-bold text-purple-700">
                How Tippified exclusive content works
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                A simple way to monetize content from your existing audience
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                You do not need to move your audience away from the platforms
                where they already follow you. Use those platforms to publish,
                grow and engage, then give interested followers a direct route
                to your Tippified page.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <StepCard
                number="1"
                title="Create your audience"
                description="Build an audience through Instagram, TikTok, YouTube, Facebook, WhatsApp, X or other channels where your content reaches people."
              />

              <StepCard
                number="2"
                title="Create something valuable"
                description="Publish content your audience finds useful, entertaining, educational, inspirational or worth following."
              />

              <StepCard
                number="3"
                title="Create exclusive content"
                description="Prepare short videos or images that you want to make available exclusively to fans who choose to pay."
              />

              <StepCard
                number="4"
                title="Set your price"
                description="Set the price for your exclusive content so your audience knows what they are paying to access."
              />

              <StepCard
                number="5"
                title="Share your Tippified link"
                description="Share your creator link through your social profiles, posts, videos, bio, messages, website or other audience channels."
              />

              <StepCard
                number="6"
                title="Fans pay to access"
                description="Interested fans can open your Tippified page and pay through the available payment methods."
              />
            </div>
          </div>
        </section>

        {/* CONTENT TYPES */}
        <section className="bg-purple-950 px-6 py-16 text-white md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="font-bold text-purple-300">
                What can you monetize?
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                What types of exclusive content can Nigerian creators offer?
              </h2>

              <p className="mt-5 leading-8 text-purple-100">
                Exclusive content does not have to belong to one particular
                niche. The key is creating original content that gives your
                audience a reason to pay for additional access.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Exclusive short videos",
                "Exclusive images",
                "Behind-the-scenes content",
                "Early content previews",
                "Beauty content",
                "Fashion content",
                "Fitness content",
                "Educational content",
                "Tutorials",
                "Comedy and entertainment",
                "Music and creative work",
                "Photography",
                "Creator updates",
                "Lifestyle content",
                "Personal projects",
                "Special audience experiences",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/10 p-4 font-medium text-purple-50 backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-purple-400/20 bg-white/10 p-6">
              <p className="leading-7 text-purple-50">
                <strong>Important:</strong> Creators should only upload content
                they own or have the necessary rights and permissions to use.
                Paid access does not remove copyright or other legal
                obligations.
              </p>
            </div>
          </div>
        </section>

        {/* SOCIAL MEDIA MONETIZATION */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="font-bold text-purple-700">
                Social media monetization in Nigeria
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                How do I monetize my social media in Nigeria?
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Social media monetization does not have to mean earning only
                from advertising. A creator can monetize an audience through
                several income streams, including sponsorships, affiliate
                marketing, products, services, subscriptions, fan support and
                exclusive content.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                A practical approach is to use Instagram, TikTok, YouTube,
                Facebook or another social platform to attract and engage an
                audience, then use a dedicated creator monetization platform
                such as Tippified to create another path to income.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <ComparisonCell title="Instagram">
                Use Instagram to publish content, build relationships and grow
                your audience. Your Tippified link can give interested followers
                another way to support you or access paid content.
              </ComparisonCell>

              <ComparisonCell title="TikTok">
                Use TikTok for discovery and audience growth, then direct
                interested followers to your Tippified creator page when you
                have something they can purchase or support.
              </ComparisonCell>

              <ComparisonCell title="YouTube">
                Use YouTube for long-form videos, Shorts and audience building.
                Tippified can complement your YouTube presence with direct
                audience support and exclusive content.
              </ComparisonCell>

              <ComparisonCell title="Facebook">
                Use Facebook to build communities and distribute content while
                giving interested followers another way to support your creator
                business through Tippified.
              </ComparisonCell>
            </div>
          </div>
        </section>

        {/* TIPPIFIED VS SOCIAL PLATFORMS */}
        <section className="bg-gray-50 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="font-bold text-purple-700">
                Different platforms, different roles
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Tippified vs YouTube, Facebook, Instagram and TikTok
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                The question is not necessarily whether you should use Tippified
                or another social platform. For many creators, the two can work
                together. Social platforms can help you reach people, while a
                creator monetization platform can give those people a direct way
                to support your work.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-180 border-collapse text-left">
                  <thead>
                    <tr className="bg-purple-900 text-white">
                      <th className="p-5 font-bold">Platform type</th>
                      <th className="p-5 font-bold">Primary role</th>
                      <th className="p-5 font-bold">
                        How Tippified can complement it
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-5 font-semibold">YouTube</td>
                      <td className="p-5 text-gray-600">
                        Video publishing, discovery and creator monetization
                      </td>
                      <td className="p-5 text-gray-600">
                        Direct fan support and exclusive paid content
                      </td>
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold">Instagram</td>
                      <td className="p-5 text-gray-600">
                        Social discovery, visual content and community
                      </td>
                      <td className="p-5 text-gray-600">
                        A dedicated destination for audience monetization
                      </td>
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold">TikTok</td>
                      <td className="p-5 text-gray-600">
                        Short-form video discovery and audience growth
                      </td>
                      <td className="p-5 text-gray-600">
                        Turn interested viewers into direct supporters
                      </td>
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold">Facebook</td>
                      <td className="p-5 text-gray-600">
                        Content distribution, communities and audience
                        engagement
                      </td>
                      <td className="p-5 text-gray-600">
                        Direct creator support and exclusive content
                      </td>
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold">Tippified</td>
                      <td className="p-5 text-gray-600">
                        Direct creator-to-fan monetization
                      </td>
                      <td className="p-5 text-gray-600">
                        Tips, gifts, goals and exclusive content from one
                        creator page
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* YOUTUBE EXPLANATION */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="font-bold text-purple-700">
              YouTube and direct audience monetization
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Can I monetize my YouTube audience without relying only on YouTube
              ads?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Yes. YouTube can remain your primary video platform while you
              build additional income streams around your audience. YouTube
              itself offers several monetization features through the YouTube
              Partner Program, subject to its eligibility requirements and
              policies.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              YouTube&apos; current documentation lists different eligibility
              requirements for different monetization features, including
              advertising and fan-funding features. Nigeria is included in the
              countries where YouTube&apos; expanded Partner Program is
              available.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Tippified can serve a different role: giving your existing
              audience a direct destination for fan support and exclusive
              content. In other words, you can use YouTube to build attention
              and Tippified to create another monetization path.
            </p>

            <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <p className="font-semibold text-gray-900">Think of it as:</p>

              <p className="mt-3 text-lg font-bold text-purple-800">
                Social platform → audience → Tippified → direct monetization
              </p>
            </div>
          </div>
        </section>

        {/* FASTEST / EASY WAY */}
        <section className="bg-purple-50 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="font-bold text-purple-700">
                Starting your monetization journey
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                What is an easy way to start earning from social media?
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-700">
                There is no universal fastest way to make money from social
                media because results depend on your audience, niche, content,
                consistency, trust and the monetization method you choose.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                For creators who already have an audience, direct fan
                monetization can be one practical route because it focuses on
                people who already know and value their work.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <FeatureCard
                title="Start with what you already create"
                description="You do not necessarily need a completely new business. Identify the content, expertise or experiences your existing audience already values."
              />

              <FeatureCard
                title="Give your audience a clear action"
                description="Instead of simply saying 'support me', explain what fans can support or what additional value they receive."
              />

              <FeatureCard
                title="Make your monetization link visible"
                description="Place your Tippified link where your audience already interacts with you: social bios, posts, videos, messages and websites."
              />
            </div>
          </div>
        </section>

        {/* AUDIENCE MONETIZATION */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="font-bold text-purple-700">Audience monetization</p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Your followers are more than views
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                A creator&apos; audience can have several forms of value. People
                may watch free content, share posts, recommend a creator,
                purchase something, join a community, send a tip or pay for
                exclusive access.
              </p>

              <p className="mt-4 leading-8 text-gray-600">
                Audience monetization is the process of building systems that
                allow those different forms of audience value to become
                sustainable creator income.
              </p>
            </div>

            <div className="mt-12 flex flex-col items-center gap-3 md:flex-row md:justify-center">
              {[
                "Audience",
                "Attention",
                "Trust",
                "Exclusive value",
                "Payment",
                "Creator income",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-700 px-5 py-3 text-center font-bold text-white shadow-sm">
                    {item}
                  </div>

                  {index < 5 && (
                    <span className="hidden text-2xl font-bold text-purple-400 md:block">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO CAN USE IT */}
        <section className="bg-gray-50 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="font-bold text-purple-700">
                Built for different creator niches
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Who can monetize content with Tippified?
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Tippified is designed for creators who have people willing to
                support their work. Your niche does not have to be limited to
                entertainment.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "YouTubers",
                "TikTok creators",
                "Instagram creators",
                "Facebook creators",
                "Musicians",
                "Skit makers",
                "Comedians",
                "Podcasters",
                "Fitness creators",
                "Fashion creators",
                "Beauty creators",
                "Photographers",
                "Writers",
                "Educators",
                "Gamers",
                "Streamers",
                "Artists",
                "Public figures",
                "Lifestyle creators",
                "Digital entrepreneurs",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-gray-200 bg-white p-4 font-semibold text-gray-800"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NIGERIAN CREATOR ECONOMY */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="font-bold text-purple-700">For Nigerian creators</p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              How Nigerian creators can monetize their social media platforms
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Nigerian creators can use a combination of audience-building and
              monetization strategies. Social media can provide discovery and
              community, while direct monetization tools can provide additional
              ways for fans to financially support the creator.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              This can be particularly useful for creators whose audiences
              extend beyond Nigeria. Tippified states that international fans
              can send tips through international payment support from its
              payment partners, subject to card and country availability.
            </p>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                A practical Nigerian creator monetization stack
              </h3>

              <ul className="mt-5 space-y-3 text-gray-600">
                <li>• Instagram or TikTok for discovery.</li>
                <li>• YouTube for long-form video and search discovery.</li>
                <li>• WhatsApp for direct community communication.</li>
                <li>• Tippified for direct fan support and paid content.</li>
                <li>
                  • Sponsorships, brand partnerships or products where
                  appropriate.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* WHY DIRECT MONETIZATION */}
        <section className="bg-purple-950 px-6 py-16 text-white md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="font-bold text-purple-300">
                Why direct audience monetization matters
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Build income around the audience you have already created
              </h2>

              <p className="mt-5 leading-8 text-purple-100">
                Social platforms can change algorithms, recommendation systems,
                eligibility rules and monetization programs. Building a direct
                relationship with your audience gives creators additional ways
                to monetize their work rather than depending on a single income
                source.
              </p>

              <p className="mt-4 leading-8 text-purple-100">
                Tippified is designed around that direct creator-to-fan
                relationship. Creators receive a personal Tippified page and can
                share their link across the places where their audience already
                exists.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
                <h3 className="text-xl font-bold">You build the audience</h3>
                <p className="mt-3 leading-7 text-purple-100">
                  Continue using the social platforms where your audience
                  already discovers and follows you.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
                <h3 className="text-xl font-bold">You create the value</h3>
                <p className="mt-3 leading-7 text-purple-100">
                  Give your audience content, entertainment, information or
                  experiences they find worth supporting.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
                <h3 className="text-xl font-bold">You add monetization</h3>
                <p className="mt-3 leading-7 text-purple-100">
                  Give interested fans another way to support you or access
                  exclusive content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO MONETIZE SPECIFIC PLATFORMS */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="font-bold text-purple-700">
                Platform-specific strategies
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                How to monetize Instagram, TikTok, YouTube and Facebook in
                Nigeria
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                The exact monetization tools available on each social platform
                can differ. A creator can nevertheless use a simple cross-
                platform strategy: build attention where people already spend
                time, then provide a dedicated destination for direct
                monetization.
              </p>
            </div>

            <div className="mt-10 space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold">
                  How to monetize Instagram in Nigeria
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  Build an engaged Instagram audience, publish valuable content
                  and make your Tippified link easy to find in your profile and
                  content. Fans who want to support you can use your creator
                  page for direct monetization.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold">
                  How to monetize TikTok in Nigeria
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  Use TikTok to attract viewers with short-form content and
                  direct interested followers to your Tippified page for direct
                  support or exclusive content.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold">
                  How to monetize YouTube in Nigeria
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  Build your YouTube audience and use YouTube&apos; available
                  monetization features when eligible. You can also use
                  Tippified as an additional direct-support and exclusive-
                  content destination.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold">
                  How to monetize Facebook in Nigeria
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  Grow your Facebook audience, publish content consistently and
                  use your Tippified creator link to give interested followers
                  another route to support your work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERNAL LINK HUB */}
        <section className="bg-gray-50 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="font-bold text-purple-700">Explore Tippified</p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Learn more about creator monetization
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/creator-monetization"
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-300"
              >
                <h3 className="font-bold">Creator Monetization</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Explore the complete creator monetization ecosystem on
                  Tippified.
                </p>
              </Link>

              <Link
                href="/how-it-works"
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-300"
              >
                <h3 className="font-bold">How It Works</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  See how creators and fans use Tippified.
                </p>
              </Link>

              <Link
                href="/faq"
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-300"
              >
                <h3 className="font-bold">Tippified FAQ</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Get answers about payments, creators and monetization.
                </p>
              </Link>

              <Link
                href="/about"
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-300"
              >
                <h3 className="font-bold">About Tippified</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Learn about the platform and its creator-focused mission.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="font-bold text-purple-700">
                Frequently asked questions
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Content monetization FAQs for Nigerian creators
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                Answers to common questions about monetizing content, social
                media audiences and exclusive content in Nigeria.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <summary className="cursor-pointer list-none pr-6 text-lg font-bold text-gray-900">
                    {faq.question}
                  </summary>

                  <p className="mt-4 leading-7 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-linear-to-r from-purple-900 via-purple-700 to-purple-600 px-6 py-20 text-center text-white">
          <div className="mx-auto max-w-4xl">
            <p className="font-bold text-purple-200">
              Turn your audience into direct support
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Ready to monetize your content?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-purple-50">
              Create your Tippified page, share it with your audience and give
              your fans another way to support what you create.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-xl bg-white px-8 py-4 font-bold text-purple-800 transition hover:bg-purple-50"
              >
                Create Your Tippified Page
              </Link>

              <Link
                href="/creator-monetization"
                className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-bold text-white transition hover:bg-white/20"
              >
                Learn About Monetization
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
