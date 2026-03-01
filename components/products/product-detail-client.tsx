"use client";

import { Product } from "@prisma/client";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProductDetailClientProps {
  product: Product & {
    category: {
      name: string;
      slug: string;
    };
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const router = useRouter();
  const { data: session } = useSession();
  const inWishlist = isInWishlist(product.id);

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : "/products/products (1).jpg";

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity,
    });

    toast.success("Added to cart!");
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: imageUrl,
      });
      toast.success("Added to wishlist!");
    }
  };

  const handleBuyNow = () => {
    if (!session) {
      router.push("/login?redirect=/checkout");
      return;
    }
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-slate-600">Quantity</label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="border-slate-300 text-slate-700"
          >
            -
          </Button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              setQuantity(Math.min(Math.max(1, val), product.stock));
            }}
            className="w-16 text-center rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
            className="border-slate-300 text-slate-700"
          >
            +
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex items-center justify-center gap-2 bg-emerald-500/90 text-white hover:bg-emerald-500"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
        <Button
          onClick={handleWishlist}
          variant="outline"
          className={`flex items-center justify-center gap-2 border-slate-300 ${inWishlist ? "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20" : "text-slate-900 hover:bg-slate-100"}`}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
          {inWishlist ? "In wishlist" : "Add to wishlist"}
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          variant="outline"
          className="border-slate-300 text-slate-900 hover:bg-slate-100 sm:col-span-2 lg:col-span-1"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
