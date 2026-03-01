import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AccountSettings } from "@/components/account/account-settings";
import { ProfileOverview } from "@/components/dashboard/profile-overview";
import { SavedPaymentMethods } from "@/components/dashboard/saved-payment-methods";

async function getProfileData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user
    ? {
        address: user.address ?? null,
        phoneNumber: user.phoneNumber ?? null,
      }
    : { address: null, phoneNumber: null };
}

export default async function DashboardProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?redirect=/dashboard/profile");

  const { address, phoneNumber } = await getProfileData(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Profile & account
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Manage your personal details, password, and payment methods.
        </p>
      </div>

      <ProfileOverview
        name={session.user.name ?? undefined}
        email={session.user.email ?? undefined}
      />

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Personal details, address & security
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update your contact, delivery address, and password.
        </p>
        <div className="mt-6">
          <AccountSettings
            initialAddress={address}
            initialPhoneNumber={phoneNumber}
          />
        </div>
      </section>

      <SavedPaymentMethods />
    </div>
  );
}
