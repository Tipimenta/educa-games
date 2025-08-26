import { twMerge } from 'tailwind-variants'
import { clsx } from 'clsx'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
