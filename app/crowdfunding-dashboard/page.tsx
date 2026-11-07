"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiCreditCard,
  FiDollarSign,
  FiEye,
  FiHeart,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiSettings,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { CROWDFUNDING_ROUTES } from "../config/crowdfunding";

const API_BASE_URL = "https://api.tippified.com";

interface CrowdfundingAccount {
  id?: number;
  email: string;
  account_type: "individual" | "organisation";
  first_name?: string;
  last_name?: string;
  organisation_name?: string;
  representative_name?: string;
  representative_position?: string;
  city?: string;
  country?: string;
  is_email_verified?: boolean;
  created_at?: string;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
  badge?: string;
}

const mainNavigation: NavItem[] = [
  {
    label: "Overview",
    icon: FiHome,
    active: true,
  },
  {
    label: "My campaigns",
    icon: FiTarget,
  },
  {
    label: "Contributions",
    icon: FiDollarSign,
  },
  {
    label: "Campaign updates",
    icon: FiActivity,
  },
];

const accountNavigation: NavItem[] = [
  {
    label: "Verification",
    icon: FiShield,
  },
  {
    label: "Account settings",
    icon: FiSettings,
  },
];

function getAccountName(account: CrowdfundingAccount) {
  if (account.account_type === "organisation") {
    return account.organisation_name || "Your organisation";
  }

  return (
    `${account.first_name || ""} ${account.last_name || ""}`.trim() ||
    "Your account"
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatDate(date?: string) {
  if (!date) return "New member";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "New member";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconStyle,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconStyle: string;
}) {
  return (
    <div className="group rounded-[22px] border border-zinc-100 bg-white p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-25px_rgba(91,33,182,0.22)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-zinc-500">{title}</p>

          <h3 className="mt-3 text-[27px] font-black tracking-tight text-[#190D2E]">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${iconStyle}`}
        >
          <Icon size={19} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className="text-[11px] text-zinc-400">{description}</span>
      </div>
    </div>
  );
}

function SidebarItem({
  item,
  onClick,
}: {
  item: NavItem;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
        item.active
          ? "bg-[#6D28D9] text-white shadow-[0_8px_20px_-8px_rgba(109,40,217,0.65)]"
          : "text-zinc-500 hover:bg-purple-50 hover:text-[#6D28D9]"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={17} />

        <span className="text-[12px] font-semibold">{item.label}</span>
      </span>

      {item.badge && (
        <span className="rounded-md bg-purple-100 px-2 py-1 text-[9px] font-bold text-[#6D28D9]">
          {item.badge}
        </span>
      )}
    </button>
  );
}

export default function CrowdfundingDashboard() {
  const router = useRouter();

  const [account, setAccount] = useState<CrowdfundingAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [logoutError, setLogoutError] = useState("");

  const fetchAccount = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/crowdfunding/me/`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        router.replace(CROWDFUNDING_ROUTES.signin);
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load your account information.",
        );
      }

      const accountData = data.data || data.account || data.user || data;

      if (!accountData.email) {
        throw new Error("Your account information could not be retrieved.");
      }

      setAccount(accountData);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading your dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const accountName = account ? getAccountName(account) : "Your account";

  const initials = getInitials(accountName) || "T";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      // First, obtain the CSRF token required by Django.
      const csrfResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/csrf/`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const csrfData = await csrfResponse.json().catch(() => ({}));

      if (!csrfResponse.ok || !csrfData.csrfToken) {
        throw new Error("Unable to verify your session. Please try again.");
      }

      // Now request logout from Django.
      const response = await fetch(`${API_BASE_URL}/api/crowdfunding/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrfData.csrfToken,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "We couldn't sign you out. Please try again.",
        );
      }

      // Close the modal and redirect after successful logout.
      setLogoutModalOpen(false);

      router.replace(CROWDFUNDING_ROUTES.signin);
      router.refresh();
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (label: string) => {
    setSidebarOpen(false);

    if (label === "Verification") {
      if (account?.account_type === "organisation") {
        router.push("/crowdfunding-organization-kyc");
      } else {
        router.push("/crowdfunding-individual-kyc");
      }

      return;
    }

    if (label === "Overview") {
      return;
    }

    // Other dashboard sections will be connected
    // as their respective features are implemented.
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9FC]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
            <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-purple-200 border-t-[#6D28D9]" />
          </div>

          <p className="mt-5 text-[13px] font-semibold text-[#190D2E]">
            Preparing your dashboard
          </p>

          <p className="mt-1 text-[11px] text-zinc-400">
            Please wait a moment...
          </p>
        </div>
      </main>
    );
  }

  if (loadError || !account) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9FC] px-5">
        <div className="w-full max-w-md rounded-[28px] border border-zinc-100 bg-white p-8 text-center shadow-xl shadow-purple-100/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FiActivity size={23} />
          </div>

          <h2 className="mt-5 text-xl font-black text-[#190D2E]">
            Unable to load your dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {loadError || "We couldn't retrieve your account information."}
          </p>

          <button
            onClick={fetchAccount}
            className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-[#6D28D9] text-sm font-bold text-white transition hover:bg-[#5B21B6]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#190D2E]">
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#190D2E]/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-67.5 flex-col border-r border-zinc-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-21 items-center justify-between border-b border-zinc-100 px-7">
          <Link href="/" className="flex items-center">
            <span className="text-[25px] font-black tracking-tight text-[#5B21B6]">
              tippified<span className="text-[#A78BFA]">.</span>
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 lg:hidden"
            aria-label="Close navigation"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* WORKSPACE */}
        <div className="px-6 pt-7">
          <div className="rounded-2xl border border-purple-100 bg-linear-to-br from-purple-50 to-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D28D9] text-white">
                <FiHeart size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#190D2E]">
                  Crowdfunding
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-400">
                  Your fundraising space
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-5 pt-8">
          <p className="mb-3 px-3 text-[9px] font-extrabold uppercase tracking-[1.8px] text-zinc-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {mainNavigation.map((item) => (
              <SidebarItem
                key={item.label}
                item={item}
                onClick={() => handleNavigation(item.label)}
              />
            ))}
          </nav>

          <p className="mb-3 mt-9 px-3 text-[9px] font-extrabold uppercase tracking-[1.8px] text-zinc-400">
            Account
          </p>

          <nav className="space-y-1">
            {accountNavigation.map((item) => (
              <SidebarItem
                key={item.label}
                item={item}
                onClick={() => handleNavigation(item.label)}
              />
            ))}
          </nav>

          {/* HELP CARD */}
          <div className="mt-10 rounded-2xl bg-[#F8F5FF] p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#7C3AED] shadow-sm">
              <FiHelpCircle size={17} />
            </div>

            <h4 className="mt-3 text-[12px] font-bold text-[#190D2E]">
              Need a hand?
            </h4>

            <p className="mt-1 text-[10px] leading-5 text-zinc-500">
              We are here to help you make your fundraising journey easier.
            </p>

            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold text-[#6D28D9]"
            >
              Visit help centre
              <FiArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* SIDEBAR PROFILE */}
        <div className="border-t border-zinc-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[12px] font-black text-[#6D28D9]">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-[#190D2E]">
                {accountName}
              </p>

              <p className="truncate text-[10px] text-zinc-400">
                {account.email}
              </p>
            </div>

            <FiChevronRight className="text-zinc-300" size={15} />
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="min-h-screen lg:ml-67.5">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-21 items-center justify-between border-b border-zinc-100 bg-white/90 px-5 backdrop-blur-xl md:px-9">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-100 text-zinc-600 lg:hidden"
              aria-label="Open navigation"
            >
              <FiMenu size={19} />
            </button>

            <div>
              <p className="text-[10px] font-medium text-zinc-400">Workspace</p>

              <h1 className="text-[15px] font-black text-[#190D2E]">
                Overview
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-[11px] font-bold text-[#190D2E]">
                {account.account_type === "organisation"
                  ? "Organisation account"
                  : "Individual account"}
              </p>

              <p className="mt-0.5 text-[10px] text-zinc-400">
                Member since {formatDate(account.created_at)}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-zinc-100 p-1.5 pr-3 transition hover:bg-purple-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-[#7C3AED] to-[#A78BFA] text-[11px] font-black text-white">
                  {initials}
                </div>

                <FiChevronDown size={14} className="text-zinc-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-64 rounded-2xl border border-zinc-100 bg-white p-3 shadow-[0_20px_60px_-20px_rgba(25,13,46,0.2)]">
                  <div className="border-b border-zinc-100 px-3 py-3">
                    <p className="truncate text-[12px] font-bold text-[#190D2E]">
                      {accountName}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-zinc-400">
                      {account.email}
                    </p>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleNavigation("Account settings");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] font-semibold text-zinc-600 hover:bg-purple-50 hover:text-[#6D28D9]"
                    >
                      <FiSettings size={15} />
                      Account settings
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setLogoutError("");
                        setLogoutModalOpen(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <FiLogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="mx-auto max-w-375 px-5 py-8 md:px-9 md:py-10">
          {/* WELCOME */}
          <section className="mb-9">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />

                  <span className="text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#6D28D9]">
                    Your crowdfunding workspace
                  </span>
                </div>

                <h2 className="text-[27px] font-black tracking-tight text-[#190D2E] md:text-[35px]">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#7C3AED] to-[#A78BFA]">
                    {account.account_type === "organisation"
                      ? account.organisation_name?.split(" ")[0] || "there"
                      : account.first_name || "there"}
                  </span>
                </h2>

                <p className="mt-2 max-w-xl text-[12px] leading-6 text-zinc-500 md:text-[13px]">
                  This is your space to bring meaningful causes to life, connect
                  with supporters and make every contribution count.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  // Campaign creation will be connected in the next stage.
                  alert("Campaign creation is coming next.");
                }}
                className="group flex h-12 items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] px-6 text-[12px] font-bold text-white shadow-[0_12px_25px_-12px_rgba(109,40,217,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_rgba(109,40,217,0.8)]"
              >
                <FiPlus size={17} />
                Create a campaign
                <FiArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </section>

          {/* INDIVIDUAL KYC NOTICE */}
          {account.account_type === "individual" && (
            <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-purple-100 bg-purple-50/70 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6D28D9]">
                  <FiShield size={18} />
                </div>

                <div>
                  <h3 className="text-[12px] font-bold text-[#190D2E]">
                    Complete your personal verification
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    Complete your KYC information to establish your identity and
                    build trust with your supporters.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/crowdfunding-individual-kyc")}
                className="flex items-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3 text-[11px] font-bold text-white transition hover:bg-[#5B21B6]"
              >
                Complete KYC
                <FiArrowRight size={14} />
              </button>
            </section>
          )}

          {/* ORGANISATION KYC NOTICE */}
          {account.account_type === "organisation" && (
            <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-purple-100 bg-purple-50/70 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6D28D9]">
                  <FiShield size={18} />
                </div>

                <div>
                  <h3 className="text-[12px] font-bold text-[#190D2E]">
                    Complete your organisation verification
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    Upload your organisation&apos;s CAC certificate to verify
                    your crowdfunding account and establish trust with your
                    supporters.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/crowdfunding-organization-kyc")}
                className="flex items-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3 text-[11px] font-bold text-white transition hover:bg-[#5B21B6]"
              >
                Complete Organisation KYC
                <FiArrowRight size={14} />
              </button>
            </section>
          )}

          {/* STATISTICS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total funds raised"
              value="₦0.00"
              description="Your fundraising total"
              icon={FiDollarSign}
              iconStyle="bg-purple-50 text-[#7C3AED]"
            />

            <StatCard
              title="Active campaigns"
              value="0"
              description="Currently running campaigns"
              icon={FiTarget}
              iconStyle="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Total contributors"
              value="0"
              description="People supporting your causes"
              icon={FiUsers}
              iconStyle="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Campaign views"
              value="0"
              description="Total campaign page visits"
              icon={FiEye}
              iconStyle="bg-orange-50 text-orange-600"
            />
          </section>

          {/* MAIN GRID */}
          <section className="mt-8 grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
            {/* FUNDRAISING PERFORMANCE */}
            <div className="rounded-3xl border border-zinc-100 bg-white p-6 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-black text-[#190D2E]">
                    Fundraising overview
                  </h3>

                  <p className="mt-1 text-[11px] text-zinc-400">
                    Track the progress of your fundraising activities.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
                  <FiTrendingUp size={18} />
                </div>
              </div>

              <div className="mt-8 flex min-h-57.5 flex-col items-center justify-center rounded-2xl border border-dashed border-purple-100 bg-[#FCFAFF] px-5 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#8B5CF6] shadow-[0_8px_25px_-12px_rgba(109,40,217,0.25)]">
                  <FiActivity size={23} />
                </div>

                <h4 className="mt-5 text-[13px] font-bold text-[#190D2E]">
                  Your fundraising story starts here
                </h4>

                <p className="mt-2 max-w-sm text-[11px] leading-6 text-zinc-400">
                  Once you launch your first campaign, your fundraising
                  performance, contributions and growth will appear here.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    alert("Campaign creation is coming next.");
                  }}
                  className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold text-[#6D28D9] hover:text-[#4C1D95]"
                >
                  Start your first campaign
                  <FiArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* ACCOUNT OVERVIEW */}
            <div className="rounded-3xl border border-zinc-100 bg-white p-6 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-black text-[#190D2E]">
                    Account overview
                  </h3>

                  <p className="mt-1 text-[11px] text-zinc-400">
                    Your crowdfunding account.
                  </p>
                </div>

                <FiShield className="text-[#8B5CF6]" size={19} />
              </div>

              <div className="mt-7 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#7C3AED] to-[#A78BFA] text-lg font-black text-white">
                  {initials}
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-[13px] font-bold text-[#190D2E]">
                    {accountName}
                  </h4>

                  <p className="mt-1 truncate text-[10px] text-zinc-400">
                    {account.email}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                  <span className="text-[11px] text-zinc-400">
                    Account type
                  </span>

                  <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-[10px] font-bold capitalize text-[#6D28D9]">
                    {account.account_type}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                  <span className="text-[11px] text-zinc-400">
                    Email status
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <FiCheckCircle size={13} />
                    {account.is_email_verified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">
                    Member since
                  </span>

                  <span className="text-[10px] font-semibold text-[#190D2E]">
                    {formatDate(account.created_at)}
                  </span>
                </div>
              </div>

              <div className="mt-7 rounded-xl bg-[#F8F5FF] p-4">
                <div className="flex items-center gap-2">
                  <FiHeart className="text-[#7C3AED]" size={15} />

                  <p className="text-[11px] font-bold text-[#190D2E]">
                    Your cause matters.
                  </p>
                </div>

                <p className="mt-2 text-[10px] leading-5 text-zinc-500">
                  Every great campaign begins with a purpose. Tell your story
                  and give people a reason to support it.
                </p>
              </div>
            </div>
          </section>

          {/* RECENT CONTRIBUTIONS */}
          <section className="mt-8 rounded-3xl border border-zinc-100 bg-white p-6 md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-black text-[#190D2E]">
                  Recent contributions
                </h3>

                <p className="mt-1 text-[11px] text-zinc-400">
                  Keep track of the people supporting your campaigns.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
                <FiCreditCard size={18} />
              </div>
            </div>

            <div className="mt-7 flex min-h-42.7 flex-col items-center justify-center rounded-2xl bg-[#FCFAFF] px-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#8B5CF6] shadow-sm">
                <FiUsers size={20} />
              </div>

              <h4 className="mt-4 text-[12px] font-bold text-[#190D2E]">
                No contributions yet
              </h4>

              <p className="mt-2 max-w-sm text-[10px] leading-5 text-zinc-400">
                When supporters contribute to your campaigns, their activity
                will appear here.
              </p>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-100 py-7 text-center sm:flex-row sm:text-left">
            <p className="text-[10px] text-zinc-400">
              © {new Date().getFullYear()} Tippified. All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-[10px] font-medium text-zinc-400">
              <Link href="/" className="transition hover:text-[#6D28D9]">
                Visit Tippified
              </Link>

              <span className="flex items-center gap-1.5">
                <FiShield size={11} />
                Secure crowdfunding
              </span>
            </div>
          </footer>
        </div>
      </div>
      {/* SIGN OUT CONFIRMATION MODAL */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#190D2E]/40 px-5 backdrop-blur-sm"
          onClick={() => {
            if (!isLoggingOut) {
              setLogoutModalOpen(false);
              setLogoutError("");
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            className="w-full max-w-105 overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_100px_-25px_rgba(25,13,46,0.35)] animate-in fade-in zoom-in-95 duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="relative flex justify-center px-7 pt-8">
              <button
                type="button"
                onClick={() => {
                  if (!isLoggingOut) {
                    setLogoutModalOpen(false);
                    setLogoutError("");
                  }
                }}
                disabled={isLoggingOut}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-40"
                aria-label="Close confirmation"
              >
                <FiX size={18} />
              </button>

              <div className="flex h-17 w-17 items-center justify-center rounded-[22px] bg-red-50 text-red-500 ring-8 ring-red-50/50">
                <FiLogOut size={27} />
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div className="px-7 pb-8 pt-6 text-center">
              <h3
                id="logout-modal-title"
                className="text-[20px] font-black tracking-tight text-[#190D2E]"
              >
                Sign out of Tippified?
              </h3>

              <p className="mx-auto mt-3 max-w-75 text-[12px] leading-6 text-zinc-500">
                Are you sure you want to sign out of your crowdfunding account?
                You will need to sign in again to access your dashboard.
              </p>

              {logoutError && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left">
                  <p className="text-[11px] leading-5 text-red-600">
                    {logoutError}
                  </p>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLogoutModalOpen(false);
                    setLogoutError("");
                  }}
                  disabled={isLoggingOut}
                  className="flex h-12.25 items-center justify-center rounded-xl border border-zinc-200 bg-white text-[12px] font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex h-12.25 items-center justify-center gap-2 rounded-xl bg-[#6D28D9] text-[12px] font-bold text-white shadow-[0_10px_20px_-10px_rgba(109,40,217,0.7)] transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoggingOut ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing out...
                    </>
                  ) : (
                    <>
                      <FiLogOut size={15} />
                      Yes, sign out
                    </>
                  )}
                </button>
              </div>

              <p className="mt-6 text-[9px] font-medium uppercase tracking-[1.5px] text-zinc-300">
                Tippified · Secure crowdfunding
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
