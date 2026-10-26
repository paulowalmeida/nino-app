import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Both libraries are needed: clsx flattens conditionals (`false`/`undefined`
 * become an empty string) and twMerge resolves Tailwind conflicts, keeping
 * the last one (`px-4` + `px-8` → `px-8`) so a `className` prop can always
 * override the component's own classes.
 */
export const mergeClasses = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
