import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatPrice } from "@/lib/utils";

async function getCustomers() {
  try {
    return await prisma.user.findMany({
      include: {
        orders: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const customers = await getCustomers();

  return (
    <AdminShell
      title="Customers Management"
      subtitle="Elevate loyalty with customer insights and premium profiles."
    >
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => {
          const totalSpend = customer.orders.reduce((sum, order) => sum + order.total, 0);
          const avgOrder =
            customer.orders.length > 0 ? totalSpend / customer.orders.length : 0;
          const tier =
            totalSpend > 1000000 ? "Platinum" : totalSpend > 400000 ? "Gold" : "Silver";

          return (
            <div
              key={customer.id}
              className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:rounded-3xl sm:p-5 md:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-base font-semibold text-emerald-700 dark:text-emerald-200 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg">
                  {customer.name?.[0] || customer.email[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white sm:text-sm truncate">
                    {customer.name || "Delight Customer"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs truncate">{customer.email}</p>
                </div>
                <span className="ml-auto shrink-0 rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-semibold text-gold-100 sm:px-3 sm:py-1 sm:text-xs">
                  {tier}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-300 sm:mt-5 sm:gap-3 sm:text-xs">
                <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5 sm:rounded-2xl sm:p-3">
                  <p>Total spend</p>
                  <p className="mt-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-200 sm:mt-2 sm:text-sm">
                    {formatPrice(totalSpend)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5 sm:rounded-2xl sm:p-3">
                  <p>Avg order</p>
                  <p className="mt-1.5 text-xs font-semibold text-slate-900 dark:text-white sm:mt-2 sm:text-sm">
                    {formatPrice(avgOrder)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                <button className="rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-semibold text-white transition hover:bg-emerald-500 sm:px-3 sm:py-1 sm:text-xs">
                  Email
                </button>
                <button className="rounded-full border border-slate-300 px-2 py-0.5 text-[10px] text-slate-600 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10 sm:px-3 sm:py-1 sm:text-xs">
                  View History
                </button>
                <button className="rounded-full border border-slate-300 px-2 py-0.5 text-[10px] text-slate-600 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10 sm:px-3 sm:py-1 sm:text-xs">
                  Deactivate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
