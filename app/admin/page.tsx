import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

async function getDashboardStats() {
  try {
    const [totalOrders, totalRevenue, totalProducts, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          payment: {
            status: "COMPLETED",
          },
        },
      }),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        include: {
          user: true,
          payment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
      recentOrders,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getDashboardStats();

  return (
    <AdminShell
      title="Dashboard Overview"
      subtitle="Monitor DelightStore performance, sales momentum, and customer signals."
    >
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {[
              {
                label: "Total Revenue",
                value: formatPrice(stats.totalRevenue),
                change: "+12.4%",
              },
              { label: "Total Orders", value: stats.totalOrders, change: "+6.1%" },
              { label: "Total Products", value: stats.totalProducts, change: "+3.2%" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:rounded-3xl sm:p-4 md:p-5"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300 sm:text-xs">{item.label}</p>
                <div className="mt-2 flex items-end justify-between sm:mt-3 md:mt-4">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl md:text-2xl">{item.value}</p>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 sm:px-3 sm:py-1 sm:text-xs">
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:rounded-3xl sm:p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-300 sm:text-sm">Automation</p>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Smart Ops Command Center</h2>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Link href="/admin/products" className="w-full sm:w-auto">
                  <Button className="w-full bg-emerald-500/80 text-xs text-white hover:bg-emerald-500 sm:w-auto sm:text-sm">
                    Manage Products
                  </Button>
                </Link>
                <Link href="/admin/orders" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full border-slate-300 text-xs text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 sm:w-auto sm:text-sm">
                    Review Orders
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:mt-5 md:mt-6 md:grid-cols-2 md:gap-4">
              {[
                {
                  title: "Inventory pulse",
                  description: "Track low stock and high demand products in real time.",
                },
                {
                  title: "Customer loyalty",
                  description: "Recognize repeat buyers and VIP membership growth.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5 sm:rounded-2xl sm:p-4"
                >
                  <p className="text-xs font-semibold text-slate-900 dark:text-white sm:text-sm">{card.title}</p>
                  <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-300 sm:mt-2 sm:text-xs">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:rounded-3xl sm:p-5 md:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300 sm:text-xs">Recent Orders</p>
              <p className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Latest activity</p>
            </div>
            <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-semibold text-gold-100 sm:px-3 sm:py-1 sm:text-xs">
              Live feed
            </span>
          </div>
          <div className="mt-4 space-y-3 sm:mt-5 md:mt-6 md:space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2.5 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white sm:text-sm">
                      {order.user
                        ? order.user.name || order.user.email
                        : order.guestName || order.guestEmail || "Guest"}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300 sm:text-xs">
                      {order.id.slice(0, 8)} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs font-semibold text-emerald-200 sm:text-sm">
                      {formatPrice(order.total)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-white/10 dark:text-slate-200 sm:px-3 sm:py-1 sm:text-xs">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-300 sm:text-sm">No orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
