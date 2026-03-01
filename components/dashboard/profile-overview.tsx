"use client";

import { User, Mail } from "lucide-react";

interface ProfileOverviewProps {
  name?: string;
  email?: string;
}

export function ProfileOverview({ name, email }: ProfileOverviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Personal details
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Your name and email as shown on your account.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Name
            </p>
            <p className="font-medium text-slate-900 dark:text-white">
              {name || "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-500/10 text-navy-600 dark:bg-navy-500/20 dark:text-navy-400">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email
            </p>
            <p className="font-medium text-slate-900 dark:text-white">
              {email || "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
