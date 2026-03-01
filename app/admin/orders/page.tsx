import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersTimeline } from "@/components/admin/orders-timeline";

async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await getOrders();

  return (
    <AdminShell
      title="Orders Management"
      subtitle="Track fulfillment progress with a premium timeline view."
    >
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:rounded-3xl sm:p-4 md:p-6">
        <OrdersTimeline
          orders={orders.map((order) => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
          }))}
        />
      </div>
    </AdminShell>
  );
}
