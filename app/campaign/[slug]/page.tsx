"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiHeart,
  FiMapPin,
  FiShield,
  FiUsers,
} from "react-icons/fi";

export default function PublicCampaignPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

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

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-700"
        >
          <FiArrowLeft />
          Back
        </Link>

        {/* Campaign banner placeholder */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="relative flex min-h-57.5 items-center justify-center bg-linear-to-br from-purple-100 via-purple-50 to-[#EDE9FE] sm:min-h-95">
            <div className="px-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-purple-400 shadow-sm">
                <FiHeart />
              </div>

              <p className="text-sm font-medium text-purple-700">
                Campaign banner will appear here
              </p>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_340px] lg:p-10">
            {/* Main campaign information */}
            <div>
              <span className="inline-flex rounded-full bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700">
                Campaign
              </span>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Campaign title will appear here
              </h1>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <FiMapPin />
                  Campaign location
                </span>

                <span className="inline-flex items-center gap-2">
                  <FiCalendar />
                  Campaign date
                </span>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-7">
                <h2 className="text-xl font-bold">About this campaign</h2>

                <p className="mt-3 leading-7 text-gray-600">
                  The campaign description will appear here. This section will
                  contain information about the cause, why support is needed,
                  and how contributions will make a difference.
                </p>
              </div>

              {/* Organisation */}
              <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                  Organised by
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-200 text-lg font-bold text-purple-700">
                    O
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Organisation name will appear here
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Verified organisation
                    </p>
                  </div>
                </div>
              </div>

              {/* Campaign gallery */}
              <section className="mt-9">
                <h2 className="text-xl font-bold">Campaign gallery</h2>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex aspect-4/3 items-center justify-center rounded-2xl bg-purple-100 text-sm text-purple-500"
                    >
                      Campaign image
                    </div>
                  ))}
                </div>
              </section>

              {/* Supporter activity */}
              <section className="mt-10 border-t border-gray-100 pt-8">
                <div className="flex items-center gap-2">
                  <FiUsers className="text-purple-600" size={20} />
                  <h2 className="text-xl font-bold">Supporters</h2>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Supporter contributions and messages will appear here.
                </p>

                <div className="mt-5 rounded-2xl border border-dashed border-purple-200 bg-white p-8 text-center">
                  <FiHeart className="mx-auto text-2xl text-purple-300" />

                  <p className="mt-3 font-semibold text-gray-600">
                    No supporter activity to display yet
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Contributions will appear here when people support this
                    campaign.
                  </p>
                </div>
              </section>
            </div>

            {/* Contribution panel */}
            <aside>
              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                <p className="text-sm font-medium text-gray-500">
                  Total raised
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-[#190D2E]">
                  Amount will appear here
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Campaign target: To be displayed
                </p>

                {/* Progress placeholder */}
                <div className="mt-5">
                  <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                    <div className="h-full w-0 rounded-full bg-purple-600" />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Fundraising progress will appear here
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-purple-50 p-3">
                    <p className="text-xs text-gray-500">Supporters</p>
                    <p className="mt-1 font-bold">--</p>
                  </div>

                  <div className="rounded-xl bg-purple-50 p-3">
                    <p className="text-xs text-gray-500">Contributions</p>
                    <p className="mt-1 font-bold">--</p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-4 font-bold text-white opacity-60"
                >
                  <FiHeart />
                  Contribute
                </button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Contribution checkout will be connected here.
                </p>

                <div className="mt-6 border-t border-gray-100 pt-5">
                  <div className="flex items-start gap-3">
                    <FiShield className="mt-0.5 text-purple-600" size={19} />

                    <div>
                      <p className="text-sm font-semibold">
                        Support with confidence
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Campaign verification and contribution information will
                        be displayed here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Route reference for development */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Campaign reference: {slug}
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-purple-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-sm text-gray-500 sm:flex-row sm:px-8">
          <p>Powered by Tippified</p>
          <p>Discover. Celebrate. Support.</p>
        </div>
      </footer>
    </main>
  );
}
