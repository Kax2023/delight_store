"use client";

import { Bell, Tag, Truck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type NotificationType = "promo" | "order" | "support";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "promo",
    title: "20% off your next order",
    message: "Use code WELCOME20 at checkout. Valid until end of month.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "order",
    title: "Order shipped",
    message: "Your order #ABC12345 has been shipped. Track it in Orders.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "3",
    type: "support",
    title: "We're here to help",
    message: "Need help? Start a chat with our support team anytime.",
    time: "3 days ago",
    read: true,
  },
];

const typeConfig: Record<
  NotificationType,
  { icon: typeof Bell; className: string }
> = {
  promo: {
    icon: Tag,
    className: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  },
  order: {
    icon: Truck,
    className: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  support: {
    icon: MessageCircle,
    className: "bg-navy-500/15 text-navy-600 dark:bg-navy-500/20 dark:text-navy-400",
  },
};

export function NotificationsSection() {
  const items = mockNotifications;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recent notifications
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Promotional offers and order status updates.
        </p>
        {items.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center dark:border-white/10 dark:bg-slate-800/30">
            <Bell className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" />
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              No notifications yet
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {items.map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;
              return (
                <li
                  key={item.id}
                  className={`flex gap-4 rounded-xl border p-4 ${
                    item.read
                      ? "border-slate-200/70 bg-slate-50/50 dark:border-white/10 dark:bg-slate-800/30"
                      : "border-emerald-200/70 bg-emerald-50/30 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {item.message}
                    </p>
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      {item.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Customer support
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chat with us for order help, returns, or questions.
        </p>
        <Link href="/contact" className="mt-4 inline-block">
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Contact support
          </Button>
        </Link>
      </section>
    </div>
  );
}
