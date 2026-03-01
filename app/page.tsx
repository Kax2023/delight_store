import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { SearchBar } from "@/components/layout/search-bar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { FeaturedCarousel } from "@/components/home/featured-carousel";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 8,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SearchBar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-navy-900 text-white">
          <div className="absolute inset-0">
            <Image
              src="/products/products (10).JPG"
              alt="Premium tech collection"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-transparent" />
          </div>
          <div className="container mx-auto px-4 py-24 relative">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold-200">
                Premium Tech Store
              </span>
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                Elevate Your Lifestyle with Luxury Tech Essentials
              </h1>
              <p className="text-lg text-slate-200">
                Discover smart watches, elite gadgets, premium speakers, and mobile accessories curated for Tanzania’s finest taste in technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-emerald-500/90 text-white hover:bg-emerald-500">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Explore Brand Story
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                { title: "Fast Delivery", description: "Premium door-step delivery across Tanzania." },
                { title: "Luxury Support", description: "Concierge-level assistance for every purchase." },
                { title: "Authentic Gear", description: "Guaranteed genuine products with warranty." },
              ].map((perk) => (
                <div key={perk.title} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold">{perk.title}</p>
                  <p className="mt-2 text-xs text-slate-300">{perk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Smart Watches", slug: "smart-watches", image: "/products/products (1).jpg" },
                { name: "Gadgets", slug: "gadgets", image: "/products/products (10).JPG" },
                { name: "Speakers", slug: "speakers", image: "/products/products (20).JPG" },
                { name: "Mobile Accessories", slug: "mobile-accessories", image: "/products/products (30).JPG" },
                { name: "Men", slug: "men", image: "/products/products (1).jpg" },
                { name: "Women", slug: "women", image: "/products/products (10).JPG" },
              ].map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/60 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-64">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center px-2">
                      <h3 className="text-lg sm:text-2xl font-bold text-white text-center leading-tight">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center gap-6 mb-8">
              <h2 className="text-3xl font-semibold text-slate-900">Featured Products</h2>
              <Link href="/products">
                <Button className="rounded-full bg-emerald-500/90 px-8 py-3 text-white font-semibold hover:bg-emerald-500 transition-colors shadow-md hover:shadow-lg">
                  View All Products
                </Button>
              </Link>
            </div>
            {featuredProducts.length > 0 ? (
              <FeaturedCarousel products={featuredProducts} />
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-3xl">
                <p className="text-slate-500 text-lg mb-2">No products available yet.</p>
                <p className="text-slate-400">Check back soon for our latest products!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
