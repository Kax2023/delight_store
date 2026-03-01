"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

type FeedbackItem = {
  id: string;
  name: string;
  comment: string;
  images: string[];
  createdAt: string;
};

const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 1_500_000; // ~1.5MB per image

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export function FeedbackSection() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [imageDataUrls, setImageDataUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchFeedback = async () => {
    try {
      const res = await fetch("/api/feedback");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [items]);

  const onPickImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const existing = imageDataUrls.length;
    const allowedCount = Math.max(0, MAX_IMAGES - existing);

    const picked = Array.from(files).slice(0, allowedCount);
    if (picked.length < files.length) {
      toast.error(`You can upload up to ${MAX_IMAGES} images.`);
    }

    const tooBig = picked.find((f) => f.size > MAX_IMAGE_BYTES);
    if (tooBig) {
      toast.error("One of the images is too large. Please choose a smaller image.");
      return;
    }

    try {
      const urls = await Promise.all(picked.map(readFileAsDataUrl));
      setImageDataUrls((prev) => [...prev, ...urls]);
    } catch {
      toast.error("Failed to read one of the images.");
    }
  };

  const removeImage = (idx: number) => {
    setImageDataUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    const cleanComment = comment.trim();

    if (cleanComment.length < 3) {
      toast.error("Please write a longer comment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: cleanComment,
          images: imageDataUrls,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Failed to submit feedback.");
        return;
      }
      toast.success("Thanks for your feedback!");
      setComment("");
      setImageDataUrls([]);
      await fetchFeedback();
    } catch {
      toast.error("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const isLoggedIn = status === "authenticated" && !!session;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">Customer Feedback</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
            <p className="text-slate-600 mt-4">
              Share your experience with DelightStore. Registered customers can post feedback; everyone can view reviews below.
            </p>
          </div>

          {/* Form - only for logged-in users */}
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 md:p-8 shadow-sm backdrop-blur">
            {!isLoggedIn ? (
              <div className="text-center py-6">
                <p className="text-slate-600 mb-4">
                  Please log in to submit feedback.
                </p>
                <Link href="/login?redirect=/about">
                  <Button className="rounded-full px-6 py-3 font-semibold">
                    Log In to Post Feedback
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-600 mb-2">
                      Posting as <span className="font-medium text-slate-800">{session?.user?.name || session?.user?.email}</span>
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Photos</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => void onPickImages(e.target.files)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        toast("Up to 3 images, ~1.5MB each.");
                        fileInputRef.current?.click();
                      }}
                      className="w-full rounded-2xl border-slate-200/70 bg-white/70 py-3 text-slate-700 hover:bg-slate-50"
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>

                {imageDataUrls.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-700 mb-3">Selected photos</p>
                    <div className="flex flex-wrap gap-3">
                      {imageDataUrls.map((src, idx) => (
                        <div key={src} className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50">
                          <img src={src} alt="Selected" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white hover:bg-black/75"
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your feedback..."
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="rounded-full px-6 py-3 font-semibold"
                  >
                    Submit Feedback
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Cards - visible to all (guests and logged-in) */}
          <div className="mt-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Recent Reviews</h3>
              <span className="text-xs text-slate-500">{sorted.length} total</span>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-8 text-center text-sm text-slate-600">
                Loading reviews...
              </div>
            ) : sorted.length === 0 ? (
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-8 text-center text-sm text-slate-600">
                No reviews yet. Be the first to leave feedback (log in to post).
              </div>
            ) : (
              <div className="-mx-4 snap-x snap-mandatory overflow-x-auto overflow-y-hidden px-4 scroll-smooth scrollbar-hide sm:mx-0 sm:snap-none sm:overflow-visible sm:px-0">
                <div className="flex gap-4 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {sorted.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[280px] shrink-0 snap-start rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:shadow-md sm:min-w-0 sm:snap-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 font-semibold">
                          {item.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-700">
                        Review
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {item.comment}
                    </p>

                    {item.images?.length ? (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {item.images.slice(0, 3).map((src) => (
                          <div key={src} className="aspect-square overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50">
                            <img src={src} alt="Review" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
