"use client";

import { useState } from "react";
import type { Category } from "@prisma/client";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/products/product-filters";

type FiltersDrawerProps = {
  categories: Category[];
  currentCategory?: string;
};

export function FiltersDrawer({ categories, currentCategory }: FiltersDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-start">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="rounded-full border-slate-300 bg-white/70 px-5"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-[92vw] max-w-sm bg-white/90 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Filters</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200/70 bg-white/70 p-2 text-slate-700 hover:text-slate-900"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ProductFilters categories={categories} currentCategory={currentCategory} />
          </aside>
        </div>
      )}
    </>
  );
}

