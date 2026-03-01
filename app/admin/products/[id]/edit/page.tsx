"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "@/components/ui/loading";
import { Category } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";

async function getCategories() {
  const res = await fetch("/api/categories");
  return res.json();
}

async function getProduct(id: string) {
  const res = await fetch(`/api/admin/products/${id}`);
  return res.json();
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: [] as string[],
  });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getProduct(productId)])
      .then(([categoriesData, productData]) => {
        setCategories(categoriesData.categories || []);
        if (productData.product) {
          const product = productData.product;
          setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price.toString(),
            stock: product.stock.toString(),
            categoryId: product.categoryId,
            images: product.images || [],
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        toast.error("Failed to load product data");
        setLoading(false);
      });
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: formData.images,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
        <main className="flex-1 container mx-auto px-4 py-12 text-white">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  return (
    <AdminShell title="Edit Product" subtitle="Refine product details with premium controls.">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/70 bg-white/80 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Product Name *
            </label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-slate-200/70 bg-white text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400/60 dark:border-white/10 dark:bg-white/10 dark:text-white"
              rows={4}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Price (TZS) *
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border-slate-200/70 bg-white text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/10 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Stock *
              </label>
              <Input
                id="stock"
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="border-slate-200/70 bg-white text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/10 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Category *
            </label>
            <select
              id="categoryId"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full rounded-xl border border-slate-200/70 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Images *
            </label>
            <div
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                const files = Array.from(event.dataTransfer.files);
                const urls = files.map((file) => URL.createObjectURL(file));
                setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
              }}
              className={`flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center text-sm transition ${
                dragActive
                  ? "border-emerald-400/70 bg-emerald-500/10"
                  : "border-slate-200/70 bg-white/70 dark:border-white/20 dark:bg-white/5"
              }`}
            >
              <p className="text-slate-700 dark:text-slate-200">Drag & drop images here</p>
              <p className="mt-1 text-xs text-slate-400">or paste public image URLs below</p>
            </div>
            <div className="mt-3 space-y-2">
              <Input
                placeholder="/products/products (1).jpg"
                value={formData.images.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    images: e.target.value.split(",").map((img) => img.trim()).filter(Boolean),
                  })
                }
                className="border-slate-200/70 bg-white text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/10 dark:text-white"
              />
              <p className="text-xs text-slate-400">
                Use comma-separated paths or URLs. Drag-and-drop previews do not upload files.
              </p>
            </div>
            {formData.images.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {formData.images.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50 dark:border-white/10 dark:bg-white/5"
                  >
                    <img src={img} alt="Preview" className="h-24 w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex gap-4 pt-2">
            <Button type="submit" disabled={saving} className="flex-1 bg-emerald-500/80 text-white hover:bg-emerald-500">
              {saving ? <LoadingSpinner size="sm" /> : "Update Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
