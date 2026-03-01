import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, CreditCard, Heart } from "lucide-react";
import Link from "next/link";

interface DashboardStatsProps {
  pendingOrders: number;
  totalOrders: number;
  totalSpent: number;
  wishlistCount: number;
  cartCount: number;
}

const statCardClass =
  "rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-slate-800/50";

export function DashboardStats({
  pendingOrders,
  totalOrders,
  totalSpent,
  wishlistCount,
  cartCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Pending orders",
      value: pendingOrders,
      href: "/dashboard/orders?status=pending",
      icon: Package,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      label: "Total orders",
      value: totalOrders,
      href: "/dashboard/orders",
      icon: Package,
      color: "text-slate-700 dark:text-slate-300",
      bg: "bg-slate-100 dark:bg-slate-700/50",
    },
    {
      label: "Total spent",
      value: formatPrice(totalSpent),
      href: "/dashboard/payments",
      icon: CreditCard,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      label: "Wishlist items",
      value: wishlistCount,
      href: "/dashboard/wishlist",
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
    },
    {
      label: "Cart items",
      value: cartCount,
      href: "/dashboard/cart",
      icon: ShoppingCart,
      color: "text-navy-600 dark:text-navy-400",
      bg: "bg-navy-500/10 dark:bg-navy-500/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map(({ label, value, href, icon: Icon, color, bg }) => (
        <Link key={label} href={href} className={statCardClass}>
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
        </Link>
      ))}
    </div>
  );
}
