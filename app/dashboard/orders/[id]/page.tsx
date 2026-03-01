import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, ArrowLeft, Package } from "lucide-react";

async function getOrder(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      orderItems: { include: { product: true } },
      payment: true,
    },
  });
}

const statusSteps = [
  { key: "PENDING", label: "Order placed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?redirect=/dashboard/orders");

  const { id } = await params;
  const order = await getOrder(id, session.user.id);
  if (!order) notFound();

  const currentIndex = statusSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Track order #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Shipment status
        </h2>
        {isCancelled ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            This order was cancelled.
          </p>
        ) : (
          <div className="mt-6 flex flex-wrap gap-6 sm:gap-8">
            {statusSteps.map((step, index) => {
              const completed = index <= currentIndex;
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      completed
                        ? "bg-emerald-500 text-white dark:bg-emerald-500"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                    }`}
                  >
                    {completed ? (
                      <Truck className="h-5 w-5" />
                    ) : (
                      <Package className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        completed
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {index === currentIndex && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Current
                      </p>
                    )}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`hidden h-0.5 w-8 flex-1 sm:block ${
                        completed ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {order.shippingAddress && (
        <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Delivery address
          </h2>
          <div className="mt-4 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
            <MapPin className="h-5 w-5 shrink-0 text-slate-400" />
            <span>{order.shippingAddress}</span>
          </div>
          {order.phoneNumber && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Contact: {order.phoneNumber}
            </p>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Order summary
        </h2>
        <ul className="mt-4 space-y-2">
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
        <p className="mt-4 border-t border-slate-200/70 pt-4 text-lg font-semibold text-slate-900 dark:border-white/10 dark:text-white">
          Total: {formatPrice(order.total)}
        </p>
      </section>
    </div>
  );
}
