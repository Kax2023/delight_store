import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { OrdersSection } from "@/components/dashboard/orders-section";

async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: { include: { product: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function DashboardOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?redirect=/dashboard/orders");

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Orders & transactions
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          View current orders, track shipments, and access order history.
        </p>
      </div>

      <OrdersSection orders={orders} />
    </div>
  );
}
