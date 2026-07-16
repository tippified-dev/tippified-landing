"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";

export default function Hero() {
  return (
    <section className="bg-purple-500 from-purple-700 to-purple-600 text-white">

      <div className="max-w-6xl mx-auto px-6 py-24">

        <div className="flex justify-center mb-8">
          <div className="bg-white/10 rounded-full p-5">
            <SparklesIcon className="w-14 h-14" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-center leading-tight">
          Creator Monetization
          <br />
          Made Simple
        </h1>

        <p className="max-w-4xl mx-auto mt-8 text-center text-xl leading-9 text-purple-100">

          Tippified is a creator monetization platform that empowers creators,
          influencers, artists, musicians, streamers, public figures and
          celebrities to receive support directly from the people who love
          their work.

        </p>

        <p className="max-w-4xl mx-auto mt-6 text-center text-lg leading-8 text-purple-100">

          Fans can send monetary tips, purchase virtual gifts, contribute
          towards creator goals, fulfil creator wishlists, celebrate birthdays,
          and interact with creators during live streaming sessions—all from a
          single platform.

        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">

          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">

            <h3 className="text-2xl font-bold mb-3">
              💜 Support Creators
            </h3>

            <p className="text-purple-100 leading-7">
              Send monetary tips and help creators continue producing amazing
              content.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">

            <h3 className="text-2xl font-bold mb-3">
              🎁 Send Virtual Gifts
            </h3>

            <p className="text-purple-100 leading-7">
              Purchase beautiful digital gifts and instantly send them to your
              favourite creators.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">

            <h3 className="text-2xl font-bold mb-3">
              🎥 Join Live Streams
            </h3>

            <p className="text-purple-100 leading-7">
              Watch creators live while sending tips and virtual gifts in
              real-time.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}