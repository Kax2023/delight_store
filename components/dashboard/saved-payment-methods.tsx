"use client";

import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SavedPaymentMethods() {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Saved payment methods
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage cards and payment options for faster checkout.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-slate-300 dark:border-white/20"
        >
          <Plus className="h-4 w-4" />
          Add method
        </Button>
      </div>
      <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center dark:border-white/10 dark:bg-slate-800/30">
        <CreditCard className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" />
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          No saved payment methods
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
          Add a card or payment method during checkout to save it here.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 gap-2 border-slate-300 dark:border-white/20"
        >
          <Plus className="h-4 w-4" />
          Add payment method
        </Button>
      </div>
    </section>
  );
}
