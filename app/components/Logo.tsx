import { pacifico } from "@/app/layout";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className={`${pacifico.className} text-2xl text-purple-600`}>
      Tippified
    </Link>
  );
}