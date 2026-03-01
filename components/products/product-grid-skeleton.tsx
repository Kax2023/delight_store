"use client";

import { useState, useEffect } from "react";
import { ProductCardSkeleton } from "./product-card-skeleton";

const DEFAULT_COUNT = 12;

interface ProductGridSkeletonProps {
  count?: number;
  /** Optional: show "Loading products…" after this many ms (e.g. 5000) */
  slowMessageAfterMs?: number;
}

export function ProductGridSkeleton({
  count = DEFAULT_COUNT,
  slowMessageAfterMs,
}: ProductGridSkeletonProps) {
  return (
    <div className="space-y-6">
      <div
        className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-busy="true"
        aria-label="Loading products"
      >
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
      {slowMessageAfterMs !== undefined && (
        <SlowLoadMessage afterMs={slowMessageAfterMs} />
      )}
    </div>
  );
}

function SlowLoadMessage({ afterMs }: { afterMs: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), afterMs);
    return () => clearTimeout(t);
  }, [afterMs]);

  if (!show) return null;

  return (
    <p
      className="text-center text-sm text-slate-500 dark:text-slate-400"
      role="status"
      aria-live="polite"
    >
      Loading products…
    </p>
  );
}
