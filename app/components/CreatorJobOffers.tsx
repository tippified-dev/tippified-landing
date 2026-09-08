"use client";
import { FiBriefcase, FiGlobe, FiUsers } from "react-icons/fi";
const SMARTLINK_URL = `https://www.profitableratecpmnetwork.com/sy475qpf?key=9a88df8119d3d4985aac1298f1d57b2f`;
const SMARTLINK_URL_2 = `https://www.profitableratecpmnetwork.com/mp5q19er1?key=52613312a9be66cab84c510c3b43502a
`;

export default function CreatorJobOffers() {
  const openSmartLink = () => {
    window.open(SMARTLINK_URL, "_blank", "noopener,noreferrer");
  };
  const openSmartLink_2 = () => {
    window.open(SMARTLINK_URL_2, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="w-full px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-purple-100 bg-linear-to-br from-purple-50 via-white to-purple-50 p-5 shadow-sm sm:p-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
              Job offers for content creators
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Find influencing gigs and jobs in 5 minutes.
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Discover opportunities worldwide to turn your skills, audience,
              and creativity into paid work. Get hired in 5 minutes.
            </p>
          </div>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openSmartLink}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 active:scale-[0.98]"
            >
              <FiBriefcase className="h-5 w-5" />
              Influencing jobs
            </button>
            <button
              type="button"
              onClick={openSmartLink_2}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-5 py-3 font-semibold text-purple-700 transition hover:bg-purple-50 active:scale-[0.98]"
            >
              <FiGlobe className="h-5 w-5" />
              Online jobs
            </button>
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-5 py-3 font-semibold text-purple-700 transition hover:bg-purple-50 active:scale-[0.98]"
            >
              <FiUsers className="h-5 w-5" />
              Register as creator
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
