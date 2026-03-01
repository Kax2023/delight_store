import { Header } from "@/components/layout/header";
import { SearchBar } from "@/components/layout/search-bar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/products/product-card";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

async function getCategory(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            category: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const category = await getCategory(resolvedParams.slug);
  
  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} - DelightStore`,
    description: `Browse our collection of ${category.name.toLowerCase()} at DelightStore. ${category.products.length} ${category.products.length === 1 ? 'product' : 'products'} available.`,
  };
}

interface CategoryPageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SearchBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600 transition flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-primary-600 transition">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600 text-lg">
            {category.products.length} {category.products.length === 1 ? "product" : "products"} available
          </p>
        </div>

        {/* Products Grid */}
        {category.products.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {category.products.length} {category.products.length === 1 ? 'product' : 'products'} in {category.name}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="max-w-md mx-auto">
              <p className="text-gray-500 text-lg mb-4">No products in this category yet.</p>
              <p className="text-gray-400 mb-6">Check back soon for new products in this category!</p>
              <div className="flex gap-4 justify-center">
                <Link href="/products">
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition">
                    Browse All Products
                  </button>
                </Link>
                <Link href="/">
                  <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
