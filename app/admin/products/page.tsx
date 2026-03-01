import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductCards } from "@/components/admin/product-cards";
import { ProductsTable } from "@/components/admin/products-table";

async function getProducts() {
  try {
    return await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await getProducts();

  return (
    <AdminShell
      title="Products Management"
      subtitle="Curate product inventory with premium inline editing and visual previews."
    >
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 md:mb-8">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-300 sm:text-sm">Products in catalog</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">{products.length}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Link href="/admin/products/new" className="w-full sm:w-auto">
            <Button className="w-full bg-emerald-500/80 text-xs text-white hover:bg-emerald-500 sm:w-auto sm:text-sm">
              Add New Product
            </Button>
          </Link>
          <Button variant="outline" className="w-full border-slate-300 text-xs text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 sm:w-auto sm:text-sm">
            Export Inventory
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <ProductCards products={products} />
        {products.length > 0 ? (
          <ProductsTable initialProducts={products} />
        ) : (
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
            No products found yet.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
