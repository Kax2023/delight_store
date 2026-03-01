import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";

async function getDashboardStats(userId: string) {
  const [orders, cartCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      select: { id: true, status: true, total: true },
    }),
    prisma.cartItem.count({ where: { userId } }),
  ]);

  const pendingOrders = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PROCESSING"
  ).length;
  const totalSpent = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);

  return {
    pendingOrders,
    totalOrders: orders.length,
    totalSpent,
    wishlistCount: 0,
    cartCount,
    recentOrders: orders.slice(0, 3),
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const stats = await getDashboardStats(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Welcome back, {session.user.name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Here’s a quick overview of your account.
        </p>
      </div>

      <DashboardStats
        pendingOrders={stats.pendingOrders}
        totalOrders={stats.totalOrders}
        totalSpent={stats.totalSpent}
        wishlistCount={stats.wishlistCount}
        cartCount={stats.cartCount}
      />

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent orders
          </h2>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="gap-1 text-emerald-600">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              No orders yet. Start shopping to see them here.
            </p>
            <Link href="/products" className="mt-4 inline-block">
              <Button className="bg-emerald-500/90 text-white hover:bg-emerald-500">
                Browse products
              </Button>
            </Link>
          </>
        ) : (
          <ul className="mt-4 space-y-3">
            {stats.recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/50 py-3 px-4 dark:border-white/10 dark:bg-slate-800/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {order.status}
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/orders">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
