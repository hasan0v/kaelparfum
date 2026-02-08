import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat('az-AZ', {
    style: 'currency',
    currency: 'AZN',
  }).format(Number(price))
}
