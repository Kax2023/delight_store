"use client";

export function ProductCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-md"
      role="presentation"
      aria-hidden="true"
    >
      {/* Image placeholder - grey box with rounded corners */}
      <div className="skeleton-shimmer relative h-48 w-full rounded-t-3xl bg-slate-200 dark:bg-slate-700 sm:h-64" />
      <div className="p-3 sm:p-4">
        {/* Category placeholder */}
        <div className="skeleton-shimmer mb-2 h-3 w-12 rounded bg-slate-200 dark:bg-slate-700" />
        {/* Title placeholder - short horizontal bar */}
        <div className="skeleton-shimmer mb-2 h-4 w-full max-w-[85%] rounded bg-slate-200 dark:bg-slate-700 sm:mb-3 sm:h-5" />
        {/* Price row */}
        <div className="mb-2 flex items-baseline gap-2 sm:mb-3">
          <div className="skeleton-shimmer h-5 w-16 rounded bg-slate-200 dark:bg-slate-700 sm:h-7 sm:w-20" />
          <div className="skeleton-shimmer h-3 w-12 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        {/* Stock + button row */}
        <div className="flex items-center justify-between gap-2">
          <div className="skeleton-shimmer h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="skeleton-shimmer h-9 w-20 rounded-lg bg-slate-200 dark:bg-slate-700 sm:w-24" />
        </div>
      </div>
    </div>
  );
}
