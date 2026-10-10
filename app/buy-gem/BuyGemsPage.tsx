"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiChevronDown,
  FiHeart,
  FiHexagon,
  FiLoader,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";

const API_BASE_URL = "https://api.tippified.com";

type Gem = {
  gem_id: string;
  name: string;
  price: string | number;
  icon: string;
};

type GemCart = Record<string, number>;

type SelectedGem = {
  gem_id: string;
  quantity: number;
};

type VaultSession = {
  success?: boolean;
  vault_found: boolean;
  fan?: {
    full_name: string;
    email: string;
  };
};

type IdentifiedBuyer = {
  success: boolean;
  vault_found: boolean;
  fan_status: "new" | "existing";
  fan: {
    full_name: string;
    email: string;
  };
  selected_gems: {
    gem_id: string;
    name: string;
    price: string;
    quantity: number;
    icon: string;
  }[];
  vault_gems?: {
    gem_id: string;
    name: string;
    quantity: number;
    icon: string;
  }[];
};

type PurchaseResponse = {
  success?: boolean;
  authorization_url?: string;
  message?: string;
};

type IdentifyResponse = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const API = {
  gems: `${API_BASE_URL}/api/auth/gems/`,
  session: `${API_BASE_URL}/api/auth/gems/session/`,
  identify: `${API_BASE_URL}/api/auth/gems/identify/`,
  purchase: `${API_BASE_URL}/api/auth/gems/purchase/`,
};

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return (
      error.response?.data?.message || error.response?.data?.error || fallback
    );
  }

  return fallback;
}

export default function BuyGemsPage() {
  const [gems, setGems] = useState<Gem[]>([]);
  const [cart, setCart] = useState<GemCart>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showFaq, setShowFaq] = useState<number | null>(null);

  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerError, setBuyerError] = useState("");

  const [buyerIdentified, setBuyerIdentified] =
    useState<IdentifiedBuyer | null>(null);

  const selectedGems = useMemo<SelectedGem[]>(
    () =>
      Object.entries(cart)
        .filter(([, quantity]) => quantity > 0)
        .map(([gem_id, quantity]) => ({ gem_id, quantity })),
    [cart],
  );

  const totalQuantity = useMemo(
    () => selectedGems.reduce((sum, gem) => sum + gem.quantity, 0),
    [selectedGems],
  );

  const totalPrice = useMemo(
    () =>
      selectedGems.reduce((sum, item) => {
        const gem = gems.find((entry) => entry.gem_id === item.gem_id);
        return sum + (gem ? Number(gem.price) * item.quantity : 0);
      }, 0),
    [selectedGems, gems],
  );

  const fetchGems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<{
        success?: boolean;
        gems?: Gem[];
      }>(API.gems);

      if (!Array.isArray(response.data.gems)) {
        throw new Error("The Gem catalogue returned an unexpected response.");
      }

      setGems(response.data.gems);
    } catch (err: unknown) {
      console.error("FAILED TO LOAD GEMS:", err);
      setError("We couldn't load the Gem catalogue. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGems();
  }, [fetchGems]);

  useEffect(() => {
    if (!showCheckout) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !checkoutLoading) {
        setShowCheckout(false);
        setBuyerError("");
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showCheckout, checkoutLoading]);

  const addGem = (gemId: string) => {
    setCart((previous) => ({
      ...previous,
      [gemId]: (previous[gemId] || 0) + 1,
    }));
  };

  const removeGem = (gemId: string) => {
    setCart((previous) => {
      const nextQuantity = (previous[gemId] || 0) - 1;
      const next = { ...previous };

      if (nextQuantity <= 0) {
        delete next[gemId];
      } else {
        next[gemId] = nextQuantity;
      }

      return next;
    });
  };

  const handleCheckout = async () => {
    if (selectedGems.length === 0) return;

    setCheckoutLoading(true);
    setBuyerError("");

    try {
      /*
       * Preserve the existing Gem Vault session flow.
       */
      const sessionResponse = await axios.get<VaultSession>(API.session, {
        withCredentials: true,
      });

      let fullName = buyerName.trim();
      let email = buyerEmail.trim();
      console.log("buyer", buyerIdentified);

      if (sessionResponse.data.vault_found && sessionResponse.data.fan) {
        fullName = sessionResponse.data.fan.full_name;
        email = sessionResponse.data.fan.email;
      } else {
        if (!fullName) {
          setBuyerError("Enter your full name to continue.");
          setCheckoutLoading(false);
          return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setBuyerError("Enter a valid email address.");
          setCheckoutLoading(false);
          return;
        }
      }

      /*
       * Identify the buyer and prepare the selected Gems.
       */
      const identifyResponse = await axios.post<IdentifyResponse>(
        API.identify,
        {
          full_name: fullName,
          email,
          selected_gems: selectedGems,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!identifyResponse.data.success) {
        setBuyerError(
          identifyResponse.data.message ||
            "We couldn't verify your Gem Vault details.",
        );
        setCheckoutLoading(false);
        return;
      }

      /*
       * Continue to the existing purchase endpoint.
       */
      const purchaseResponse = await axios.post<PurchaseResponse>(
        API.purchase,
        {
          full_name: fullName,
          email,
          selected_gems: selectedGems,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (
        purchaseResponse.data.success &&
        purchaseResponse.data.authorization_url
      ) {
        window.location.assign(purchaseResponse.data.authorization_url);
        return;
      }

      setBuyerError(
        purchaseResponse.data.message ||
          "We couldn't initialize your payment. Please try again.",
      );
    } catch (err: unknown) {
      console.error("GEM CHECKOUT ERROR:", err);
      setBuyerError(
        getErrorMessage(
          err,
          "Checkout could not be completed. Please try again.",
        ),
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const faqs = [
    {
      question: "What are Tippified Gems?",
      answer:
        "Gems are digital items available through Tippified that fans can purchase and use to show appreciation for participating creators.",
    },
    {
      question: "How do I buy Gems?",
      answer:
        "Choose the Gems you want, select their quantities, review your total and continue through the checkout process.",
    },
    {
      question: "Where are my purchased Gems stored?",
      answer:
        "Purchased Gems are associated with your Tippified Gem Vault. Use the email associated with your vault when making a purchase.",
    },
    {
      question: "Can I use Gems to support creators?",
      answer:
        "Yes. Tippified Gems are designed to help fans show appreciation for creators through the platform's supported Gem features.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-white pb-24 text-purple-950 md:pb-12">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#180b35] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-purple-600/30 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12 lg:pt-20">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-purple-200 transition hover:text-white"
          >
            <FiArrowLeft size={16} />
            Back to Tippified
          </Link>

          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-purple-100">
                <FiHexagon size={14} />
                THE TIPPI­FIED GEM VAULT
              </span>

              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Buy Gems.
                <span className="mt-2 block bg-linear-to-r from-fuchsia-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                  Celebrate Creators.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-purple-100/80 sm:text-lg sm:leading-8">
                Discover Gems on Tippified, choose your favourites and use them
                to show appreciation for the creators who make your day better.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#gem-catalogue"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-purple-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-purple-50"
                >
                  <FiShoppingBag size={17} />
                  Explore Gems
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  How it works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-purple-100/75">
                <span className="flex items-center gap-2">
                  <FiShield className="text-purple-300" size={15} />
                  Secure payment checkout
                </span>
                <span className="flex items-center gap-2">
                  <FiHeart className="text-pink-300" size={15} />
                  Made for creator appreciation
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative mx-auto w-full max-w-sm"
            >
              <div className="absolute inset-5 rounded-[2.5rem] bg-purple-500/30 blur-3xl" />

              <div className="relative overflow-hidden rounded-4xl border border-white/15 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-100">
                    Your Gem Vault
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-purple-200">
                    <FiHexagon size={21} />
                  </span>
                </div>

                <div className="mt-10">
                  <div className="flex items-center gap-3">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-400 to-purple-600 shadow-lg shadow-purple-950/30">
                      <FiHexagon size={32} />
                    </div>
                    <div>
                      <p className="text-2xl font-black">Gems</p>
                      <p className="mt-1 text-sm text-purple-200/70">
                        A little appreciation goes a long way.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-semibold text-purple-200/70">
                    YOUR NEXT STEP
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6">
                    Choose your Gems from the catalogue below to get started.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-purple-200/70">
                  <FiCheckCircle size={15} />
                  Simple selection and checkout
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATALOGUE */}
      <section
        id="gem-catalogue"
        className="scroll-mt-8 px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-purple-600">
                Explore the collection
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-purple-950 sm:text-4xl">
                Choose your Gems
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                Browse the available Gems, choose the quantities you want and
                review your order before checkout.
              </p>
            </div>

            {!loading && !error && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700">
                <FiHexagon size={14} />
                {gems.length} {gems.length === 1 ? "Gem" : "Gems"} available
              </div>
            )}
          </div>

          {loading ? (
            <div
              className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              aria-label="Loading Gems"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-3xl border border-purple-50 bg-purple-50/70"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-10 rounded-3xl border border-purple-100 bg-purple-50/50 px-6 py-12 text-center">
              <FiHexagon className="mx-auto text-purple-400" size={32} />
              <h3 className="mt-4 text-lg font-extrabold text-purple-950">
                The Gem catalogue is temporarily unavailable
              </h3>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
              <button
                type="button"
                onClick={() => void fetchGems()}
                className="mt-6 rounded-full bg-purple-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-800"
              >
                Try again
              </button>
            </div>
          ) : gems.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-purple-100 bg-purple-50/50 px-6 py-12 text-center">
              <FiHexagon className="mx-auto text-purple-400" size={32} />
              <h3 className="mt-4 text-lg font-extrabold text-purple-950">
                No Gems are available right now
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Please check back soon.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {gems.map((gem, index) => {
                const quantity = cart[gem.gem_id] || 0;

                return (
                  <motion.article
                    key={gem.gem_id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index * 0.04, 0.2),
                    }}
                    className={`group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border bg-white p-4 shadow-[0_10px_35px_-28px_rgba(88,28,135,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-28px_rgba(88,28,135,0.6)] sm:p-5 ${
                      quantity > 0
                        ? "border-purple-300 ring-2 ring-purple-100"
                        : "border-purple-100"
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-purple-50/80 to-transparent" />

                    <div className="relative flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold text-purple-600">
                          Tippified Gem
                        </span>
                        {quantity > 0 && (
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-purple-600 text-white">
                            <FiCheckCircle size={13} />
                          </span>
                        )}
                      </div>

                      <div className="my-5 flex h-28 items-center justify-center sm:h-32">
                        {gem.icon ? (
                          <Image
                            src={gem.icon}
                            alt={gem.name}
                            width={112}
                            height={112}
                            unoptimized
                            className="h-24 w-24 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-28 sm:w-28"
                          />
                        ) : (
                          <FiHexagon
                            size={64}
                            className="text-purple-300"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <h3 className="truncate text-center text-sm font-extrabold text-purple-950 sm:text-base">
                        {gem.name}
                      </h3>

                      <p className="mt-2 text-center text-base font-black text-purple-700 sm:text-lg">
                        {formatAmount(Number(gem.price))}
                      </p>

                      <p className="mt-1 text-center text-[11px] text-gray-400">
                        Per Gem
                      </p>

                      <div className="mt-5">
                        {quantity === 0 ? (
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() => addGem(gem.gem_id)}
                            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-purple-50 px-3 py-2.5 text-xs font-extrabold text-purple-700 transition hover:bg-purple-700 hover:text-white sm:text-sm"
                          >
                            <FiPlus size={15} />
                            Add to cart
                          </motion.button>
                        ) : (
                          <div className="flex min-h-11 items-center justify-between gap-2 rounded-full bg-purple-50 p-1.5">
                            <button
                              type="button"
                              aria-label={`Remove one ${gem.name}`}
                              onClick={() => removeGem(gem.gem_id)}
                              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-purple-700 shadow-sm transition hover:bg-purple-100"
                            >
                              <FiMinus size={14} />
                            </button>

                            <span
                              aria-live="polite"
                              className="text-sm font-extrabold text-purple-800"
                            >
                              {quantity}
                            </span>

                            <button
                              type="button"
                              aria-label={`Add one ${gem.name}`}
                              onClick={() => addGem(gem.gem_id)}
                              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple-700 text-white transition hover:bg-purple-800"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* CART SUMMARY */}
          {!loading && !error && gems.length > 0 && (
            <motion.section
              layout
              className="mt-10 rounded-3xl border border-purple-100 bg-linear-to-br from-purple-50 to-white p-5 sm:p-7"
              aria-label="Shopping cart"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-700 text-white shadow-lg shadow-purple-200">
                    <FiShoppingBag size={21} />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-purple-950">
                      Your Gem cart
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {totalQuantity} {totalQuantity === 1 ? "Gem" : "Gems"}{" "}
                      selected
                    </p>
                    {totalQuantity === 0 && (
                      <p className="mt-1 text-xs text-purple-400">
                        Add Gems from the collection to get started.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">
                      Order total
                    </p>
                    <p className="mt-1 text-xl font-black text-purple-800 sm:text-2xl">
                      {formatAmount(totalPrice)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBuyerError("");
                      setBuyerIdentified(null);
                      setShowCheckout(true);
                    }}
                    disabled={totalQuantity === 0}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 sm:px-7"
                  >
                    Continue
                    <FiShoppingBag size={16} />
                  </button>
                </div>
              </div>

              {totalQuantity > 0 && (
                <div className="mt-5 border-t border-purple-100 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedGems.map((item) => {
                      const gem = gems.find(
                        (entry) => entry.gem_id === item.gem_id,
                      );

                      if (!gem) return null;

                      return (
                        <div
                          key={item.gem_id}
                          className="flex items-center gap-2 rounded-full border border-purple-100 bg-white px-3 py-2"
                        >
                          {gem.icon && (
                            <Image
                              src={gem.icon}
                              alt=""
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <span className="text-xs font-bold text-purple-800">
                            {gem.name} × {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeGem(item.gem_id)}
                            aria-label={`Remove one ${gem.name}`}
                            className="text-purple-400 transition hover:text-red-500"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-8 bg-[#faf8ff] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-purple-600">
              A simple process
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-purple-950 sm:text-4xl">
              How to buy Gems on Tippified
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Select your Gems, identify your Gem Vault and complete your
              purchase through the checkout process.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Choose your Gems",
                description:
                  "Explore the catalogue and select the Gem types and quantities you want to purchase.",
              },
              {
                number: "02",
                title: "Confirm your details",
                description:
                  "Continue with the email associated with your existing Gem Vault or provide your details if you are new.",
              },
              {
                number: "03",
                title: "Complete checkout",
                description:
                  "Review your order and continue to the secure payment page to complete your purchase.",
              },
            ].map((step) => (
              <article
                key={step.number}
                className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-7"
              >
                <span className="inline-flex rounded-xl bg-purple-100 px-3 py-2 text-sm font-black text-purple-700">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-purple-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-purple-600">
              Helpful information
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-purple-950 sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-9 space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-purple-100 bg-white"
              >
                <button
                  type="button"
                  aria-expanded={showFaq === index}
                  onClick={() =>
                    setShowFaq((current) => (current === index ? null : index))
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="text-sm font-extrabold text-purple-950 sm:text-base">
                    {faq.question}
                  </span>
                  <FiChevronDown
                    size={18}
                    className={`shrink-0 text-purple-600 transition-transform ${
                      showFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {showFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-7 text-gray-500">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKOUT DIALOG */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            className="fixed inset-0 z-1000 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close checkout"
              onClick={() => {
                if (checkoutLoading) return;
                setShowCheckout(false);
              }}
              className="absolute inset-0 cursor-default bg-[#170b31]/65 backdrop-blur-sm"
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                aria-label="Close checkout"
                disabled={checkoutLoading}
                onClick={() => setShowCheckout(false)}
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-purple-50 text-purple-600 transition hover:bg-purple-100 disabled:opacity-50"
              >
                <FiX size={17} />
              </button>

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 text-purple-700">
                <FiHexagon size={23} />
              </div>

              <h2
                id="checkout-title"
                className="mt-5 pr-8 text-2xl font-black tracking-tight text-purple-950"
              >
                Complete your Gem purchase
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Confirm your details and review your order before proceeding to
                payment.
              </p>

              <div className="mt-6 rounded-2xl bg-purple-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-purple-700">
                    {totalQuantity} {totalQuantity === 1 ? "Gem" : "Gems"}
                  </span>
                  <span className="text-lg font-black text-purple-900">
                    {formatAmount(totalPrice)}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {selectedGems.map((item) => {
                    const gem = gems.find(
                      (entry) => entry.gem_id === item.gem_id,
                    );

                    if (!gem) return null;

                    return (
                      <div
                        key={item.gem_id}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <span className="text-gray-600">
                          {gem.name} × {item.quantity}
                        </span>
                        <span className="font-bold text-purple-800">
                          {formatAmount(Number(gem.price) * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                className="mt-6 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleCheckout();
                }}
              >
                <div>
                  <label
                    htmlFor="buyer-name"
                    className="mb-2 block text-xs font-bold text-purple-900"
                  >
                    Full name
                  </label>
                  <input
                    id="buyer-name"
                    autoComplete="name"
                    value={buyerName}
                    onChange={(event) => setBuyerName(event.target.value)}
                    placeholder="Enter your full name"
                    className="min-h-12 w-full rounded-xl border border-purple-100 bg-white px-4 text-sm text-purple-950 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="buyer-email"
                    className="mb-2 block text-xs font-bold text-purple-900"
                  >
                    Email address
                  </label>
                  <input
                    id="buyer-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={buyerEmail}
                    onChange={(event) => setBuyerEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="min-h-12 w-full rounded-xl border border-purple-100 bg-white px-4 text-sm text-purple-950 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <p className="text-xs leading-5 text-gray-400">
                  If you already have a Gem Vault, use the email associated with
                  it.
                </p>

                {buyerError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-6 text-red-700"
                  >
                    {buyerError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={checkoutLoading || totalQuantity === 0}
                  className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkoutLoading ? (
                    <>
                      <FiLoader className="animate-spin" size={17} />
                      Preparing checkout...
                    </>
                  ) : (
                    <>
                      Continue to payment
                      <FiShoppingBag size={17} />
                    </>
                  )}
                </button>

                <p className="flex items-center justify-center gap-2 text-center text-xs text-gray-400">
                  <FiShield size={14} />
                  Payment is completed through the configured checkout provider.
                </p>
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
