import Image from "next/image";
import Link from "next/link";

interface CreatorSignupBannerProps {
  width?: number;
  height?: number;
}

export default function CreatorSignupBanner({
  width = 600,
  height = 150,
}: CreatorSignupBannerProps) {
  return (
    <div className="my-6 w-full px-4 sm:px-6">
      <div className="mx-auto w-full" style={{ maxWidth: `${width}px` }}>
        <Link
          href="https://app.tippified.com/creator/signup"
          aria-label="Sign up on Tippified as a creator"
          className="block overflow-hidden rounded-xl transition-opacity duration-200 hover:opacity-90"
        >
          <Image
            src="/signup_promo_banner.webp"
            alt="Your fans are waiting to support you. Sign up on Tippified to start receiving money from fans."
            width={width}
            height={height}
            sizes={`(max-width: ${width}px) calc(100vw - 32px), ${width}px`}
            className="block h-auto w-full"
          />
        </Link>
      </div>
    </div>
  );
}
