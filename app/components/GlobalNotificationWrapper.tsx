"use client";

import { usePathname } from "next/navigation";
import GlobalNotification from "./GlobalNotification";

export default function GlobalNotificationWrapper() {
  const pathname = usePathname();

  // hide on search-goals page
  if (pathname === "/search-goals") return null;

  return <GlobalNotification />;
}