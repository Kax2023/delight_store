import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { formatPrice } from "@/lib/utils";
import { AccountSettings } from "@/components/account/account-settings";

async function getAccountData(userId: string) {
  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { 
    user: user ? {
      address: (user as any).address || null,
      phoneNumber: (user as any).phoneNumber || null,
    } : null,
    orders 
  };
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?redirect=/account");
  }

  const { user, orders } = await getAccountData(session.user.id);
  const totalSpend = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-lg font-semibold text-emerald-700 dark:text-emerald-200">
                  {session.user.name?.[0] || session.user.email?.[0]}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {session.user.name || "Delight Customer"}
                  </p>
                  <p className="text-sm text-slate-500">{session.user.email}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Orders", value: orders.length },
                  { label: "Total Spend", value: formatPrice(totalSpend) },
                  { label: "Loyalty", value: totalSpend > 1000000 ? "Platinum" : "Gold" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    <p className="text-xs uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md dark:border-white/10 dark:bg-white/5">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Order History</h2>
              <div className="mt-4 space-y-4">
                {orders.length === 0 ? (
                  <p className="text-sm text-slate-500">No orders yet.</p>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 text-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-200">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-2 font-semibold text-emerald-600">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <AccountSettings
              initialAddress={user?.address}
              initialPhoneNumber={user?.phoneNumber}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
