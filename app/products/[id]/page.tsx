import { Header } from "@/components/layout/header";
import { SearchBar } from "@/components/layout/search-bar";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatPrice, getPseudoRating } from "@/lib/utils";
import { ProductDetailClient } from "@/components/products/product-detail-client";
import { Metadata } from "next";
import { ProductGallery } from "@/components/products/product-gallery";
import { RelatedCarousel } from "@/components/products/related-carousel";

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(categoryId: string, productId: string) {
  try {
    return await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
      },
      include: {
        category: true,
      },
      take: 4,
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description || `Shop ${product.name} at DelightStore`,
    openGraph: {
      title: product.name,
      description: product.description || `Shop ${product.name} at DelightStore`,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["/products/products (1).jpg"];
  const rating = getPseudoRating(product.id);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SearchBar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery images={images} name={product.name} />

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                {product.category.name}
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{product.name}</h1>
              <div className="mt-4 flex items-center gap-4">
                <p className="text-3xl font-semibold text-emerald-600 dark:text-emerald-300">
                  {formatPrice(product.price)}
                </p>
                <span className="rounded-full border border-slate-200/70 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300">
                  {rating.toFixed(1)} ★ Rating
                </span>
              </div>
            </div>

            {product.description && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                  Description
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold">Availability:</span>{" "}
                {product.stock > 0 ? (
                  <span className="text-emerald-600">{product.stock} available</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>

            <ProductDetailClient product={product} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Related Products</h2>
            </div>
            <RelatedCarousel products={relatedProducts} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
