"use client";

import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

const DURATION_MS = 300;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isEntering, setIsEntering] = useState(true);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const isBackRef = useRef(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    const goingBack = isBackRef.current;
    isBackRef.current = false;
    prevPathRef.current = pathname;
    setDirection(goingBack ? "back" : "forward");
    setIsEntering(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsEntering(true));
    });
    return () => cancelAnimationFrame(t);
  }, [pathname]);

  useEffect(() => {
    const onPopState = () => {
      isBackRef.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div
      key={pathname}
      className="page-transition-root"
      data-direction={direction}
      data-entering={isEntering ? "true" : "false"}
      style={{ transitionDuration: `${DURATION_MS}ms` }}
      aria-live="polite"
      aria-busy={!isEntering}
    >
      {children}
    </div>
  );
}
