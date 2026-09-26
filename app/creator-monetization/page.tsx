import type { Metadata } from "next";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheck,
  FiGift,
  FiHeart,
  FiLink,
  FiRadio,
  FiStar,
  FiTarget,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const SITE_URL = "https://www.tippified.com";

export const metadata: Metadata = {
  title:
    "Creator Monetization in Nigeria & Africa | Tips, Gifts & Fan Support | Tippified",

  description:
    "Tippified is Africa's creator tipping and monetization platform. Learn how Nigerian and African creators can monetize content, receive tips, gifts, goal contributions, wishlist support and live-stream support directly from fans.",

  keywords: [
    "creator monetization",
    "creator monetization Nigeria",
    "creator monetization Africa",
    "content monetization Nigeria",
    "content monetization Africa",
    "monetization for creators",
    "creator support",
    "support creators",
    "tipping platform Nigeria",
    "tipping platform Africa",
    "creator tipping",
    "tipping platform for creators",
    "how to monetize content in Nigeria",
    "how Nigerian creators make money",
    "African creator economy",
    "fan support platform",
    "monetize your audience",
    "monetize social media audience",
    "creator income Nigeria",
    "digital creator monetization",
    "Tippified",
  ],

  alternates: {
    canonical: "/creator-monetization",
  },

  openGraph: {
    type: "website",
    url: `${SITE_URL}/creator-monetization`,
    siteName: "Tippified",
    title: "Creator Monetization in Nigeria & Africa | Tippified",
    description:
      "A complete guide to creator monetization in Nigeria and Africa — tips, gifts, goals, wishlists, live support and direct fan monetization with Tippified.",
    locale: "en_NG",
    images: [
      {
        url: "/creator-monetization-og.jpeg",
        width: 1200,
        height: 630,
        alt: "Tippified - Creator Monetization in Nigeria and Africa",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Creator Monetization in Nigeria & Africa | Tippified",
    description:
      "Discover how creators in Nigeria and Africa can monetize their audiences through tips, gifts, goals, wishlists and live support.",
    images: ["/creator-monetization-og.jpeg"],
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

const creatorTypes = [
  "Content creators",
  "Influencers",
  "YouTubers",
  "Musicians",
  "Podcasters",
  "Comedians",
  "Skit makers",
  "Actors",
  "Dancers",
  "Fitness creators",
  "Fashion creators",
  "Beauty creators",
  "Photographers",
  "Writers",
  "Streamers",
  "Educators",
  "Gamers",
  "Public figures",
];

const faqs = [
  {
    question: "What is creator monetization?",
    answer:
      "Creator monetization is the process of turning an audience, content, community or creative work into income. Depending on the creator, this can include tips, fan support, memberships, digital products, sponsorships, advertising, subscriptions, gifts, paid content and other revenue streams.",
  },
  {
    question: "What is creator monetization in Nigeria?",
    answer:
      "Creator monetization in Nigeria means using digital platforms and payment infrastructure to earn from an audience. Nigerian creators can monetize through direct fan support, tips, gifts, paid content, digital products, memberships, sponsorships, advertising and other creator-business models.",
  },
  {
    question: "How does Tippified help creators monetize their audience?",
    answer:
      "Tippified gives creators a personal page and shareable link through which fans can send monetary tips, virtual gifts and goal contributions. Creators can also use features such as wishlists and live-stream support to create additional ways for their audience to support them.",
  },
  {
    question: "Do fans need a Tippified account to send a tip?",
    answer:
      "No. Fans can open a creator's Tippified link, choose how they want to support the creator and complete the available payment flow without creating a Tippified account.",
  },
  {
    question: "Can creators outside Nigeria use Tippified?",
    answer:
      "Tippified is built around the African creator economy while allowing creators to receive support from fans internationally where supported payment methods and payment-partner availability permit.",
  },
  {
    question: "Does Tippified only support monetary tips?",
    answer:
      "No. Tippified is designed as a broader creator support platform. Depending on the creator's enabled features, fans can send monetary tips, virtual gifts, contribute to goals, fulfil wishlists and support creators during live sessions.",
  },
  {
    question: "How much does Tippified charge creators?",
    answer:
      "Tippified charges a small platform fee. Applicable payment-processing, banking or other transaction-related charges may also depend on the payment method and payment partners involved.",
  },
  {
    question: "Is Tippified a bank or financial institution?",
    answer:
      "No. Tippified is a technology platform for creator monetization and support. Payment processing and settlement are handled through licensed third-party payment providers and banking partners.",
  },
];

export default function CreatorMonetizationPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Tippified",
        url: SITE_URL,
        description:
          "Tippified is a creator monetization and tipping platform helping creators receive direct support from their fans.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Tippified",
        url: SITE_URL,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/creator-monetization#webpage`,
        url: `${SITE_URL}/creator-monetization`,
        name: "Creator Monetization in Nigeria & Africa | Tippified",
        description:
          "A comprehensive guide to creator monetization, content monetization and fan support in Nigeria and Africa.",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/creator-monetization#faq`,
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
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-linear-to-b from-purple-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-700 shadow-sm">
              <FiStar size={14} />
              Creator monetization in Nigeria & Africa
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Turn Your Audience Into{" "}
              <span className="text-purple-700">Creator Support</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Tippified is Africa&apos;s creator tipping and monetization
              platform, built to help creators turn audience appreciation into
              meaningful financial support. Receive tips, gifts, goal
              contributions, wishlist support and live-stream support from the
              people who value what you create.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-purple-800"
              >
                Start Monetizing
                <FiArrowRight size={17} />
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
              >
                See How Tippified Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            What Is Creator Monetization?
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600">
            Creator monetization is how creators turn their audience, content,
            skills and community into income. For some creators, monetization
            comes from advertising or brand partnerships. For others, it comes
            from subscriptions, digital products, paid communities, memberships
            or direct financial support from fans.
          </p>

          <p className="mt-5 text-base leading-8 text-slate-600">
            In Nigeria and across Africa, the creator economy is becoming
            increasingly diverse. A creator does not have to depend on one
            source of income. A YouTuber can have advertising revenue while also
            receiving tips. A musician can sell music while receiving gifts from
            supporters. A fitness creator can build a community while receiving
            direct contributions toward a project.
          </p>

          <p className="mt-5 text-base leading-8 text-slate-600">
            Tippified focuses on one of the most direct forms of creator
            monetization:{" "}
            <strong className="text-slate-900">
              letting fans support creators directly.
            </strong>
          </p>
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-purple-700">
              One platform, multiple revenue opportunities
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              More Ways to Monetize Your Audience
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Creator monetization is not one-size-fits-all. Tippified gives
              creators different ways to let fans support the work they already
              enjoy.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FiHeart size={22} />}
              title="Monetary Tips"
              text="Give your audience a direct way to send financial support whenever they appreciate your content, work or contribution."
            />

            <FeatureCard
              icon={<FiGift size={22} />}
              title="Virtual Gifts"
              text="Let supporters celebrate you with digital gifts designed for appreciation, encouragement and special moments."
            />

            <FeatureCard
              icon={<FiTarget size={22} />}
              title="Creator Goals"
              text="Create goals for projects, equipment, productions, education, business ideas, personal milestones and other causes."
            />

            <FeatureCard
              icon={<FiRadio size={22} />}
              title="Live Support"
              text="Give your audience another way to support you while you stream, perform, interact or create live."
            />

            <FeatureCard
              icon={<FiUsers size={22} />}
              title="Fan Support"
              text="Build a direct support relationship with people who already follow, enjoy and value your work."
            />

            <FeatureCard
              icon={<FiLink size={22} />}
              title="One Shareable Link"
              text="Share your personal Tippified page across Instagram, TikTok, YouTube, WhatsApp, Facebook, X, websites and other channels."
            />
          </div>
        </div>
      </section>

      {/* Nigeria section */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
        <span className="text-sm font-bold uppercase tracking-wider text-purple-700">
          Nigeria
        </span>

        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Creator Monetization in Nigeria Is Changing
        </h2>

        <div className="mt-7 space-y-5 text-base leading-8 text-slate-600">
          <p>
            Nigerian creators have built audiences across Instagram, TikTok,
            YouTube, Facebook, X, WhatsApp and other digital platforms. But
            having an audience and earning from that audience are two different
            things.
          </p>

          <p>
            A creator can have thousands of followers and still struggle to turn
            that attention into predictable support. Advertising can fluctuate.
            Brand deals can be irregular. Algorithms can change. And not every
            creator wants to turn every piece of content into a product.
          </p>

          <p>
            Direct creator support creates another possibility: fans can
            contribute because they genuinely appreciate the creator&apos;s
            work.
          </p>

          <p>
            That is where Tippified fits into the Nigerian creator economy.
            Instead of asking creators to build an entire ecommerce operation
            before they can monetize their audience, Tippified gives them a
            simple creator page and direct support tools.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-purple-100 bg-purple-50 p-6 sm:p-8">
          <h3 className="text-xl font-black text-slate-950">
            Built for the way African creators actually build audiences
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            A creator can discover an audience on one platform, communicate with
            them on another and send supporters to a single Tippified link when
            they want to receive support.
          </p>

          <Link
            href="/how-it-works"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-900"
          >
            Learn how Tippified works
            <FiArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Content monetization */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-wider text-purple-300">
              Content monetization
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Monetize Content Without Making Every Fan Become a Customer
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-300">
              There is an important difference between selling something and
              receiving support. A creator may publish a funny video,
              photograph, song, livestream or useful post that people enjoy
              without wanting to put that content behind a conventional product
              checkout.
            </p>

            <p className="mt-5 text-base leading-8 text-slate-300">
              Tippified gives creators another monetization layer: direct
              audience support. Fans can support the creator because they
              appreciate the work itself.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Post useful content",
              "Build an audience",
              "Share your Tippified link",
              "Let fans choose to support",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-sm font-black text-purple-300">
                  {index + 1}
                </div>

                <p className="font-bold text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator types */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-purple-700">
            For every kind of creator
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Who Can Use Tippified?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            If people follow your work, enjoy your content or believe in what
            you create, Tippified can give them a direct way to support you.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {creatorTypes.map((creator) => (
            <span
              key={creator}
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
            >
              {creator}
            </span>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-purple-700">
              Choosing a creator monetization platform
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Tippified vs Selar, Buy Me a Coffee and Patreon
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Different creator platforms solve different problems. The right
              choice depends on how you want your audience to support you.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-950 text-white">
                    <th className="px-5 py-4 text-sm font-bold">
                      Creator need
                    </th>
                    <th className="px-5 py-4 text-sm font-bold text-purple-300">
                      Tippified
                    </th>
                    <th className="px-5 py-4 text-sm font-bold">Selar</th>
                    <th className="px-5 py-4 text-sm font-bold">
                      Buy Me a Coffee
                    </th>
                    <th className="px-5 py-4 text-sm font-bold">Patreon</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <ComparisonRow
                    feature="Direct fan tips"
                    tippified
                    selar="Not the primary focus"
                    bmc
                    patreon
                  />

                  <ComparisonRow
                    feature="Virtual gifts"
                    tippified
                    selar="Not the primary focus"
                    bmc="Not the primary focus"
                    patreon="Not the primary focus"
                  />

                  <ComparisonRow
                    feature="Creator goals"
                    tippified
                    selar="Not the primary focus"
                    bmc="Not the primary focus"
                    patreon="Not the primary focus"
                  />

                  <ComparisonRow
                    feature="Wishlists"
                    tippified
                    selar="Not the primary focus"
                    bmc="Not the primary focus"
                    patreon="Not the primary focus"
                  />

                  <ComparisonRow
                    feature="Digital products"
                    tippified="Selected creator content"
                    selar
                    bmc
                    patreon
                  />

                  <ComparisonRow
                    feature="Subscriptions / memberships"
                    tippified="Selected monetization features"
                    selar
                    bmc
                    patreon
                  />

                  <ComparisonRow
                    feature="Commerce / selling products"
                    tippified="Support-first"
                    selar
                    bmc
                    patreon
                  />

                  <ComparisonRow
                    feature="Built around direct creator support"
                    tippified
                    selar="Commerce-first"
                    bmc
                    patreon="Membership-first"
                  />

                  <ComparisonRow
                    feature="Strong fit for Nigerian fan tipping"
                    tippified
                    selar="Broader commerce platform"
                    bmc="International support platform"
                    patreon="International membership platform"
                  />
                </tbody>
              </table>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-4xl text-sm leading-6 text-slate-500">
            This comparison describes the primary use cases and publicly
            documented capabilities of each platform. The platforms continue to
            evolve, and feature availability can vary by country, creator
            account and product.
          </p>
        </div>
      </section>

      {/* Why Tippified */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-purple-700">
              Why Tippified
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              A Support-First Approach to Creator Monetization
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Selar is a powerful commerce platform for creators selling digital
              products, services, subscriptions and other products. Buy Me a
              Coffee combines one-time support with memberships, shops and
              publishing. Patreon focuses heavily on memberships and has also
              expanded into one-time digital commerce.
            </p>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Tippified approaches the problem from a different starting point:{" "}
              <strong className="text-slate-900">fan support.</strong>
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Fans can support creators without becoming subscribers.",
              "Creators can receive tips without turning every piece of content into a product.",
              "Goals give audiences a way to contribute toward something specific.",
              "Virtual gifts add another layer of fan interaction.",
              "Wishlists allow supporters to contribute to things creators actually want or need.",
              "Live support connects monetization with real-time creator interaction.",
              "A single personal link can be shared across multiple social platforms.",
              "The platform is designed around African creators and their audiences.",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <FiCheck size={14} strokeWidth={3} />
                </div>

                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform model */}
      <section className="bg-purple-700 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <FiZap className="mx-auto text-purple-200" size={28} />

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              How Tippified&apos;s Platform Model Works
            </h2>

            <p className="mt-5 text-base leading-8 text-purple-100">
              Tippified provides the technology that connects fans with
              creators. Payment transactions are processed through licensed
              payment and banking partners rather than Tippified operating as a
              bank or financial institution.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <ModelCard
              number="01"
              title="Create"
              text="Create your personal Tippified profile and configure the support options available to your audience."
            />

            <ModelCard
              number="02"
              title="Share"
              text="Share your Tippified link on social media, messaging apps, websites, videos and anywhere your audience finds you."
            />

            <ModelCard
              number="03"
              title="Receive Support"
              text="Fans choose how they want to support you through the available tipping, gifting, goal, wishlist and live features."
            />
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-5 text-center text-sm leading-6 text-purple-50">
            Tippified charges a small platform fee. Applicable
            payment-processing and banking charges may also apply depending on
            the transaction and payment partners.
          </div>
        </div>
      </section>

      {/* Trust / company */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
        <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          A Nigerian Platform Built for the African Creator Economy
        </h2>

        <div className="mt-7 space-y-5 text-base leading-8 text-slate-600">
          <p>
            Tippified is a product of Grundex Limited, a Nigerian company. The
            platform is designed to give creators a practical way to receive
            support from their audiences while giving fans simple ways to
            appreciate the people whose work they enjoy.
          </p>

          <p>
            Tippified does not operate as a bank or financial institution.
            Payment processing and settlement are handled through licensed
            third-party payment and banking partners.
          </p>

          <p>
            For more information about the company, platform services and how
            Tippified works, visit our{" "}
            <Link
              href="/about"
              className="font-bold text-purple-700 hover:underline"
            >
              About Tippified
            </Link>{" "}
            page or read our{" "}
            <Link
              href="/how-it-works"
              className="font-bold text-purple-700 hover:underline"
            >
              complete guide to how Tippified works
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Internal linking hub */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:py-20">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              Explore Tippified
            </h2>

            <p className="mt-4 text-slate-600">
              Learn more about creator tipping, monetization and supporting
              creators on Tippified.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InternalLinkCard
              href="/"
              title="Tippified"
              text="Visit the main creator tipping platform."
            />

            <InternalLinkCard
              href="/how-it-works"
              title="How It Works"
              text="Learn how creators and fans use Tippified."
            />

            <InternalLinkCard
              href="/faq"
              title="Tippified FAQ"
              text="Find answers about tips, payments and creator support."
            />

            <InternalLinkCard
              href="/about"
              title="About Tippified"
              text="Learn about the company and platform."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-purple-700">
            Frequently asked questions
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Creator Monetization FAQs
          </h2>
        </div>

        <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="cursor-pointer list-none pr-8 text-base font-bold text-slate-900 marker:hidden">
                {faq.question}
              </summary>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Your Audience Is More Than a Number
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Give the people who enjoy your work a simple way to support what you
            create. Start building a direct relationship between your content
            and your creator income.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-purple-800"
            >
              Get Started With Tippified
              <FiArrowRight size={17} />
            </Link>

            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            >
              Contact Tippified
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function ComparisonRow({
  feature,
  tippified,
  selar,
  bmc,
  patreon,
}: {
  feature: string;
  tippified: boolean | string;
  selar: boolean | string;
  bmc: boolean | string;
  patreon: boolean | string;
}) {
  return (
    <tr>
      <td className="px-5 py-5 text-sm font-bold text-slate-900">{feature}</td>

      <ComparisonCell value={tippified} highlighted />
      <ComparisonCell value={selar} />
      <ComparisonCell value={bmc} />
      <ComparisonCell value={patreon} />
    </tr>
  );
}

function ComparisonCell({
  value,
  highlighted = false,
}: {
  value: boolean | string;
  highlighted?: boolean;
}) {
  return (
    <td
      className={`px-5 py-5 text-sm ${
        highlighted
          ? "bg-purple-50 font-semibold text-purple-900"
          : "text-slate-600"
      }`}
    >
      {value === true ? (
        <span className="inline-flex items-center gap-2 font-bold text-emerald-600">
          <FiCheck size={16} />
          Yes
        </span>
      ) : (
        value
      )}
    </td>
  );
}

function ModelCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
      <span className="text-xs font-black tracking-widest text-purple-200">
        {number}
      </span>

      <h3 className="mt-3 text-xl font-black text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-purple-100">{text}</p>
    </div>
  );
}

function InternalLinkCard({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
    >
      <h3 className="font-black text-slate-900 group-hover:text-purple-700">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-purple-700">
        Explore
        <FiArrowRight size={13} />
      </span>
    </Link>
  );
}
