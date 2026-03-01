import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getUserOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?redirect=/orders");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-8 text-slate-900 dark:text-white">My Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md dark:border-white/10 dark:bg-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">{formatPrice(order.total)}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PROCESSING"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200/70 pt-4 dark:border-white/10">
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.orderItems.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {order.payment && (
                  <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-white/10">
                    <p className="text-sm">
                      Payment Status:{" "}
                      <span
                        className={`font-semibold ${
                          order.payment.status === "COMPLETED"
                            ? "text-green-600"
                            : order.payment.status === "FAILED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.payment.status}
                      </span>
                    </p>
                  </div>
                )}

                {order.shippingAddress && (
                  <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-white/10">
                    <p className="text-sm text-slate-500">
                      <strong>Shipping to:</strong> {order.shippingAddress}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg mb-4">You haven't placed any orders yet.</p>
            <Link href="/products">
              <Button className="bg-emerald-500/90 text-white hover:bg-emerald-500">Start Shopping</Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
