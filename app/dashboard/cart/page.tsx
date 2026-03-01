import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CartSection } from "@/components/dashboard/cart-section";

async function getCartItems(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true,
    },
  });
  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    image: item.product.images[0] || "/products/products (1).jpg",
    quantity: item.quantity,
    product: item.product,
  }));
}

export default async function DashboardCartPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?redirect=/dashboard/cart");

  const items = await getCartItems(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Cart
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Review items, update quantity, or remove items.
        </p>
      </div>

      <CartSection initialItems={items} />
    </div>
  );
}
