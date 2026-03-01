"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

const MAX_VISIBLE_PAGES = 5;

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageLink = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/products?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  // Show a window of page numbers around current page
  let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
  if (end - start + 1 < MAX_VISIBLE_PAGES) {
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  }
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const linkClass =
    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition shrink-0 ";
  const activeClass = "bg-emerald-500/90 text-white";
  const inactiveClass =
    "border border-slate-200/70 text-slate-700 hover:bg-slate-100 hover:border-slate-300";

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {/* Previous arrow */}
      {prevPage ? (
        <Link
          href={createPageLink(prevPage)}
          aria-label="Previous page"
          className={`${linkClass} ${inactiveClass}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span
          aria-hidden
          className={`${linkClass} cursor-not-allowed border-slate-200/50 text-slate-400`}
        >
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={createPageLink(page)}
          className={`${linkClass} min-w-[2.25rem] ${
            page === currentPage ? activeClass : inactiveClass
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Next arrow */}
      {nextPage ? (
        <Link
          href={createPageLink(nextPage)}
          aria-label="Next page"
          className={`${linkClass} ${inactiveClass}`}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <span
          aria-hidden
          className={`${linkClass} cursor-not-allowed border-slate-200/50 text-slate-400`}
        >
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </div>
  );
}
