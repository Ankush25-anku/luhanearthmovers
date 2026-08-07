"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Loader from "./Loader";

const MIN_DISPLAY_MS = 500; // avoids a one-frame flash on an already-cached load
const MAX_WAIT_MS = 4000; // fallback in case `load` never fires for some reason

/**
 * InitialLoader
 * Shows the premium Loader only for the very first paint of a fresh page
 * load — while the browser is still fetching the initial round of assets
 * (Hero frames, fonts, etc.) — then fades it out once `window.load` fires
 * (everything the browser knows about has loaded) or after MAX_WAIT_MS,
 * whichever comes first. Never re-appears for in-app navigation or normal
 * scrolling; that's what app/loading.js (Next's route-transition loading
 * UI) is for.
 */
export default function InitialLoader() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef(null);

  useEffect(() => {
    const startedAt = Date.now();
    let fallbackTimer;
    let minDisplayTimer;

    const fadeOutAndUnmount = () => {
      if (!rootRef.current) {
        setMounted(false);
        return;
      }
      gsap.to(rootRef.current, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => setMounted(false),
      });
    };

    const dismiss = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      minDisplayTimer = window.setTimeout(fadeOutAndUnmount, remaining);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    fallbackTimer = window.setTimeout(dismiss, MAX_WAIT_MS);

    return () => {
      window.removeEventListener("load", dismiss);
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(minDisplayTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={rootRef}>
      <Loader />
    </div>
  );
}
