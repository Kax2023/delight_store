"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Products", icon: "products" },
  { href: "/admin/orders", label: "Orders", icon: "orders" },
  { href: "/admin/customers", label: "Customers", icon: "customers" },
];

const icons: Record<string, JSX.Element> = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M4 13h7V4H4v9zm0 7h7v-5H4v5zm9 0h7V11h-7v9zm0-16v5h7V4h-7z"
        fill="currentColor"
      />
    </svg>
  ),
  products: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M7 4h10v4H7zM5 8h14v12H5z"
        fill="currentColor"
      />
    </svg>
  ),
  customers: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0z"
        fill="currentColor"
      />
    </svg>
  ),
};

export function AdminSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed left-4 top-4 z-50 rounded-full border border-slate-200/60 bg-white/90 p-2 shadow-lg backdrop-blur-md md:hidden"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5 text-slate-700" />
        ) : (
          <Menu className="h-5 w-5 text-slate-700" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed left-0 top-0 z-40 h-full w-72 shrink-0 border-r border-slate-200/60 bg-white/95 px-4 py-6 backdrop-blur-xl transition-transform duration-300 md:relative md:translate-x-0 md:px-6 md:py-8",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="mb-6 flex items-center gap-3 md:mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-700 md:h-12 md:w-12">
            <span className="text-lg font-semibold md:text-xl">DS</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-700 md:text-sm">Admin</p>
            <p className="text-base font-semibold text-slate-900 md:text-lg">DelightStore</p>
          </div>
        </div>
        <nav className="space-y-1.5 md:space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:gap-3 md:rounded-2xl md:px-4 md:py-3 md:text-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-emerald-700 transition group-hover:scale-105 group-hover:bg-emerald-500/20 group-hover:text-emerald-700 md:h-10 md:w-10 md:rounded-xl">
                {icons[item.icon]}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-slate-200/60 bg-white/70 p-3 text-[10px] text-slate-600 md:rounded-3xl md:p-4 md:text-xs">
          <p className="font-semibold text-slate-900">Luxury Admin</p>
          <p className="mt-1.5 md:mt-2">Monitor sales, customers, and product health in real time.</p>
        </div>
      </aside>
    </>
  );
}
