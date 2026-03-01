"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SCROLL_THRESHOLD = 120;

export function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [scrolledDown, setScrolledDown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      setScrolledDown(window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  const submitSearch = () => {
    const q = search.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/products");
    }
  };

  const scrollToSearch = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!mounted) {
    return (
      <div className="sticky top-16 z-40 w-full bg-transparent h-[72px]" aria-hidden />
    );
  }

  return (
    <>
      <div
        className={`sticky top-16 z-40 w-full bg-transparent transition-all duration-300 ${
          scrolledDown ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="container mx-auto flex justify-center px-4 py-3">
          <form
            className="relative w-full max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="h-12 w-full rounded-full border-slate-200/70 bg-transparent pl-12 pr-14 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-400/60"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mini search icon when scrolled down */}
      <button
        type="button"
        onClick={scrollToSearch}
        aria-label="Scroll to search"
        className={`fixed right-6 top-24 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/70 bg-white shadow-lg text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
          scrolledDown ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <Search className="h-5 w-5" />
      </button>
    </>
  );
}
