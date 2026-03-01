"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { useGuestStore } from "@/store/guest-store";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "@/components/ui/loading";

export default function PaymentConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const guestSession = useGuestStore((state) => state.session);
  const clearGuestSession = useGuestStore((state) => state.clearGuestSession);
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: guestSession?.guestName || "",
    email: guestSession?.guestEmail || "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // ClickPesa may send orderReference; legacy param order_id also supported
    const orderIdParam =
      searchParams.get("orderReference") ||
      searchParams.get("order_id") ||
      searchParams.get("orderId");

    if (!orderIdParam) {
      setStatus("failed");
      return;
    }

    setOrderId(orderIdParam);

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payments/verify?orderId=${encodeURIComponent(orderIdParam)}`);
        const data = await response.json();

        if (data.status === "COMPLETED") {
          setStatus("success");
          if (!session && guestSession?.isGuest) {
            setShowCreateAccount(true);
          }
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams, session, guestSession]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <LoadingPage />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {status === "success" ? (
            <>
              <CheckCircle className="h-24 w-24 text-emerald-500 mx-auto mb-6" />
              <h1 className="text-3xl font-semibold mb-4 text-emerald-500">Payment Successful!</h1>
              <p className="text-slate-600 mb-6">
                Thank you for your order. Your payment has been processed successfully.
              </p>
              {orderId && (
                <p className="text-sm text-slate-500 mb-8">
                  Order ID: <span className="font-mono">{orderId}</span>
                </p>
              )}

              {/* Account Creation Prompt for Guests */}
              {showCreateAccount && !session && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 mb-6 text-left max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2 text-emerald-900">
                    Create an Account for Faster Checkouts
                  </h3>
                  <p className="text-sm text-emerald-800 mb-4">
                    Save your information and track your orders easily. It only takes a minute!
                  </p>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (accountForm.password !== accountForm.confirmPassword) {
                        toast.error("Passwords do not match");
                        return;
                      }
                      if (accountForm.password.length < 6) {
                        toast.error("Password must be at least 6 characters");
                        return;
                      }
                      setCreatingAccount(true);
                      try {
                        const response = await fetch("/api/auth/register", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: accountForm.name,
                            email: accountForm.email,
                            password: accountForm.password,
                          }),
                        });
                        const data = await response.json();
                        if (!response.ok) {
                          throw new Error(data.error || "Registration failed");
                        }
                        toast.success("Account created! Please sign in.");
                        clearGuestSession();
                        router.push("/login");
                      } catch (error: any) {
                        toast.error(error.message || "Failed to create account");
                      } finally {
                        setCreatingAccount(false);
                      }
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={accountForm.name}
                        onChange={(e) =>
                          setAccountForm({ ...accountForm, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={accountForm.email}
                        onChange={(e) =>
                          setAccountForm({ ...accountForm, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={accountForm.password}
                        onChange={(e) =>
                          setAccountForm({ ...accountForm, password: e.target.value })
                        }
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={accountForm.confirmPassword}
                        onChange={(e) =>
                          setAccountForm({ ...accountForm, confirmPassword: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={creatingAccount}
                      >
                        {creatingAccount ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateAccount(false)}
                      >
                        Maybe Later
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                {session ? (
                  <Link href="/orders">
                    <Button className="bg-emerald-500/90 text-white hover:bg-emerald-500">View Orders</Button>
                  </Link>
                ) : null}
                <Link href="/products">
                  <Button variant="outline" className="border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-semibold mb-4 text-red-500">Payment Failed</h1>
              <p className="text-slate-600 mb-6">
                We couldn't process your payment. Please try again or contact support if the problem persists.
              </p>
              {orderId && (
                <p className="text-sm text-slate-500 mb-8">
                  Order ID: <span className="font-mono">{orderId}</span>
                </p>
              )}
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
