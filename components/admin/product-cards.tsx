import Image from "next/image";
import { formatPrice } from "@/lib/utils";

type ProductCardData = {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  createdAt: Date;
};

type ProductCardsProps = {
  products: ProductCardData[];
};

export function ProductCards({ products }: ProductCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.slice(0, 6).map((product) => {
        const isLowStock = product.stock <= 5;
        const isNew = Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 7;

        return (
          <div
            key={product.id}
            className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl transition hover:border-emerald-400/40 dark:border-white/10 dark:bg-white/10"
          >
            <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5">
              <Image
                src={product.images?.[0] || "/products/products (1).jpg"}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3 flex gap-2">
                {isNew ? (
                  <span className="rounded-full bg-gold-500/80 px-3 py-1 text-xs font-semibold text-navy-900">
                    New
                  </span>
                ) : null}
                {isLowStock ? (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                    Low Stock
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.name}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
                <span>{formatPrice(product.price)}</span>
                <span>{product.stock} in stock</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
