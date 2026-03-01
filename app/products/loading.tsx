import { Header } from "@/components/layout/header";
import { SearchBar } from "@/components/layout/search-bar";
import { Footer } from "@/components/layout/footer";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";

export default function ProductsLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SearchBar />
      <main className="flex-1 container mx-auto px-4 pt-4 pb-10">
        {/* Filter bar placeholder - reserves space to avoid layout shift */}
        <div className="mb-6 overflow-x-auto -mx-4 px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="flex items-center gap-2 min-w-max">
            <div className="skeleton-shimmer h-9 w-20 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="skeleton-shimmer h-9 w-14 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="skeleton-shimmer h-9 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="skeleton-shimmer h-9 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="skeleton-shimmer h-9 w-14 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
          </div>
        </div>

        <ProductGridSkeleton count={12} slowMessageAfterMs={5000} />
      </main>
      <Footer />
    </div>
  );
}
