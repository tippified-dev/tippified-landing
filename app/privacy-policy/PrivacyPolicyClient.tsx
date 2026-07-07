"use client";

import {
  CreditCardIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  LockClosedIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import NavBar from "../components/NavBar";

export default function PrivacyPolicyClient() {
  const sections = [
    {
      title: "Privacy Policy",
      icon: InformationCircleIcon,
      content: (
        <>
          <p className="mb-4">
            <strong>Effective Date:</strong> July 2026
          </p>

          <p className="mb-4">
            Welcome to <strong>Tippified</strong>, a creator tipping platform
            owned and operated by <strong>Grundex Limited</strong>.
          </p>

          <p className="mb-4">
            At Tippified, protecting your personal information is one of our
            highest priorities. We are committed to handling your personal data
            responsibly, transparently and securely in accordance with the
            <strong> Nigeria Data Protection Act (NDPA) 2023</strong> and all
            other applicable laws and regulations.
          </p>

          <p className="mb-4">
            This Privacy Policy explains how we collect, use, disclose, protect,
            retain and process your personal information whenever you use
            Tippifieds website, creator dashboard, fan tipping services,
            wallets and other related products.
          </p>

          <p>
            By accessing or using Tippified, you acknowledge that you have read
            and understood this Privacy Policy.
          </p>
        </>
      ),
    },

    {
      title: "1. Who We Are",
      icon: GlobeAltIcon,
      content: (
        <>
          <p className="mb-3">
            Tippified is owned by:
          </p>

          <p>
            <strong>Grundex Limited</strong>
          </p>

          <p>
            No. 15 Lawrence Egbor Close,
            <br />
            Iyana Isashi,
            <br />
            Ojo,
            <br />
            Lagos State,
            <br />
            Nigeria.
          </p>

          <p className="mt-4">
            Throughout this Privacy Policy, Tippified, we, our or us
            refers to Grundex Limited.
          </p>
        </>
      ),
    },

    {
      title: "2. Eligibility",
      icon: UserIcon,
      content: (
        <>
          <p className="mb-3">
            Tippified is intended solely for individuals who are at least
            <strong> 18 years old</strong>.
          </p>

          <p>
            We do not knowingly permit minors to register creator accounts or
            submit personal information through our platform.
          </p>
        </>
      ),
    },

    {
      title: "3. Information We Collect",
      icon: UserIcon,
      content: (
        <>
          <p className="font-semibold mb-3">
            Information collected from Creators
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>Full name</li>
            <li>Email address</li>
            <li>Date of birth</li>
            <li>Country of residence</li>
            <li>Username</li>
            <li>Profile information</li>
            <li>Bank name</li>
            <li>Bank account number</li>
            <li>Verified account holder name</li>
          </ul>

          <p className="font-semibold mt-6 mb-3">
            Information collected from Fans
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Wallet information (where applicable)</li>
            <li>Gift purchases</li>
            <li>Tipping history</li>
          </ul>

          <p className="font-semibold mt-6 mb-3">
            Automatically collected information
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>Device type</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Login timestamps</li>
            <li>Security logs</li>
          </ul>

          <p className="mt-5">
            We currently do <strong>not</strong> collect biometric data,
            selfies, fingerprints or facial recognition information.
          </p>
        </>
      ),
    },

    {
      title: "4. BVN Verification",
      icon: ShieldCheckIcon,
      content: (
        <>
          <p className="mb-4">
            To protect creators against identity fraud, Tippified performs
            Bank Verification Number (BVN) verification during creator
            onboarding.
          </p>

          <p className="mb-4">
            BVN verification is performed by our licensed verification provider:
          </p>

          <p className="mb-4">
            <strong>Provn (CloudEye)</strong>
          </p>

          <p className="mb-4">
            Tippified <strong>does not store</strong> creators BVNs.
          </p>

          <p>
            The BVN is transmitted securely to our verification provider solely
            for identity verification. Once verification is completed, only the
            verified account holders full name returned by the provider is
            retained in our database.
          </p>
        </>
      ),
    },

    {
      title: "5. Why We Process Your Information",
      icon: PencilSquareIcon,
      content: (
        <>
          <p>We process personal information to:</p>

          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Create user accounts.</li>
            <li>Authenticate users securely.</li>
            <li>Verify creator identities.</li>
            <li>Process creator payouts.</li>
            <li>Process fan tips.</li>
            <li>Provide wallet services.</li>
            <li>Send OTP verification emails.</li>
            <li>Respond to customer support requests.</li>
            <li>Prevent fraud and financial crimes.</li>
            <li>Comply with Nigerian laws and regulatory obligations.</li>
          </ul>
        </>
      ),
    },

    {
      title: "6. Legal Basis for Processing",
      icon: LockClosedIcon,
      content: (
        <>
          <p>
            Under the Nigeria Data Protection Act (NDPA), Tippified processes
            personal information based on one or more of the following lawful
            grounds:
          </p>

          <ul className="list-disc ml-6 mt-4 space-y-2">
            <li>Your consent.</li>
            <li>Performance of a contract.</li>
            <li>Compliance with legal obligations.</li>
            <li>Legitimate business interests.</li>
            <li>Fraud prevention and platform security.</li>
          </ul>
        </>
      ),
    },

      {
  title: "7. Payment Processing",
  icon: CreditCardIcon,
  content: (
    <>
      <p className="mb-4">
        Tippified is a creator tipping platform. We are <strong>not</strong> a
        payment processor, payment gateway or licensed financial institution.
      </p>

      <p className="mb-4">
        All payments made by fans are securely processed through
        <strong> Paystack</strong>, our licensed payment processing partner.
      </p>

      <p className="mb-4">
        When a fan submits a payment, payment card details and banking
        information are transmitted directly to Paystack through secure,
        encrypted channels.
      </p>

      <p>
        Tippified never stores debit card numbers, CVV numbers or complete
        payment credentials.
      </p>
    </>
  ),
},

{
  title: "8. Creator Settlement Accounts",
  icon: CreditCardIcon,
  content: (
    <>
      <p className="mb-4">
        Creator payouts are settled into a dedicated creator settlement account
        maintained with our settlement banking partner.
      </p>

      <p className="mb-4">
        Funds belonging to creators are segregated from Grundex Limiteds
        operational funds.
      </p>

      <p className="mb-4">
        Grundex Limited cannot arbitrarily withdraw creators funds from the
        settlement account.
      </p>

      <p>
        Platform revenue (our service fee) is automatically separated during
        settlement by our payment processor before settlement occurs.
      </p>
    </>
  ),
},

{
  title: "9. When We Share Information",
  icon: GlobeAltIcon,
  content: (
    <>
      <p className="mb-4">
        We never sell personal information.
      </p>

      <p className="mb-4">
        We only disclose information where necessary to operate Tippified or
        where required by law.
      </p>

      <p className="font-semibold mb-2">
        We may share information with:
      </p>

      <ul className="list-disc ml-6 space-y-2">
        <li>Paystack (payment processing)</li>
        <li>FCMB (creator settlement services)</li>
        <li>Provn (CloudEye) for BVN verification</li>
        <li>Resend for transactional email delivery</li>
        <li>Nigerian regulators where legally required</li>
        <li>Law enforcement agencies where required by law</li>
      </ul>
    </>
  ),
},

{
  title: "10. Fraud Prevention and Financial Crime Monitoring",
  icon: ShieldCheckIcon,
  content: (
    <>
      <p className="mb-4">
        Tippified maintains internal fraud detection procedures designed to
        protect creators, fans and the financial ecosystem.
      </p>

      <p className="mb-4">
        We continuously monitor platform activity for unusual behaviour,
        including but not limited to:
      </p>

      <ul className="list-disc ml-6 space-y-2">
        <li>Rapid repeated tipping activity.</li>
        <li>Abnormal wallet behaviour.</li>
        <li>Suspicious payment patterns.</li>
        <li>Potential identity fraud.</li>
        <li>Money laundering indicators.</li>
      </ul>

      <p className="mt-4">
        Where suspicious activity is detected, Tippified reserves the right to:
      </p>

      <ul className="list-disc ml-6 mt-3 space-y-2">
        <li>Suspend creator or fan accounts.</li>
        <li>Delay payouts.</li>
        <li>Request additional verification.</li>
        <li>Report suspicious transactions to the appropriate authorities.</li>
      </ul>

      <p className="mt-4">
        Our payment processor, Paystack, also performs its own independent risk
        assessment and regulatory monitoring of payment transactions.
      </p>
    </>
  ),
},

{
  title: "11. Data Security",
  icon: LockClosedIcon,
  content: (
    <>
      <p className="mb-4">
        We implement administrative, technical and organisational safeguards to
        protect personal information against unauthorised access, disclosure,
        alteration or destruction.
      </p>

      <p className="font-semibold mb-2">
        Security measures include:
      </p>

      <ul className="list-disc ml-6 space-y-2">
        <li>Encrypted HTTPS connections.</li>
        <li>Django Authentication.</li>
        <li>Password hashing.</li>
        <li>Secure database authentication.</li>
        <li>Role-based access control.</li>
        <li>Audit logging.</li>
        <li>Continuous server monitoring.</li>
      </ul>

      <p className="mt-4">
        Although we employ commercially reasonable safeguards, no online system
        can be guaranteed to be completely secure.
      </p>
    </>
  ),
},

{
  title: "12. Hosting Infrastructure",
  icon: LockClosedIcon,
  content: (
    <>
      <p className="mb-4">
        Tippified is hosted using <strong>Render</strong>.
      </p>

      <p className="mb-4">
        Our application infrastructure includes:
      </p>

      <ul className="list-disc ml-6 space-y-2">
        <li>Render cloud hosting.</li>
        <li>Managed PostgreSQL database.</li>
        <li>Encrypted HTTPS communication.</li>
      </ul>

      <p>
        Access to production infrastructure is restricted to authorised
        personnel only.
      </p>
    </>
  ),
},

{
  title: "13. Email Communications",
  icon: EnvelopeIcon,
  content: (
    <>
      <p className="mb-4">
        Tippified uses <strong>Resend</strong> to deliver transactional emails.
      </p>

      <p className="mb-4">
        Examples include:
      </p>

      <ul className="list-disc ml-6 space-y-2">
        <li>Account verification emails.</li>
        <li>Withdrawal verification codes.</li>
        <li>Password reset emails.</li>
        <li>Security notifications.</li>
      </ul>

      <p>
        We do not currently send marketing newsletters.
      </p>
    </>
  ),
 },

   {
  title: "14. Data Retention",
  icon: LockClosedIcon,
  content: (
    <>
      <p className="mb-4">
        We retain personal information only for as long as it is necessary to
        fulfil the purposes described in this Privacy Policy or to comply with
        applicable laws and regulations.
      </p>

      <p className="mb-4">
        Creator financial records, payout records, transaction history and
        related accounting information may be retained for up to
        <strong> seven (7) years</strong> after a creator closes or disables
        their account, in accordance with applicable financial and tax
        obligations.
      </p>

      <p>
        Where retention is no longer necessary, personal information will be
        securely deleted, anonymised or otherwise disposed of in accordance
        with our internal data retention procedures.
      </p>
    </>
  ),
},

{
  title: "15. Your Privacy Rights",
  icon: ShieldCheckIcon,
  content: (
    <>
      <p className="mb-4">
        Subject to the Nigeria Data Protection Act (NDPA), you may have the
        right to:
      </p>

      <ul className="list-disc ml-6 space-y-2">
        <li>Access the personal information we hold about you.</li>
        <li>Correct inaccurate or incomplete information.</li>
        <li>Request deletion of your personal information where legally permitted.</li>
        <li>Object to certain processing activities.</li>
        <li>Request restriction of processing.</li>
        <li>Withdraw consent where processing is based on consent.</li>
        <li>Request information regarding how your data is processed.</li>
      </ul>

      <p className="mt-4">
        Some requests may be declined where we are legally required to retain
        certain records, particularly financial records.
      </p>
    </>
  ),
},

{
  title: "16. Cookies",
  icon: GlobeAltIcon,
  content: (
    <>
      <p className="mb-4">
        Tippified may use essential cookies and similar technologies required
        for authentication, session management and platform security.
      </p>

      <p>
        We do not currently use advertising cookies or behavioural tracking
        technologies.
      </p>
    </>
  ),
},

{
  title: "17. International Data Transfers",
  icon: GlobeAltIcon,
  content: (
    <>
      <p className="mb-4">
        Some of our service providers may process information outside Nigeria.
      </p>

      <p className="mb-4">
        Where international transfers occur, we take reasonable steps to ensure
        that appropriate contractual, organisational and technical safeguards
        are implemented to protect personal information.
      </p>

      <p>
        Such transfers are carried out only where necessary for the operation
        of the platform.
      </p>
    </>
  ),
},

{
  title: "18. Account Closure",
  icon: UserIcon,
  content: (
    <>
      <p className="mb-4">
        Creators may request closure of their accounts at any time.
      </p>

      <p className="mb-4">
        Closing an account does not automatically require immediate deletion of
        financial records, transaction history or information we are legally
        required to retain.
      </p>

      <p>
        Following expiry of applicable legal retention periods, eligible
        personal information will be securely deleted or anonymised.
      </p>
    </>
  ),
},

{
  title: "19. Changes to this Privacy Policy",
  icon: PencilSquareIcon,
  content: (
    <>
      <p className="mb-4">
        We may revise this Privacy Policy from time to time to reflect changes
        in our services, legal obligations or security practices.
      </p>

      <p>
        Where significant changes are made, we will update the last updated
        date shown at the top of this page.
      </p>
    </>
  ),
},

{
  title: "20. Contact Us",
  icon: EnvelopeIcon,
  content: (
    <>
      <p className="mb-4">
        Questions, requests or complaints relating to this Privacy Policy may
        be directed to:
      </p>

      <p className="mb-2">
        <strong>Grundex Limited</strong>
      </p>

      <p>No. 15 Lawrence Egbor Close</p>
      <p>Iyana Isashi</p>
      <p>Ojo</p>
      <p>Lagos State</p>
      <p>Nigeria</p>

      <p className="mt-4">
        Email:
        <a
          href="mailto:support@tippified.com"
          className="text-purple-700 underline ml-1"
        >
          support@tippified.com
        </a>
      </p>
    </>
  ),
 },
  ];

  return (
    <>
      <NavBar />

      <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-purple-700 mb-3">
          Tippified Privacy Policy
        </h1>

        <p className="text-center text-gray-500 mb-12">
          Last Updated: July 2026
        </p>

        {sections.map((section, index) => {
          const Icon = section.icon;

          return (
            <section key={index} className="mb-10">

              <h2 className="flex items-center gap-3 text-2xl font-bold text-purple-800 mb-4">
                <Icon className="w-6 h-6 text-purple-600" />
                {section.title}
              </h2>

              <div className="leading-8 text-gray-700">
                {section.content}
              </div>

            </section>
            
          );
        })}

        </main>

      <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-semibold">
            © {new Date().getFullYear()} Tippified.
          </p>

          <p className="text-sm mt-2">
            Tippified is a product of <strong>Grundex Limited</strong>,
            Nigeria.
          </p>

          <p className="text-xs text-gray-500 mt-4">
            This Privacy Policy is governed by the laws of the Federal Republic
            of Nigeria, including the Nigeria Data Protection Act (NDPA) 2023.
          </p>
        </div>
      </footer>
      <a
  href="/about"
  className="fixed right-4 bottom-20 md:bottom-10 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition"
  aria-label="About Tippified"
>
  <InformationCircleIcon className="w-7 h-7 md:w-8 md:h-8" />
</a>
    </>
  )};