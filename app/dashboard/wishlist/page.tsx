import { WishlistSection } from "@/components/dashboard/wishlist-section";

export default function DashboardWishlistPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Wishlist & saved items
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Items you’ve saved for later. Add or remove anytime.
        </p>
      </div>

      <WishlistSection />
    </div>
  );
}
