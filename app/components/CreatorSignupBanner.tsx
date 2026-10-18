import Image from "next/image";
import Link from "next/link";

export default function CreatorSignupBanner() {
  return (
    <div className="my-6 w-full">
      <Link
        href="https://app.tippified.com/creator/signup"
        aria-label="Sign up on Tippified as a creator"
        className="block w-full overflow-hidden rounded-xl transition-opacity duration-200 hover:opacity-90"
      >
        <Image
          src="/signup_promo_banner.webp"
          alt="Your fans are waiting to support your work. Sign up on Tippified to start receiving money from fans."
          width={600}
          height={150}
          sizes="(max-width: 640px) 100vw, 600px"
          className="h-auto w-full object-contain"
        />
      </Link>
    </div>
  );
}
