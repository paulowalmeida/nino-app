import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// clsx handles conditionals (false/undefined become empty string)
// twMerge resolves Tailwind conflicts (e.g. px-4 + px-8 → px-8)
export function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
