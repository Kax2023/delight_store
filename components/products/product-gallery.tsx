"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-md dark:border-white/10 dark:bg-white/5">
        <Image
          src={images[active]}
          alt={name}
          fill
          className="object-cover transition duration-500 hover:scale-110"
          priority
        />
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={`${img}-${index}`}
            onClick={() => setActive(index)}
            className={`relative h-20 w-20 overflow-hidden rounded-2xl border ${
              active === index
                ? "border-emerald-400/70"
                : "border-slate-200/70 dark:border-white/10"
            }`}
          >
            <Image src={img} alt={`${name} ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
