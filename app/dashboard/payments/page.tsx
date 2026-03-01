import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { PaymentsSection } from "@/components/dashboard/payments-section";

async function getPaymentHistory(userId: string) {
  return prisma.payment.findMany({
    where: { order: { userId } },
    include: {
      order: {
        select: { id: true, total: true, status: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function DashboardPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?redirect=/dashboard/payments");

  const payments = await getPaymentHistory(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Payments & wallet
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          View your payment history and transaction details.
        </p>
      </div>

      <PaymentsSection payments={payments} />
    </div>
  );
}
