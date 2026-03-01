"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

const selectClassName =
  "w-full rounded-xl border border-slate-200/70 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer";

interface ProductFiltersProps {
  categories: Category[];
  currentCategory?: string;
}

export function ProductFilters({ categories, currentCategory }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.delete("page");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", search || null);
  };

  const handleApplyFilters = () => {
    updateFilter("minPrice", minPrice || null);
    updateFilter("maxPrice", maxPrice || null);
  };

  const categoryValue = currentCategory || "";

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6 backdrop-blur">
      {/* Search */}
      <div>
        <h3 className="font-semibold mb-3 text-slate-900">Search</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border-slate-200/70 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
          <Button type="submit" size="sm" className="bg-emerald-500/90 text-white hover:bg-emerald-500 rounded-xl">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Categories dropdown */}
      <div>
        <h3 className="font-semibold mb-3 text-slate-900">Category</h3>
        <div className="relative">
          <select
            value={categoryValue}
            onChange={(e) => updateFilter("category", e.target.value || null)}
            className={selectClassName}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-slate-900">Price Range (TZS)</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="rounded-xl border-slate-200/70 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
          <Input
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="rounded-xl border-slate-200/70 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold mb-3 text-slate-900">Sort By</h3>
        <div className="relative">
          <select
            value={searchParams.get("sort") || "newest"}
            onChange={(e) => updateFilter("sort", e.target.value === "newest" ? null : e.target.value)}
            className={selectClassName}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleApplyFilters}
        className="w-full rounded-xl bg-emerald-500/90 text-white hover:bg-emerald-500 font-semibold py-2.5"
      >
        Apply Filters
      </Button>
    </div>
  );
}
