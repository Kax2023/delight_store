"use client";

import { formatPrice } from "@/lib/utils";
import { CreditCard, Package } from "lucide-react";
import Link from "next/link";

type PaymentWithOrder = {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string | null;
  createdAt: Date;
  order: {
    id: string;
    total: number;
    status: string;
    createdAt: Date;
  };
};

const statusClass: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  PROCESSING:
    "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
  COMPLETED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  FAILED: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300",
  CANCELLED: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
};

export function PaymentsSection({
  payments,
}: {
  payments: PaymentWithOrder[];
}) {
  if (payments.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <CreditCard className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          No payment history
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Payments will appear here after you complete an order.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-emerald-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-slate-800/50 overflow-hidden">
      <ul className="divide-y divide-slate-200/70 dark:divide-white/10">
        {payments.map((payment) => (
          <li
            key={payment.id}
            className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Order #{payment.order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(payment.createdAt).toLocaleDateString()} ·{" "}
                  {payment.paymentMethod || "Payment"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  statusClass[payment.status] ?? statusClass.PENDING
                }`}
              >
                {payment.status}
              </span>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {formatPrice(payment.amount)}
              </p>
              <Link
                href={`/dashboard/orders/${payment.order.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <Package className="h-4 w-4" />
                View order
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
