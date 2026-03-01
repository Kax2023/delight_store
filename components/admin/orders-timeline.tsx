"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
  };
};

type OrderEntry = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  guestEmail: string | null;
  guestName: string | null;
  user: { name: string | null; email: string } | null;
  orderItems: OrderItem[];
};

const filters = ["All", "Pending", "Processing", "Shipped", "Delivered"];

export function OrdersTimeline({ orders }: { orders: OrderEntry[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeOrder, setActiveOrder] = useState<OrderEntry | null>(null);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") return orders;
    return orders.filter((order) => order.status === activeFilter.toUpperCase());
  }, [activeFilter, orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeFilter === filter
                ? "bg-emerald-500/80 text-white"
                : "border border-slate-200/70 bg-white/70 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const customer =
            order.user?.name || order.user?.email || order.guestName || order.guestEmail || "Guest";
          return (
            <button
              key={order.id}
              onClick={() => setActiveOrder(order)}
            className="flex w-full flex-col gap-2 rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-4 text-left backdrop-blur-xl transition hover:border-emerald-400/50 dark:border-white/10 dark:bg-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{customer}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {order.id.slice(0, 8)} • {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                    {formatPrice(order.total)}
                  </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-200">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex -space-x-2">
                {order.orderItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                  className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-100 dark:border-white/10 dark:bg-white/10"
                  >
                    <Image
                      src={item.product.images?.[0] || "/products/products (1).jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {activeOrder ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/70 bg-white p-6 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-navy-900 dark:text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Order Detail</p>
                <h3 className="text-xl font-semibold">{activeOrder.id}</h3>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="rounded-full border border-slate-200/70 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs text-slate-400">Customer</p>
                <p className="text-sm font-semibold">
                  {activeOrder.user?.name || activeOrder.guestName || "Guest"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {activeOrder.user?.email || activeOrder.guestEmail || "N/A"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs text-slate-400">Status</p>
                <p className="text-sm font-semibold">{activeOrder.status}</p>
                <p className="text-xs text-slate-300">{formatPrice(activeOrder.total)}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {activeOrder.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/10">
                      <Image
                        src={item.product.images?.[0] || "/products/products (1).jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.product.name}</p>
                      <p className="text-xs text-slate-400">Qty {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm text-emerald-700 dark:text-emerald-200">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
