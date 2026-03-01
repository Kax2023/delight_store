"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoadingPage } from "@/components/ui/loading";
import { toast } from "react-hot-toast";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }

    // Initiate payment with ClickPesa
    const initiatePayment = async () => {
      try {
        const response = await fetch("/api/payments/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to initiate payment");
        }

        // Redirect to ClickPesa checkout page
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error("No checkout URL received");
        }
      } catch (error: any) {
        console.error("Payment initiation error:", error);
        setError(error.message || "Failed to initiate payment");
        setLoading(false);
        toast.error(error.message || "Failed to initiate payment");
      }
    };

    initiatePayment();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <LoadingPage />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4 text-red-500">Payment Error</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/checkout")}
            className="px-6 py-2 bg-emerald-500/90 text-white rounded-md hover:bg-emerald-500"
          >
            Go Back to Checkout
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
}
