import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock
} from "lucide-react";
import { SendMessageForm } from "@/components/contact/send-message-form";
import { WhatsAppFloat } from "@/components/contact/whatsapp-float";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with DelightStore - Your trusted source for smart watches, gadgets, speakers, and mobile accessories in Tanzania.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <WhatsAppFloat />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-navy-900 py-20 text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(245,197,66,0.14),_transparent_45%)]" />
          </div>
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold-200 backdrop-blur">
                Support & Inquiries
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">
                Contact Us
              </h1>
              <p className="mt-4 text-lg text-slate-200 md:text-xl">
                We're here to help. Reach out anytime and we’ll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">Get In Touch</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
                <p className="text-slate-600 mt-4">
                  Choose the best way to reach us. We're always ready to assist you!
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {/* Email */}
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <div className="bg-emerald-500/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">Email Us</h3>
                  <p className="text-sm text-slate-600 mb-3">Send us an email anytime</p>
                  <a 
                    href="mailto:info@delightstore.tz" 
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm break-all"
                  >
                    info@delightstore.tz
                  </a>
                </div>

                {/* Phone/WhatsApp */}
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <div className="bg-gold-500/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-gold-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">WhatsApp</h3>
                  <p className="text-sm text-slate-600 mb-3">Chat with us on WhatsApp</p>
                  <a 
                    href="https://wa.me/255765422272" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    +255 765 422 272
                  </a>
                </div>

                {/* Location */}
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <div className="bg-emerald-500/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">Location</h3>
                  <p className="text-sm text-slate-600 mb-3">Visit us at</p>
                  <p className="text-slate-700 font-medium text-xs leading-tight">
                    Kariakoo Uhuru Plaza<br />
                    Uhuru & Msimbazi Street<br />
                    Dar es Salaam, Tanzania
                  </p>
                </div>

                {/* Business Hours */}
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <div className="bg-gold-500/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-gold-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">Business Hours</h3>
                  <p className="text-sm text-slate-600 mb-3">We're available</p>
                  <p className="text-slate-700 font-medium text-sm">Mon - Sat: 9AM - 6PM</p>
                  <p className="text-slate-700 font-medium text-sm">Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">Send Us a Message</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
                <p className="text-slate-600 mt-4">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur md:p-12">
                <SendMessageForm />
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">Follow Us</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
                <p className="text-slate-600 mt-4">
                  Stay connected with us on social media for the latest updates and offers!
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <a
                  href="https://www.tiktok.com/@delight_store_tz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-900">TikTok</span>
                  <span className="text-xs text-slate-500">@delight_store_tz</span>
                </a>
                <a
                  href="https://www.instagram.com/delight_store_tz_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white">
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-900">Instagram</span>
                  <span className="text-xs text-slate-500">@delight_store_tz_</span>
                </a>
                <a
                  href="https://wa.me/255765422272"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white">
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-900">WhatsApp</span>
                  <span className="text-xs text-slate-500">+255 765 422 272</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">Frequently Asked Questions</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">How can I place an order?</h3>
                  <p className="text-slate-600">
                    You can browse our products online and add them to your cart. Once you're ready, proceed to checkout and complete your purchase. You can also contact us via WhatsApp or email for assistance.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">What are your delivery options?</h3>
                  <p className="text-slate-600">
                    We offer fast and reliable delivery throughout Tanzania. Delivery times and costs may vary depending on your location. Contact us for specific delivery information for your area.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Do you offer product warranties?</h3>
                  <p className="text-slate-600">
                    Yes! All our products come with manufacturer warranties. The warranty period varies by product. Please check the product details or contact us for more information.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Can I return or exchange a product?</h3>
                  <p className="text-slate-600">
                    We have a hassle-free return and exchange policy. If you're not satisfied with your purchase, please contact us within the specified return period. Terms and conditions apply.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">What payment methods do you accept?</h3>
                  <p className="text-slate-600">
                    We accept various payment methods including mobile money, bank transfers, and cash on delivery (where available). Contact us for more details about payment options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
