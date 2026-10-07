"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { landing, post, visitorId } from "@/lib/track";
import { captureAttribution, trackPageView } from "@/lib/ads";

// The last view sent, so the same page is never counted twice in a row
// (React runs effects twice in development).
let last = { path: "", at: 0 };

// Counts page views for the Analytics page in the admin panel. Renders nothing.
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (last.path === pathname && Date.now() - last.at < 2000) return;
    last = { path: pathname, at: Date.now() };
    captureAttribution();
    trackPageView();
    post("/view", { visitor: visitorId(), path: pathname, ...landing() });
  }, [pathname]);

  // once a minute while the tab is in view, so long reads still count as "on the site now"
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible")
        post("/ping", { visitor: visitorId(), path: window.location.pathname });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return null;
}
