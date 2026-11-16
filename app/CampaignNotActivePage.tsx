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
import { bricolage, fredoka } from "./font";

interface CampaignOrganisation {
  name: string;
}

interface Campaign {
  name: string;
  organisation: CampaignOrganisation;
}

interface CampaignNotActivePageProps {
  campaign: Campaign;
}

export default function CampaignNotActivePage({
  campaign,
}: CampaignNotActivePageProps) {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const campaignName = campaign.name;
  const organisationName = campaign.organisation.name;
  const organisationInitial = organisationName.charAt(0) || "T";

  const steps = [
    { label: "Approved", description: "Passed review" },
    { label: "Awaiting activation", description: "Almost live" },
    { label: "Contributions open", description: "Donations begin" },
  ];

  return (
    <main
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-[#F8F7FC] text-[#190D2E]`}
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-96 -left-24 h-72 w-72 rounded-full bg-purple-100/40 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-purple-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <Link
            href="/"
            className={`${fredoka.className} text-[26px] font-bold tracking-tight text-[#6D28D9]`}
          >
            tippified
          </Link>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-purple-100 bg-white px-4 text-[14px] font-medium text-gray-600 transition hover:border-purple-200 hover:text-purple-700 sm:border-0 sm:bg-transparent sm:px-0"
          >
            Back to Tippified
          </Link>
        </div>
      </header>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-[14px] font-medium text-gray-500 transition hover:text-purple-700"
        >
          <FiArrowLeft />
          Back
        </Link>

        {/* Main notice */}
        <section className="overflow-hidden rounded-[28px] border border-purple-100 bg-white shadow-[0_24px_70px_-30px_rgba(109,40,217,0.22)] sm:rounded-4x1">
          <div className="bg-linear-to-br from-purple-100 via-purple-50 to-[#EDE9FE] px-5 py-10 text-center sm:px-12 sm:py-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3x1 bg-white text-[32px] text-purple-600 shadow-sm">
              <FiClock />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-[12px] font-bold tracking-wide text-purple-700">
              <FiCheckCircle size={15} />
              APPROVED BY TIPPIFIED
            </div>

            <h1
              className={`${fredoka.className} mx-auto mt-5 max-w-2xl text-[30px] leading-[1.1] tracking-tight sm:text-[40px]`}
            >
              This campaign is approved and awaiting activation.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-gray-600 sm:text-[16px] sm:leading-8">
              This campaign has successfully passed Tippified&apos;s review
              process. It is currently awaiting activation before contributions
              can begin.
            </p>
          </div>

          <div className="px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
            {/* Campaign information */}
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex rounded-full bg-purple-100 px-4 py-1.5 text-[12px] font-semibold text-purple-700">
                Campaign
              </span>

              <h2
                className={`${fredoka.className} mt-4 text-[26px] leading-tight sm:text-[32px]`}
              >
                {campaignName}
              </h2>

              <div className="mt-5 flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-[18px] font-bold text-purple-700">
                  {organisationInitial}
                </div>

                <div className="text-left">
                  <p className="text-[12px] text-gray-500">Organised by</p>
                  <p className="text-[15px] font-bold">{organisationName}</p>
                </div>
              </div>
            </div>

            {/* Activation timeline */}
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-purple-100 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-2 sm:gap-3">
                {steps.map((step, index) => {
                  const isDone = index === 0;
                  const isCurrent = index === 1;
                  const isActive = index <= 1;
                  return (
                    <div key={step.label} className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                            isActive
                              ? "bg-purple-700 text-white"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {isDone ? <FiCheckCircle size={16} /> : index + 1}
                        </span>
                        <div
                          className={`h-1.5 flex-1 rounded-full ${
                            isActive ? "bg-purple-700" : "bg-purple-100"
                          }`}
                        />
                      </div>
                      <p
                        className={`mt-2.5 text-[12px] font-bold sm:text-[13px] ${
                          isCurrent
                            ? "text-purple-700"
                            : isDone
                              ? "text-[#190D2E]"
                              : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="mt-0.5 hidden text-[12px] text-gray-500 sm:block">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activation notice */}
            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-purple-100 bg-purple-50/70 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[20px] text-purple-600 shadow-sm">
                  <FiHeart />
                </div>

                <div>
                  <h3
                    className={`${fredoka.className} text-[17px] font-bold leading-6 text-[#190D2E]`}
                  >
                    Thank you for your interest in supporting this cause.
                  </h3>

                  <p className="mt-2.5 text-[14px] leading-7 text-gray-600 sm:text-[15px]">
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
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-[24px] text-purple-700">
                  <FiUsers />
                </div>

                <h2
                  className={`${fredoka.className} mt-5 text-[26px] leading-tight sm:text-[30px]`}
                >
                  Crowdfunding is by the people, for the people.
                </h2>

                <p className="mt-4 text-[15px] leading-8 text-gray-600 sm:text-[16px]">
                  Crowdfunding, as the name implies, is the fund by the people
                  and for the people, and as such requires huge integrity and
                  accountability.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="rounded-2xl border border-purple-100 bg-white p-6 sm:p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-[20px] text-purple-600">
                    <FiShield />
                  </div>

                  <h3
                    className={`${fredoka.className} mt-4 text-[16px] font-bold leading-6`}
                  >
                    Integrity and accountability
                  </h3>

                  <p className="mt-2.5 text-[14px] leading-7 text-gray-500">
                    Every contribution represents someone&apos;s trust and
                    willingness to help. Campaigns should honour that trust by
                    using funds responsibly and for their stated purpose.
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-white p-6 sm:p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-[20px] text-purple-600">
                    <FiCheckCircle />
                  </div>

                  <h3
                    className={`${fredoka.className} mt-4 text-[16px] font-bold leading-6`}
                  >
                    Transparency with supporters
                  </h3>

                  <p className="mt-2.5 text-[14px] leading-7 text-gray-500">
                    Supporters deserve to know how their contributions are being
                    used. Organisations should keep their supporters informed
                    and demonstrate how the funds raised are making a
                    difference.
                  </p>
                </div>
              </div>
            </section>

            {/* Invitation to organisations */}
            <section className="relative mt-12 overflow-hidden rounded-[28px] bg-linear-to-br from-[#6D28D9] to-[#4C1D95] p-7 text-white sm:p-10">
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

              <div className="relative mx-auto max-w-2xl text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-[24px]">
                  <FiCause />
                </div>

                <h2
                  className={`${fredoka.className} mt-5 text-[26px] leading-tight sm:text-[30px]`}
                >
                  Are you an organisation working to make a difference?
                </h2>

                <p className="mt-5 text-[14px] leading-8 text-purple-100 sm:text-[15px]">
                  Are you a registered organisation or charity whose interest is
                  in helping humanity? Whether you are raising funds for cancer
                  patients, people living with severe health conditions,
                  communities facing poor living conditions, schools, or causes
                  that generally put smiles on people&apos;s faces, Tippified
                  provides a platform to create campaigns and connect with
                  people willing to make a difference.
                </p>

                <p className="mt-4 text-[14px] leading-8 text-purple-100 sm:text-[15px]">
                  Create an organisation account and start campaigns that touch
                  lives. Millions of people are waiting for opportunities to
                  support meaningful causes and make a difference through
                  initiatives like this.
                </p>

                <Link
                  href="/crowdfunding/register"
                  className={`${fredoka.className} mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-white px-8 text-[14px] font-bold text-purple-700 shadow-lg transition hover:bg-purple-50`}
                >
                  Create an organisation account
                </Link>
              </div>
            </section>

            {/* Trust information */}
            <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3.5 border-t border-gray-100 pt-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FiShield size={20} />
              </div>

              <div>
                <h3 className="text-[15px] font-bold leading-6">
                  Supporting humanity through accountability
                </h3>

                <p className="mt-2 text-[14px] leading-7 text-gray-500">
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
                className={`${fredoka.className} inline-flex h-14 items-center justify-center rounded-xl bg-[#6D28D9] px-8 text-[15px] font-bold text-white shadow-[0_12px_25px_-12px_rgba(109,40,217,0.7)] transition hover:bg-purple-800`}
              >
                Explore Tippified
              </Link>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-[12px] text-gray-400">
          Campaign reference: {slug}
        </p>
      </div>

      {/* Footer */}
      <footer className="relative mt-8 border-t border-purple-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-7 text-[14px] text-gray-500 sm:flex-row sm:px-8">
          <p>Powered by Tippified</p>
          <p>Discover. Celebrate. Support.</p>
        </div>
      </footer>
    </main>
  );
}
