"use client";

import { useRef } from "react";
import { Product } from "@prisma/client";
import { ProductCard } from "@/components/products/product-card";

type RelatedCarouselProps = {
  products: (Product & { category: { name: string; slug: string } })[];
};

export function RelatedCarousel({ products }: RelatedCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (offset: number) => {
    trackRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="absolute -top-14 right-0 hidden gap-3 md:flex">
        <button
          onClick={() => scrollBy(-320)}
          className="rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        >
          Prev
        </button>
        <button
          onClick={() => scrollBy(320)}
          className="rounded-full bg-emerald-500/90 px-4 py-2 text-xs text-white"
        >
          Next
        </button>
      </div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 scrollbar-hide"
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[260px] max-w-[260px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
