import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsSection } from "@/components/dashboard/settings-section";

export default async function DashboardSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?redirect=/dashboard/settings");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Settings & preferences
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Manage communication and delivery preferences.
        </p>
      </div>

      <SettingsSection />
    </div>
  );
}
