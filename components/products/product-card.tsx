"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";
import { formatPrice, getProductBadges } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: Product & {
    category: {
      name: string;
      slug: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : "/products/products (1).jpg";
  const badges = getProductBadges(product.stock, product.createdAt);
  const displayOldPrice = Math.round(product.price * 1.2);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity: 1,
    });
    
    toast.success("Added to cart!");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === "undefined") return;

    const url = `${window.location.origin}/products/${product.id}`;
    const title = product.name;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // if user cancels share, just fall back silently
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success("Product link copied!");
      } else {
        toast.error("Sharing is not supported in this browser.");
      }
    } catch {
      toast.error("Couldn't copy the link. Please try again.");
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded font-semibold">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex flex-wrap gap-1 sm:gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-gold-500/90 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-navy-900"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 flex gap-1 sm:gap-2 opacity-0 transition group-hover:opacity-100">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 bg-emerald-500/90 text-white hover:bg-emerald-500"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <p className="text-xs text-slate-500 mb-1">{product.category.name}</p>
          <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 truncate group-hover:text-emerald-600 transition text-slate-900">
            {product.name}
          </h3>
          <div className="mb-1 sm:mb-2">
            <span className="text-lg sm:text-2xl font-bold text-emerald-600 block">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 line-through">
              {formatPrice(displayOldPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-slate-600">
              <span className="font-semibold">Stock:</span> {product.stock > 0 ? (
                <span className="text-emerald-600 font-bold">{product.stock} left</span>
              ) : (
                <span className="text-red-600 font-bold">Out of Stock</span>
              )}
            </p>
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs text-gold-600 font-semibold">
                Low Stock!
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
