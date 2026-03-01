"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="group relative w-full">
        <select
          ref={ref}
          className={cn(
            "select-custom flex w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition-all duration-200",
            "hover:border-slate-300 hover:bg-slate-50/50",
            "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white",
            "min-h-11 touch-manipulation sm:min-h-10 sm:rounded-2xl",
            "dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:border-white/20 dark:hover:bg-slate-700/50 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20",
            "cursor-pointer",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-all duration-200 group-hover:text-slate-600 group-focus-within:rotate-180 group-focus-within:text-emerald-500 motion-reduce:transition-none motion-reduce:group-focus-within:rotate-0 dark:text-slate-500 dark:group-hover:text-slate-300 dark:group-focus-within:text-emerald-400"
          aria-hidden
        />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
