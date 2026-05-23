import { useCallback, useState } from 'react'

import { ToastProps } from './Toast.types'

interface ToastState extends ToastProps {
  id: string
  open: boolean
}

/**
 * Hook for managing toast notifications imperatively.
 * Returns the active toast state and a `toast()` function to trigger it.
 *
 * @example
 * const { toastState, toast } = useToast()
 *
 * toast({ title: 'Saved!', variant: 'success' })
 *
 * <Toast {...toastState} onOpenChange={(open) => !open && dismiss()} />
 */
export function useToast() {
  const [toastState, setToastState] = useState<ToastState | null>(null)

  const toast = useCallback((props: ToastProps) => {
    setToastState({ ...props, id: Date.now().toString(), open: true })
  }, [])

  const dismiss = useCallback(() => {
    setToastState((prev) => (prev ? { ...prev, open: false } : null))
  }, [])

  return { toastState, toast, dismiss }
}
