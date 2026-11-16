"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiHeart as FiCause,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiShield,
  FiUsers,
} from "react-icons/fi";

interface CampaignNotActivePageProps {
  campaign: {
    name: string;
    organisation: {
      name: string;
    };
  };
}

export default function CampaignNotActivePage({
  campaign,
}: CampaignNotActivePageProps) {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  // These values will come from the public campaign API.
  const campaignName = campaign.name;
  const organisationName = campaign.organisation.name;

  return (
    <main className="min-h-screen bg-[#F8F7FC] text-[#190D2E]">
      {/* Header */}
      <header className="border-b border-purple-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-[#6D28D9]"
          >
            tippified
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition hover:text-purple-700"
          >
            Back to Tippified
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-purple-700"
        >
          <FiArrowLeft />
          Back
        </Link>

        {/* Main notice */}
        <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
          <div className="bg-linear-to-br from-purple-100 via-purple-50 to-[#EDE9FE] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl text-purple-600 shadow-sm">
              <FiClock />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-xs font-bold text-purple-700">
              <FiCheckCircle size={15} />
              APPROVED BY TIPPI​​FIED
            </div>

            <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              This campaign is approved and awaiting activation.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
              This campaign has successfully passed Tippified&apos;s review
              process. It is currently awaiting activation before contributions
              can begin.
            </p>
          </div>

          <div className="px-6 py-9 sm:px-12 sm:py-12">
            {/* Campaign information */}
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex rounded-full bg-purple-100 px-4 py-1.5 text-xs font-semibold text-purple-700">
                Campaign
              </span>

              <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">
                {campaignName}
              </h2>

              <div className="mt-5 flex items-center justify-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-700">
                  {organisationName.charAt(0)}
                </div>

                <div className="text-left">
                  <p className="text-xs text-gray-500">Organised by</p>
                  <p className="font-bold">{organisationName}</p>
                </div>
              </div>
            </div>

            {/* Activation notice */}
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-purple-100 bg-purple-50/70 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-purple-600">
                  <FiHeart />
                </div>

                <div>
                  <h3 className="font-bold text-[#190D2E]">
                    Thank you for your interest in supporting this cause.
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    This campaign has been approved by Tippified team but is yet
                    to be activated, once activated you can start sending in
                    your donations and support. Thank you very much for your
                    interest in supporting humanity.
                  </p>
                </div>
              </div>
            </div>

            {/* Crowdfunding philosophy */}
            <section className="mt-12">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-700">
                  <FiUsers />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold leading-tight sm:text-3xl">
                  Crowdfunding is by the people, for the people.
                </h2>

                <p className="mt-4 text-base leading-8 text-gray-600">
                  Crowdfunding, as the name implies, is the fund by the people
                  and for the people, and as such requires huge integrity and
                  accountability.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-purple-100 bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-600">
                    <FiShield />
                  </div>

                  <h3 className="mt-4 font-bold">
                    Integrity and accountability
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    Every contribution represents someone&apos;s trust and
                    willingness to help. Campaigns should honour that trust by
                    using funds responsibly and for their stated purpose.
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-600">
                    <FiCheckCircle />
                  </div>

                  <h3 className="mt-4 font-bold">
                    Transparency with supporters
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    Supporters deserve to know how their contributions are being
                    used. Organisations should keep their supporters informed
                    and demonstrate how the funds raised are making a
                    difference.
                  </p>
                </div>
              </div>
            </section>

            {/* Invitation to organisations */}
            <section className="mt-12 overflow-hidden rounded-3xl bg-linear-to-br from-[#6D28D9] to-[#4C1D95] p-7 text-white sm:p-10">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                  <FiCause />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold leading-tight sm:text-3xl">
                  Are you an organisation working to make a difference?
                </h2>

                <p className="mt-5 text-sm leading-8 text-purple-100 sm:text-base">
                  Are you a registered organisation or charity whose interest is
                  in helping humanity? Whether you are raising funds for cancer
                  patients, people living with severe health conditions,
                  communities facing poor living conditions, schools, or causes
                  that generally put smiles on people&apos;s faces, Tippified
                  provides a platform to create campaigns and connect with
                  people willing to make a difference.
                </p>

                <p className="mt-4 text-sm leading-8 text-purple-100 sm:text-base">
                  Create an organisation account and start campaigns that touch
                  lives. Millions of people are waiting for opportunities to
                  support meaningful causes and make a difference through
                  initiatives like this.
                </p>

                <Link
                  href="/crowdfunding/register"
                  className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-7 py-4 text-sm font-bold text-purple-700 transition hover:bg-purple-50"
                >
                  Create an organisation account
                </Link>
              </div>
            </section>

            {/* Trust information */}
            <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3 border-t border-gray-100 pt-7">
              <FiShield className="mt-0.5 shrink-0 text-purple-600" size={21} />

              <div>
                <h3 className="text-sm font-bold">
                  Supporting humanity through accountability
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-500">
                  Tippified believes that the people who contribute to a cause
                  deserve honesty, accountability and transparency from those
                  receiving their support. The purpose of crowdfunding goes
                  beyond raising money; it is about bringing people together to
                  make a meaningful difference in other people&apos;s lives.
                </p>
              </div>
            </div>

            <div className="mt-9 text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-[#6D28D9] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-purple-800"
              >
                Explore Tippified
              </Link>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-gray-400">
          Campaign reference: {slug}
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-purple-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-sm text-gray-500 sm:flex-row sm:px-8">
          <p>Powered by Tippified</p>
          <p>Discover. Celebrate. Support.</p>
        </div>
      </footer>
    </main>
  );
}
