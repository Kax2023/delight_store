import { Header } from "@/components/layout/header";
import { SearchBar } from "@/components/layout/search-bar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/products/product-card";
import { prisma } from "@/lib/db";
import { FiltersDrawer } from "@/components/products/filters-drawer";
import { Pagination } from "@/components/ui/pagination";
import { getPseudoRating } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getProducts(searchParams: {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  availability?: string;
}) {
  try {
    const where: any = {};
    
    if (searchParams.category) {
      where.category = {
        slug: searchParams.category,
      };
    }
    
    if (searchParams.search) {
      where.OR = [
        { name: { contains: searchParams.search, mode: "insensitive" } },
        { description: { contains: searchParams.search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = { createdAt: "desc" };
    if (searchParams.sort === "price-asc") {
      orderBy.price = "asc";
    } else if (searchParams.sort === "price-desc") {
      orderBy.price = "desc";
    } else if (searchParams.sort === "name") {
      orderBy.name = "asc";
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    });

    let filtered = products;

    if (searchParams.minPrice) {
      const min = Number(searchParams.minPrice);
      filtered = filtered.filter((product) => product.price >= min);
    }

    if (searchParams.maxPrice) {
      const max = Number(searchParams.maxPrice);
      filtered = filtered.filter((product) => product.price <= max);
    }

    if (searchParams.availability === "in-stock") {
      filtered = filtered.filter((product) => product.stock > 0);
    } else if (searchParams.availability === "limited") {
      filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 5);
    }

    if (searchParams.rating) {
      const minRating = Number(searchParams.rating);
      filtered = filtered.filter((product) => getPseudoRating(product.id) >= minRating);
    }

    return filtered;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    availability?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolved = await searchParams;
  const products = await getProducts(resolved);
  const categories = await getCategories();
  const page = Number(resolved.page || "1");
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SearchBar />
      <main className="flex-1 container mx-auto px-4 pt-4 pb-10">
        <div className="mb-6 overflow-x-auto -mx-4 px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="flex items-center gap-2 min-w-max">
            {/* Filter button first */}
            <div className="shrink-0">
              <FiltersDrawer categories={categories} currentCategory={resolved.category} />
            </div>
            <Link href="/products" className="shrink-0">
              <Button
                variant={!resolved.category ? "default" : "outline"}
                size="sm"
                className={
                  !resolved.category
                    ? "bg-emerald-500/90 text-white hover:bg-emerald-500 whitespace-nowrap"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100 whitespace-nowrap"
                }
              >
                All
              </Button>
            </Link>
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`} className="shrink-0">
                <Button
                  variant={resolved.category === category.slug ? "default" : "outline"}
                  size="sm"
                  className={
                    resolved.category === category.slug
                      ? "bg-emerald-500/90 text-white hover:bg-emerald-500 whitespace-nowrap"
                      : "border-slate-300 text-slate-700 hover:bg-slate-100 whitespace-nowrap"
                  }
                >
                  {category.name}
                </Button>
              </Link>
            ))}
            <Link href="/products?category=men" className="shrink-0">
              <Button
                variant={resolved.category === "men" ? "default" : "outline"}
                size="sm"
                className={
                  resolved.category === "men"
                    ? "bg-emerald-500/90 text-white hover:bg-emerald-500 whitespace-nowrap"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100 whitespace-nowrap"
                }
              >
                Men
              </Button>
            </Link>
            <Link href="/products?category=women" className="shrink-0">
              <Button
                variant={resolved.category === "women" ? "default" : "outline"}
                size="sm"
                className={
                  resolved.category === "women"
                    ? "bg-emerald-500/90 text-white hover:bg-emerald-500 whitespace-nowrap"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100 whitespace-nowrap"
                }
              >
                Women
              </Button>
            </Link>
          </div>
        </div>

        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No products found.</p>
            <p className="text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
