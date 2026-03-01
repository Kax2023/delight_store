"use client";

import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-hot-toast";

export function WishlistSection() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (item: {
    productId: string;
    name: string;
    price: number;
    image: string;
  }) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <Heart className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          Your wishlist is empty
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Save items you like by clicking the heart on product pages.
        </p>
        <Link href="/products" className="mt-6 inline-block">
          <Button className="bg-emerald-500/90 text-white hover:bg-emerald-500">
            Browse products
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-slate-800/50 overflow-hidden">
      <ul className="divide-y divide-slate-200/70 dark:divide-white/10">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex flex-wrap items-center gap-4 p-4 sm:p-6"
          >
            <Link
              href={`/products/${item.productId}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700"
            >
              <Image
                src={item.image || "/products/products (1).jpg"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.productId}`}
                className="font-medium text-slate-900 hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400"
              >
                {item.name}
              </Link>
              <p className="mt-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {formatPrice(item.price)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => handleAddToCart(item)}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-rose-600"
                onClick={() => removeItem(item.productId)}
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
