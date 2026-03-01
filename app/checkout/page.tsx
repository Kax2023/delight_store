"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useCartStore } from "@/store/cart-store";
import { useGuestStore } from "@/store/guest-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegionSelect } from "@/components/checkout/region-select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "@/components/ui/loading";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const guestSession = useGuestStore((state) => state.session);
  const isGuestSessionValid = useGuestStore((state) => state.isSessionValid);
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const [loading, setLoading] = useState(false);
  const isGuest = !session && isGuestSessionValid();
  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("clickpesa");
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || guestSession?.guestName || "",
    email: session?.user?.email || guestSession?.guestEmail || "",
    phoneNumber: "",
    region: "",
    shippingAddress: "",
  });

  const total = getTotal();

  // Validate shipping step: all required fields filled (guests: name, email, phone, address; users: phone, address)
  const isShippingValid = () => {
    const phone = formData.phoneNumber?.trim();
    const region = formData.region?.trim();
    const address = formData.shippingAddress?.trim();
    if (!phone || !region || !address) return false;
    if (isGuest) {
      const name = formData.name?.trim();
      const email = formData.email?.trim();
      if (!name || !email) return false;
    }
    return true;
  };

  const handleContinueFromShipping = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isShippingValid()) {
      toast.error("Please fill in all required fields (phone number, region, and shipping address" + (isGuest ? ", name and email" : "") + ") before continuing.");
      return;
    }
    setMaxStepReached((prev) => Math.max(prev, 2));
    setStep(2);
  };

  const handleContinueToPayment = (e: React.MouseEvent) => {
    e.preventDefault();
    setMaxStepReached((prev) => Math.max(prev, 3));
    setStep(3);
  };

  useEffect(() => {
    // Redirect to login if neither session nor valid guest session
    if (!session && !isGuestSessionValid()) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      router.push("/cart");
      return;
    }
  }, [session, isGuestSessionValid, items.length, router]);

  if (!session && !isGuestSessionValid()) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isShippingValid()) {
      toast.error("Please complete Shipping Information first.");
      setStep(1);
      return;
    }
    setLoading(true);

    try {
      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: formData.shippingAddress,
          phoneNumber: formData.phoneNumber,
          region: formData.region,
          ...(isGuest && {
            guestEmail: formData.email,
            guestName: formData.name,
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Redirect to payment
      router.push(`/checkout/payment?orderId=${data.order.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to process checkout");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-3 py-6 sm:px-4 sm:py-10">
        <h1 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white sm:text-3xl sm:mb-6">
          Checkout
        </h1>
        <div className="mb-6 flex flex-wrap gap-2 sm:mb-8 sm:gap-3">
          {[
            { id: 1, label: "Shipping", minReached: 1 },
            { id: 2, label: "Review", minReached: 2 },
            { id: 3, label: "Payment", minReached: 3 },
          ].map((stepItem) => {
            const canGo = maxStepReached >= stepItem.minReached;
            return (
              <button
                key={stepItem.id}
                type="button"
                onClick={() => canGo && setStep(stepItem.id)}
                disabled={!canGo}
                className={`min-h-11 min-w-11 rounded-full px-4 py-2.5 text-xs font-semibold transition touch-manipulation sm:min-h-0 sm:min-w-0 ${
                  step === stepItem.id
                    ? "bg-emerald-500/90 text-white"
                    : canGo
                      ? "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                      : "cursor-not-allowed border border-slate-200 text-slate-400 opacity-60 dark:border-white/10 dark:text-slate-500"
                }`}
              >
                {stepItem.label}
              </button>
            );
          })}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              {step === 1 && (
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-md dark:border-white/10 dark:bg-white/5 sm:rounded-3xl sm:p-6">
                  <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white sm:text-xl">
                    Shipping Information
                  </h2>
                  {isGuest && (
                    <div className="mb-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200 sm:rounded-2xl">
                      You're checking out as a guest. You can create an account after your purchase for faster future checkouts.
                    </div>
                  )}
                  <div className="space-y-4">
                    {isGuest && (
                      <>
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                            Full Name
                          </label>
                          <Input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Full Name"
                            className="min-h-11 sm:min-h-10"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="min-h-11 sm:min-h-10"
                          />
                          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                            We'll send your order confirmation to this email
                          </p>
                        </div>
                      </>
                    )}
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                        Phone Number
                      </label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+255 XXX XXX XXX"
                        className="min-h-11 sm:min-h-10"
                      />
                    </div>
                    <div>
                      <label id="region-label" htmlFor="region" className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                        Select Region
                      </label>
                      <RegionSelect
                        id="region"
                        required
                        value={formData.region}
                        onChange={(region) => setFormData({ ...formData, region })}
                        aria-label="Select your region in Tanzania"
                      />
                    </div>
                    <div>
                      <label htmlFor="shippingAddress" className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                        Shipping Address
                      </label>
                      <textarea
                        id="shippingAddress"
                        required
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                        placeholder="Enter your full shipping address"
                        className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/10 sm:rounded-2xl sm:min-h-[100px]"
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      onClick={handleContinueFromShipping}
                      className="w-full min-h-12 bg-emerald-500/90 text-white hover:bg-emerald-500 sm:min-h-10 sm:w-auto sm:px-8"
                    >
                      Continue to Review
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-md dark:border-white/10 dark:bg-white/5 sm:rounded-3xl sm:p-6">
                  <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white sm:text-xl sm:mb-4">
                    Review Order
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Confirm your items before choosing payment.
                  </p>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-1 py-3 border-b border-slate-200/70 last:border-0 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:py-2"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white line-clamp-2 sm:line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white shrink-0 sm:text-base">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="min-h-12 w-full border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 sm:min-h-10 sm:w-auto"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleContinueToPayment}
                      className="min-h-12 w-full bg-emerald-500/90 text-white hover:bg-emerald-500 sm:min-h-10 sm:w-auto"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-md dark:border-white/10 dark:bg-white/5 sm:rounded-3xl sm:p-6">
                  <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white sm:text-xl">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5 sm:rounded-2xl">
                      <input
                        type="radio"
                        checked={paymentMethod === "clickpesa"}
                        onChange={() => setPaymentMethod("clickpesa")}
                        className="mt-1 h-5 w-5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          ClickPesa
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Mobile money (M-Pesa, Tigo Pesa, Airtel Money, Halopesa) & card payments in TZS.
                        </p>
                      </div>
                    </label>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="min-h-12 w-full border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 sm:min-h-10 sm:w-auto"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="min-h-12 w-full bg-emerald-500/90 text-white hover:bg-emerald-500 sm:min-h-10 sm:w-auto"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : "Confirm & Pay with ClickPesa"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-4 dark:border-white/10 dark:bg-slate-800 sm:rounded-3xl sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white sm:text-xl">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-4 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-600">Free</span>
                  </div>
                  <div className="border-t border-slate-200/70 pt-2 flex justify-between font-bold text-slate-900 dark:text-white dark:border-white/10 sm:text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Payment via {paymentMethod === "clickpesa" ? "ClickPesa (Mobile Money & Card)" : "Selected method"}
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
