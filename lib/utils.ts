import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// Calculate budget score (lower budget = higher score)
export function calculateBudgetScore(budget: number): number {
  if (budget <= 0) return 10
  if (budget <= 2000) return 10
  if (budget <= 5000) return 10 - ((budget - 2000) / 3000) * 2 // 10 à 8
  if (budget <= 10000) return 8 - ((budget - 5000) / 5000) * 3 // 8 à 5
  if (budget <= 20000) return 5 - ((budget - 10000) / 10000) * 2 // 5 à 3
  if (budget <= 30000) return 3 - ((budget - 20000) / 10000) * 2 // 3 à 1
  return 1
}
