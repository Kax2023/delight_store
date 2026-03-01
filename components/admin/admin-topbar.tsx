"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminTopbar() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/70 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4 md:px-10">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
              <path
                d="M11 19a8 8 0 1 0-8-8 8 8 0 0 0 8 8zm10 2-4.3-4.3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            placeholder="Search orders, products, customers..."
            className="w-full rounded-xl border border-slate-200/70 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400/60 sm:rounded-2xl sm:py-2.5 sm:pl-10 sm:pr-4 sm:text-sm"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="relative rounded-full border border-slate-200/60 bg-white p-1.5 text-slate-600 transition hover:text-slate-900 sm:p-2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5">
              <path
                d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1z"
                fill="currentColor"
              />
            </svg>
            <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(245,197,66,0.8)] sm:right-1 sm:top-1 sm:h-2 sm:w-2" />
          </button>
          <div className="flex items-center gap-2 rounded-full border border-slate-200/60 bg-white px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
            <Image
              src="/logo/header.png"
              alt="Admin avatar"
              width={24}
              height={24}
              className="rounded-full bg-slate-100 p-0.5 sm:w-7 sm:h-7 sm:p-1"
            />
            <div className="hidden text-[10px] sm:block sm:text-xs md:block">
              <p className="font-semibold text-slate-900">Admin</p>
              <p className="text-slate-400">Super user</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-full border-slate-200/60 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:h-9 sm:px-3 sm:text-sm"
          >
            <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
