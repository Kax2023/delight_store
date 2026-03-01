"use client";

import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  FileText,
  RotateCcw,
  ChevronRight,
  MapPin,
} from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; className: string; icon?: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-navy-100 text-navy-800 dark:bg-navy-500/20 dark:text-navy-300",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
  },
};

type OrderWithItems = {
  id: string;
  status: string;
  total: number;
  shippingAddress: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    product: { name: string; images: string[] };
  }>;
  payment: { status: string } | null;
};

export function OrdersSection({ orders }: { orders: OrderWithItems[] }) {
  if (orders.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <Package className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          No orders yet
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your order history will appear here once you place an order.
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
      {orders.map((order) => {
        const status = statusConfig[order.status] ?? {
          label: order.status,
          className: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
        };
        return (
          <section
            key={order.id}
            className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {formatPrice(order.total)}
              </p>
            </div>

            <ul className="mt-4 space-y-2 border-t border-slate-200/70 pt-4 dark:border-white/10">
              {order.orderItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between text-sm text-slate-600 dark:text-slate-300"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            {order.shippingAddress && (
              <div className="mt-4 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Ship to: {order.shippingAddress}</span>
              </div>
            )}

            {order.payment && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Payment:{" "}
                <span
                  className={
                    order.payment.status === "COMPLETED"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }
                >
                  {order.payment.status}
                </span>
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <Link href={`/dashboard/orders/${order.id}`}>
                  <Truck className="h-4 w-4" />
                  Track
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileText className="h-4 w-4" />
                Invoice
              </Button>
              {(order.status === "DELIVERED" || order.status === "SHIPPED") && (
                <Button variant="outline" size="sm" className="gap-1.5">
                  <RotateCcw className="h-4 w-4" />
                  Return / Refund
                </Button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
