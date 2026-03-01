import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";
import { FeedbackSection } from "@/components/about/feedback-section";
import { 
  ShoppingBag, 
  Shield, 
  Truck, 
  Heart, 
  Target, 
  Award,
  Users,
  Globe,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about DelightStore - Your trusted source for smart watches, gadgets, speakers, and mobile accessories in Tanzania.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
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
                Premium Tech Store
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">
                About DelightStore
              </h1>
              <p className="mt-4 text-lg text-slate-200 md:text-xl">
                Your trusted destination for luxury tech essentials in Tanzania.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">Our Story</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
              </div>
              
              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  Welcome to <strong>DelightStore</strong> - Tanzania's premier destination for cutting-edge technology and innovative gadgets. 
                  Founded with a vision to bring the latest smart technology to every household in Tanzania, we are committed to providing 
                  quality products that enhance your daily life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Mission */}
              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur transition hover:shadow-md">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-emerald-600 mr-3" />
                  <h3 className="text-2xl font-semibold text-slate-900">Our Mission</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  To provide Tanzanians with access to premium technology products at affordable prices, backed by exceptional customer 
                  service and reliable after-sales support. We strive to make technology accessible to everyone, empowering individuals 
                  and businesses to embrace digital innovation.
                </p>
              </div>

              {/* Vision */}
              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur transition hover:shadow-md">
                <div className="flex items-center mb-4">
                  <Globe className="h-8 w-8 text-gold-500 mr-3" />
                  <h3 className="text-2xl font-semibold text-slate-900">Our Vision</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  To become Tanzania's most trusted and recognized technology retailer, known for our commitment to quality, innovation, 
                  and customer satisfaction. We envision a future where every Tanzanian has access to the technology they need to thrive 
                  in the digital age.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">Our Core Values</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
                <p className="text-slate-600 mt-4">The principles that guide everything we do</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur transition hover:shadow-md">
                  <Shield className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Quality</h4>
                  <p className="text-slate-600 text-sm">
                    We ensure every product meets the highest standards of quality and reliability.
                  </p>
                </div>

                <div className="text-center p-6 rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur transition hover:shadow-md">
                  <Heart className="h-12 w-12 text-gold-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Customer First</h4>
                  <p className="text-slate-600 text-sm">
                    Your satisfaction is our priority. We're here to help you find exactly what you need.
                  </p>
                </div>

                <div className="text-center p-6 rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur transition hover:shadow-md">
                  <Award className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Excellence</h4>
                  <p className="text-slate-600 text-sm">
                    We strive for excellence in every aspect of our service and product offerings.
                  </p>
                </div>

                <div className="text-center p-6 rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur transition hover:shadow-md">
                  <Users className="h-12 w-12 text-gold-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Community</h4>
                  <p className="text-slate-600 text-sm">
                    We're committed to building a strong community of tech enthusiasts in Tanzania.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">Why Choose DelightStore?</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <ShoppingBag className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Wide Selection</h4>
                  <p className="text-slate-600 text-sm">
                    Browse through hundreds of carefully selected products across multiple categories.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <Shield className="h-10 w-10 text-gold-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Authentic Products</h4>
                  <p className="text-slate-600 text-sm">
                    All our products are genuine and come with manufacturer warranties.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <Truck className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Fast Delivery</h4>
                  <p className="text-slate-600 text-sm">
                    Quick and reliable delivery service throughout Tanzania.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <Heart className="h-10 w-10 text-gold-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Customer Support</h4>
                  <p className="text-slate-600 text-sm">
                    Dedicated support team ready to assist you with any questions or concerns.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <Award className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Best Prices</h4>
                  <p className="text-slate-600 text-sm">
                    Competitive pricing without compromising on quality or service.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:shadow-md">
                  <Phone className="h-10 w-10 text-gold-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-slate-900">Easy Returns</h4>
                  <p className="text-slate-600 text-sm">
                    Hassle-free return and exchange policy for your peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">Get In Touch</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
                <p className="text-slate-600 mt-4">
                  Have questions? We'd love to hear from you. Reach out to us anytime!
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur">
                  <Mail className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Email Us</h4>
                  <a 
                    href="mailto:info@delightstore.tz" 
                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    info@delightstore.tz
                  </a>
                </div>

                <div className="text-center p-6 rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur">
                  <Phone className="h-8 w-8 text-gold-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <a 
                    href="tel:+255765422272" 
                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    +255 765 422 272
                  </a>
                </div>

                <div className="text-center p-6 rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur">
                  <MapPin className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Kariakoo Uhuru Plaza<br />
                    Uhuru & Msimbazi Street<br />
                    Dar es Salaam, Tanzania
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeedbackSection />

        {/* Call to Action */}
        <section className="relative overflow-hidden py-16 bg-navy-900 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(245,197,66,0.12),_transparent_45%)]" />
          <div className="container relative mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold mb-4">Ready to Explore Our Products?</h2>
            <p className="text-slate-200 mb-8 text-lg max-w-2xl mx-auto">
              Discover our wide range of smart watches, gadgets, speakers, and mobile accessories today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="bg-emerald-500/90 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-500 transition"
              >
                Shop Now
              </a>
              <a
                href="/contact"
                className="border border-white/25 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
