import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NotificationsSection } from "@/components/dashboard/notifications-section";

export default async function DashboardNotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?redirect=/dashboard/notifications");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Notifications & messages
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Promotional offers, order updates, and support messages.
        </p>
      </div>

      <NotificationsSection />
    </div>
  );
}
