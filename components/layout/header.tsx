"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-32">
              <Image
                src="/logo/header.png"
                alt="DelightStore"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600">
              Home
            </Link>
            <Link href="/products" className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600">
              Products
            </Link>
            <Link href="/about" className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600">
              Contact Us
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={() => setCartOpen(true)} className="relative">
              <ShoppingCart className="h-5 w-5 text-slate-700" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {!mounted ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button size="sm" className="rounded-full px-6">
                    LogIn
                  </Button>
                </Link>
              </div>
            ) : session ? (
              <>
                {/* Mobile: Show username/account */}
                <Link href="/dashboard" className="md:hidden flex items-center space-x-1.5 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-slate-100">
                  <LayoutDashboard className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700 max-w-[80px] truncate">
                    Dashboard
                  </span>
                </Link>
                {/* Desktop: Show full username/account */}
                <div className="hidden md:flex items-center space-x-4">
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard" className="flex items-center space-x-2 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-slate-100">
                  <LayoutDashboard className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">Dashboard</span>
                </Link>
                <Link href="/account" className="flex items-center space-x-2 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-slate-100">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">{session.user.name || session.user.email}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()} className="border-slate-300 text-slate-700">
                  Sign Out
                </Button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button size="sm" className="rounded-full px-6">
                    LogIn
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu (animated) */}
        <div
          className={[
            "md:hidden overflow-hidden border-t border-white/10",
            "transition-[max-height,opacity,transform] duration-300 ease-out",
            mobileMenuOpen ? "max-h-[520px] opacity-100 translate-y-0 py-4" : "max-h-0 opacity-0 -translate-y-1 py-0",
          ].join(" ")}
          aria-hidden={!mobileMenuOpen}
        >
          <nav className="flex flex-col items-center space-y-3 text-center">
              <Link
                href="/"
                className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              {!mounted ? (
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  LogIn
                </Link>
              ) : session ? (
                <>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  LogIn
                </Link>
              )}
          </nav>
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
