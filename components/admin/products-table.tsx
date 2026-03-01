"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";

type ProductRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  category: { name: string };
};

type ProductsTableProps = {
  initialProducts: ProductRow[];
};

export function ProductsTable({ initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "" });
  const [saving, setSaving] = useState(false);

  const startEdit = (product: ProductRow) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", stock: "" });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? { ...product, ...payload, price: Number(formData.price), stock: Number(formData.stock) }
            : product
        )
      );
      toast.success("Product updated");
      cancelEdit();
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
            <tr>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
            {products.map((product) => {
              const isEditing = editingId === product.id;
              return (
                <tr
                  key={product.id}
                  className="group transition hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/10">
                        <Image
                          src={product.images?.[0] || "/products/products (1).jpg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {isEditing ? (
                        <input
                          value={formData.name}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, name: event.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
                        />
                      ) : (
                        <span className="font-semibold text-slate-900 dark:text-white">{product.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-300">{product.category.name}</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, price: event.target.value }))
                        }
                        className="w-28 rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
                      />
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-200">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, stock: event.target.value }))
                        }
                        className="w-20 rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
                      />
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-200">
                        {product.stock} units
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(product.id)}
                          disabled={saving}
                          className="rounded-full bg-emerald-500/80 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(product)}
                        className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
