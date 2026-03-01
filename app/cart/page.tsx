"use client";

import { Header } from "@/components/layout/header";
import { SearchBar } from "@/components/layout/search-bar";
import { Footer } from "@/components/layout/footer";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function CartPage() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = getTotal();

  useEffect(() => {
    // Sync cart with server if user is logged in
    if (session?.user?.id && items.length > 0) {
      // You can add logic here to sync with server cart
    }
  }, [session, items]);

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <SearchBar />
        <main className="flex-1 container mx-auto bg-white px-3 py-8 sm:px-4 sm:py-12">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-slate-300 mb-4 sm:h-24 sm:w-24" />
            <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white sm:text-2xl">
              Your cart is empty
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm sm:text-base">
              Start shopping to add items to your cart
            </p>
            <Link href="/products">
              <Button className="bg-emerald-500/90 text-white hover:bg-emerald-500">
                Browse Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SearchBar />
      <main className="flex-1 container mx-auto bg-white px-3 py-6 sm:px-4 sm:py-10">
        <h1 className="text-2xl font-semibold mb-6 sm:text-3xl sm:mb-8 text-slate-900 dark:text-white">
          Shopping Cart
        </h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-md dark:border-white/10 dark:bg-slate-800 sm:rounded-3xl sm:p-4 flex flex-col gap-3 sm:flex-row sm:gap-4"
              >
                <div className="flex gap-3 sm:flex-1 sm:min-w-0">
                  <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-white/10 sm:h-24 sm:w-24">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 sm:text-lg">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-emerald-600 font-bold text-sm mt-0.5 sm:mb-2 sm:text-base">
                      {formatPrice(item.price)}
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white sm:hidden">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="font-bold text-lg text-slate-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-slate-200/70 pt-3 dark:border-white/10 sm:border-0 sm:pt-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="h-10 w-10 min-w-10 p-0 border-slate-300 text-slate-700 dark:border-white/20 dark:text-white sm:h-9 sm:w-9 sm:min-w-9"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center text-sm text-slate-600 dark:text-slate-300 sm:w-12">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="h-10 w-10 min-w-10 p-0 border-slate-300 text-slate-700 dark:border-white/20 dark:text-white sm:h-9 sm:w-9 sm:min-w-9"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.productId)}
                    className="h-10 w-10 min-w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-4 dark:border-white/10 dark:bg-slate-800 sm:rounded-3xl sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white sm:text-xl">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-slate-200/70 pt-2 flex justify-between font-bold text-slate-900 dark:text-white dark:border-white/10 sm:text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="block">
                <Button
                  className="w-full bg-emerald-500/90 text-white hover:bg-emerald-500"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/products" className="block mt-3 sm:mt-4">
                <Button
                  variant="outline"
                  className="w-full border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
