import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.tippified.com";
const PAGE_URL = `${SITE_URL}/blog/about`;
export const metadata: Metadata = {
  title: "Tippified Blog | Content Creation, UGC & Digital Creators in Nigeria",
  description:
    "Explore Tippified Blog for insights on Nigerian content creators, content creation, UGC, influencer marketing, digital creatives, brand partnerships and creator monetisation.",
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Tippified",
    title:
      "Tippified Blog | Content Creation, UGC & Digital Creators in Nigeria",
    description:
      "Your guide to content creation, Nigerian creators, UGC, influencer marketing and the creator economy in Nigeria and Africa.",
    locale: "en_NG",
    images: [
      {
        url: `${SITE_URL}/tippified-blog-image.webp`,
        width: 1200,
        height: 630,
        alt: "Tippified ₦50,000 Content Creator Giveaway",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Tippified Blog | Content Creation, UGC & Digital Creators in Nigeria",
    description:
      "Discover Nigerian content creators, UGC, influencer marketing, creative careers and creator monetisation.",
    images: [`${SITE_URL}/tippified-blog-image.webp`],
  },
};

const topics = [
  {
    id: "content-creation",
    number: "01",
    title: "Content Creation",
    description:
      "Explore content ideas, storytelling, production techniques, social media strategy, audience engagement and practical ways to improve your digital content.",
    terms: "Content strategy · Content ideas · Digital publishing",
  },
  {
    id: "nigerian-creators",
    number: "02",
    title: "Nigerian Content Creators",
    description:
      "Discover Nigerian creators working across comedy, lifestyle, food, fashion, fitness, technology, education and entertainment through profiles, interviews and creator spotlights.",
    terms: "Creator profiles · Nigerian influencers · Creator stories",
  },
  {
    id: "ugc",
    number: "03",
    title: "UGC and User-Generated Content",
    description:
      "Learn about UGC creation, creator portfolios, brand briefs, content deliverables, pricing considerations and opportunities to work with brands.",
    terms: "UGC creators · UGC portfolios · UGC brand deals",
  },
  {
    id: "influencer-marketing",
    number: "04",
    title: "Influencer Marketing and Brand Deals",
    description:
      "Understand sponsored content, influencer campaigns, brand partnerships, creator negotiations and the relationship between digital creators and businesses.",
    terms: "Influencer marketing · Sponsorships · Brand partnerships",
  },
  {
    id: "monetisation",
    number: "05",
    title: "Creator Earnings and Monetisation",
    description:
      "Explore creator income, sponsored posts, platform monetisation, digital products, fan support and the business decisions involved in building a sustainable creative career.",
    terms: "Creator earnings · Monetisation · Pricing",
  },
  {
    id: "creative-careers",
    number: "06",
    title: "Digital Creatives and Creative Careers",
    description:
      "Discover opportunities for videographers, photographers, editors, designers, writers, filmmakers, podcasters and other digital creative professionals.",
    terms: "Digital creatives · Creative careers · Creative industry",
  },
];

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${PAGE_URL}#aboutpage`,
  url: PAGE_URL,
  name: "About Tippified Blog",
  description:
    "An introduction to Tippified Blog, a Nigerian digital publication covering content creation, Nigerian content creators, UGC, influencer marketing, digital creatives and the creator economy.",
  inLanguage: "en-NG",
  isPartOf: {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Tippified",
    url: SITE_URL,
  },
  about: [
    { "@type": "Thing", name: "Content creation" },
    { "@type": "Thing", name: "Digital creators" },
    {
      "@type": "Thing",
      name: "User-generated content",
      alternateName: "UGC",
    },
    { "@type": "Thing", name: "Influencer marketing" },
    { "@type": "Thing", name: "Creator economy" },
  ],
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Tippified",
    url: SITE_URL,
  },
};

export default function TippifiedBlogAboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema).replace(/</g, "\\u003c"),
        }}
      />

      <main className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-purple-100 bg-[#faf8ff]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-700">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                About Tippified Blog
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-7xl">
                Everything about{" "}
                <span className="text-purple-700">content and creators.</span>
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
                Tippified Blog is a Nigerian digital publication covering
                content creation, digital creators, user-generated content
                (UGC), influencer marketing, creative careers and the business
                of making content.
              </p>

              <p className="mt-4 max-w-3xl leading-8 text-gray-600">
                From discovering Nigerian content creators to understanding
                brand partnerships and creator monetisation, we explore the
                people, ideas and opportunities shaping the creator economy in
                Nigeria and across Africa.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center rounded-xl bg-purple-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-purple-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200"
                >
                  Explore the blog <span className="ml-2">→</span>
                </Link>

                <a
                  href="#our-coverage"
                  className="inline-flex items-center justify-center rounded-xl border border-purple-200 bg-white px-6 py-3.5 text-sm font-bold text-purple-800 transition hover:bg-purple-50"
                >
                  Discover our coverage
                </a>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Nigerian perspectives. African creativity. The global creator
                economy.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-700">
              Our mission
            </p>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              A publication dedicated to the world of content.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-gray-600">
            <p>
              Content creation has grown beyond posting pictures and videos on
              social media. It includes entertainment, education, storytelling,
              digital publishing, product reviews, branded content and many
              other forms of creative work.
            </p>

            <p>
              Creators need reliable information about developing their skills,
              building audiences, working with brands, understanding industry
              opportunities and earning from their work.
            </p>

            <p>
              Tippified Blog brings these subjects together, with particular
              attention to the Nigerian market and the wider African creative
              landscape.
            </p>

            <p className="font-semibold text-gray-900">
              Our focus is the content people create, the people behind it and
              the opportunities shaping their work.
            </p>
          </div>
        </section>

        {/* Coverage */}
        <section
          id="our-coverage"
          className="scroll-mt-8 border-y border-gray-100 bg-gray-50/70"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-700">
                What we cover
              </p>

              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Your guide to content creation and the creator economy.
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Our coverage spans the creative process, the people producing
                digital content and the commercial opportunities surrounding the
                industry.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <a
                  key={topic.id}
                  href={`#${topic.id}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-900/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-100"
                >
                  <span className="text-sm font-extrabold text-purple-700">
                    {topic.number}
                  </span>

                  <h3 className="mt-6 text-xl font-bold leading-snug text-gray-950 group-hover:text-purple-800">
                    {topic.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {topic.description}
                  </p>

                  <p className="mt-5 border-t border-gray-100 pt-4 text-xs leading-6 text-purple-700">
                    {topic.terms}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed coverage sections */}
        <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="space-y-12">
            <section id="content-creation" className="scroll-mt-8">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Content Creation
              </h2>
              <p className="mt-4 leading-8 text-gray-600">
                Explore content ideas, production techniques, storytelling,
                publishing strategies and audience engagement. Our content
                creation coverage looks at both the creative skills and
                practical decisions involved in producing useful, entertaining
                and engaging digital content.
              </p>
            </section>

            <section id="nigerian-creators" className="scroll-mt-8">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Nigerian Content Creators
              </h2>
              <p className="mt-4 leading-8 text-gray-600">
                Discover Nigerian content creators working across comedy,
                lifestyle, food, fashion, fitness, technology, education and
                entertainment. Through profiles, interviews and creator
                spotlights, Tippified Blog explores their work, creative
                approaches and professional journeys.
              </p>
            </section>

            <section id="ugc" className="scroll-mt-8">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                UGC and User-Generated Content
              </h2>
              <p className="mt-4 leading-8 text-gray-600">
                User-generated content, commonly called UGC, creates
                opportunities for people who can produce compelling content for
                brands. We explore UGC portfolios, product videos, brand briefs,
                deliverables, pricing considerations and the differences between
                UGC creation and influencer marketing.
              </p>
            </section>

            <section id="influencer-marketing" className="scroll-mt-8">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Influencer Marketing and Brand Partnerships
              </h2>
              <p className="mt-4 leading-8 text-gray-600">
                Our influencer marketing coverage examines sponsored content,
                creator-brand relationships, campaign deliverables, negotiations
                and commercial opportunities. We pay particular attention to the
                realities of working with brands in Nigeria.
              </p>
            </section>

            <section id="monetisation" className="scroll-mt-8">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Creator Earnings and Monetisation
              </h2>
              <p className="mt-4 leading-8 text-gray-600">
                Building an audience does not automatically produce income.
                Creators may earn through brand deals, sponsored content,
                platform monetisation, digital products, services and fan
                support. We explore these revenue models and the factors that
                creators should consider when pricing their work. Specific rates
                and earnings should be attributed to their sources and
                interpreted in context.
              </p>
            </section>

            <section id="creative-careers" className="scroll-mt-8">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Digital Creatives and Creative Careers
              </h2>
              <p className="mt-4 leading-8 text-gray-600">
                The digital creative industry includes videographers,
                photographers, editors, designers, writers, filmmakers,
                podcasters and other professionals. We cover relevant skills,
                tools, career paths and business opportunities for people
                building careers around digital content.
              </p>
            </section>
          </div>
        </section>

        {/* Nigerian focus */}
        <section className="border-y border-purple-100 bg-[#faf8ff]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-700">
                Our perspective
              </p>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Understanding content creation in Nigeria.
              </h2>

              <div className="mt-6 space-y-5 leading-8 text-gray-600">
                <p>
                  The opportunities and challenges facing creators are shaped by
                  the markets in which they work. Audience behaviour, brand
                  budgets, platform access and commercial expectations can
                  differ between countries.
                </p>

                <p>
                  Nigerian creators need information that reflects their
                  experiences, from pricing sponsored content and finding brand
                  partnerships to understanding local audiences and building
                  sustainable creative businesses.
                </p>

                <p>
                  Tippified Blog places these subjects at the centre of its
                  coverage while exploring developments and opportunities across
                  Africa.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-white p-7 sm:p-9">
              <h2 className="text-2xl font-black">
                Who is Tippified Blog for?
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Our coverage is designed for people creating, commissioning,
                studying or working with digital content.
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  "Aspiring content creators",
                  "Established digital creators",
                  "UGC creators",
                  "Social media influencers",
                  "Creative professionals",
                  "Brands and marketing teams",
                  "Digital entrepreneurs",
                  "Readers interested in the creator economy",
                ].map((audience) => (
                  <li key={audience} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-black text-purple-800"
                    >
                      ✓
                    </span>
                    <span className="text-sm leading-6 text-gray-700">
                      {audience}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Editorial approach */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-700">
              Our editorial approach
            </p>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Useful information. Relevant stories. Industry context.
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Tippified Blog aims to publish practical guides, creator profiles,
              interviews, educational articles and industry analysis. We seek to
              distinguish verified information from opinion, attribute specific
              claims to their sources and provide context when discussing
              earnings, pricing, statistics or commercial opportunities.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="border-t-2 border-purple-600 pt-5">
              <h3 className="font-bold">Practical guidance</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Information about content production, audience development,
                brand partnerships and creative work.
              </p>
            </div>

            <div className="border-t-2 border-purple-600 pt-5">
              <h3 className="font-bold">Creator perspectives</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Coverage of creators, their work, professional experiences and
                the industry in which they operate.
              </p>
            </div>

            <div className="border-t-2 border-purple-600 pt-5">
              <h3 className="font-bold">Responsible reporting</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Context and attribution for earnings, pricing, statistics and
                industry claims.
              </p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-purple-800">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-16 sm:px-8 sm:py-20 md:flex-row md:items-center lg:px-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">
                Explore Tippified Blog
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Discover the people and ideas shaping content creation.
              </h2>

              <p className="mt-5 leading-8 text-purple-100">
                Explore articles about Nigerian creators, UGC, influencer
                marketing, creative careers and the business of digital content.
              </p>
            </div>

            <Link
              href="/blog"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-purple-800 transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
            >
              Read the blog <span className="ml-2">→</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
