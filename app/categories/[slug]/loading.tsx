import { Header } from "@/components/layout/header";
import { SearchBar } from "@/components/layout/search-bar";
import { Footer } from "@/components/layout/footer";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";

export default function CategoryLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SearchBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb placeholder */}
        <div className="mb-6 flex items-center gap-2">
          <div className="skeleton-shimmer h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="skeleton-shimmer h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="skeleton-shimmer h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="skeleton-shimmer h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="skeleton-shimmer h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        {/* Category header placeholder */}
        <div className="mb-8">
          <div className="skeleton-shimmer mb-2 h-9 w-48 rounded bg-slate-200 dark:bg-slate-700 sm:h-10 sm:w-64" />
          <div className="skeleton-shimmer h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <ProductGridSkeleton count={12} slowMessageAfterMs={5000} />
      </main>
      <Footer />
    </div>
  );
}
