import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
  }).format(price)
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export function getPseudoRating(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const normalized = Math.abs(hash % 40) / 10
  return Math.max(3.6, Math.min(4.9, 3.6 + normalized))
}

export function getProductBadges(stock: number, createdAt?: Date) {
  const badges: string[] = []
  if (createdAt) {
    const isNew = Date.now() - createdAt.getTime() < 1000 * 60 * 60 * 24 * 14
    if (isNew) badges.push("New")
  }
  if (stock > 0 && stock <= 5) badges.push("Limited Stock")
  if (stock > 15) badges.push("Best Seller")
  return badges
}
