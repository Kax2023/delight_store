"use client";

import { Product } from "@prisma/client";
import { ProductCard } from "@/components/products/product-card";

type FeaturedCarouselProps = {
  products: (Product & { category: { name: string; slug: string } })[];
};

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  return (
    <div className="relative">
      <div
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide"
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
