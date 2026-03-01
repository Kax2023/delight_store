import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { SalesChart } from "@/components/admin/sales-chart";
import { ReportActions } from "@/components/admin/report-actions";
import { formatPrice } from "@/lib/utils";

async function getReportData() {
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return date;
  });

  const orders = await prisma.order.findMany({
    include: { payment: true },
    where: {
      payment: { status: "COMPLETED" },
    },
  });

  const monthLabels = months.map((date) =>
    date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
  );

  const monthTotals = months.map((date) => {
    return orders
      .filter(
        (order) =>
          order.createdAt.getFullYear() === date.getFullYear() &&
          order.createdAt.getMonth() === date.getMonth()
      )
      .reduce((sum, order) => sum + order.total, 0);
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const customers = await prisma.user.count();
  const conversionRate = totalOrders > 0 ? ((totalOrders / (customers || 1)) * 100) : 0;

  return {
    monthLabels,
    monthTotals,
    totalRevenue,
    totalOrders,
    customers,
    conversionRate,
  };
}

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const report = await getReportData();

  const exportRows = [
    { label: "Total Revenue", value: formatPrice(report.totalRevenue) },
    { label: "Total Orders", value: report.totalOrders },
    { label: "Customers", value: report.customers },
    { label: "Conversion Rate", value: `${report.conversionRate.toFixed(1)}%` },
  ];

  return (
    <AdminShell
      title="Sales Reports"
      subtitle="Luxury-grade analytics with export-ready insights."
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">Revenue</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">6-month trend</p>
            </div>
            <ReportActions rows={exportRows} />
          </div>
          <div className="mt-6">
            <SalesChart labels={report.monthLabels} series={report.monthTotals} />
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: "Revenue", value: formatPrice(report.totalRevenue) },
            { label: "Orders", value: report.totalOrders.toString() },
            { label: "Customers", value: report.customers.toString() },
            { label: "Conversion Rate", value: `${report.conversionRate.toFixed(1)}%` },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/10"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">{card.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{card.value}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Premium KPI insight</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
