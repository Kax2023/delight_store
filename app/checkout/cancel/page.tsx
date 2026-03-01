import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <XCircle className="h-24 w-24 text-orange-500 mx-auto mb-6" />
          <h1 className="text-3xl font-semibold mb-4 text-orange-500">Payment Cancelled</h1>
          <p className="text-slate-600 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/checkout">
              <Button className="bg-emerald-500/90 text-white hover:bg-emerald-500">Try Again</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
