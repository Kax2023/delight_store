"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export function CartSection({ initialItems }: { initialItems: CartItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [updating, setUpdating] = useState<string | null>(null);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(productId);
      return;
    }
    setUpdating(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) throw new Error("Update failed");
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        )
      );
      toast.success("Cart updated");
    } catch {
      toast.error("Failed to update cart");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId: string) => {
    setUpdating(productId);
    try {
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Remove failed");
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setUpdating(null);
    }
  };

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <ShoppingCart className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Add items from the store to see them here.
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
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-slate-800/50 overflow-hidden">
        <ul className="divide-y divide-slate-200/70 dark:divide-white/10">
          {items.map((item) => (
            <li
              key={item.id}
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
                  {formatPrice(item.price)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/20">
                  <button
                    type="button"
                    disabled={updating === item.productId || item.quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    readOnly
                    className="h-9 w-12 border-0 text-center text-sm"
                  />
                  <button
                    type="button"
                    disabled={updating === item.productId}
                    className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-rose-600"
                  disabled={updating === item.productId}
                  onClick={() => removeItem(item.productId)}
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="w-full text-right text-sm font-medium text-slate-700 dark:text-slate-300 sm:w-auto">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-800/50">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          Subtotal: {formatPrice(total)}
        </p>
        <Link href="/checkout">
          <Button className="bg-emerald-500/90 text-white hover:bg-emerald-500">
            Proceed to checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
