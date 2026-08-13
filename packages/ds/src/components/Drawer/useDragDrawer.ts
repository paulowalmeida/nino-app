import { PointerEvent, useRef } from 'react'

/*
 * Imperative drag instead of framer-motion: `ArkDialog.Content` already
 * owns the enter/exit animation (the `animate-in`/`animate-out` classes via
 * `data-state`) — a `motion.div` would have to take over that role too,
 * duplicating what Ark already does. Only the top handle gets the pointer
 * down, so the scrollable body keeps its own scroll gesture.
 */
export const useDrawerDrag = (onOpenChange: (open: boolean) => void) => {
  const DISMISS_OFFSET_PX = 96
  const SPRING_BACK_MS = 200
  const SLIDE_OUT_MS = 260
  const EASE_SETTLE = 'var(--ease-out)'
  const EASE_DISMISS = 'var(--ease-in)'
  const SETTLE_TRANSITION = `transform ${SPRING_BACK_MS}ms ${EASE_SETTLE}`
  const DISMISS_TRANSITION = `transform ${SLIDE_OUT_MS}ms ${EASE_DISMISS}`

  const contentRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef<number | null>(null)

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    dragStartY.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null || !contentRef.current) return
    const offset = Math.max(0, event.clientY - dragStartY.current)
    contentRef.current.style.transform = `translateY(${offset}px)`
  }

  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    const content = contentRef.current
    if (dragStartY.current === null || !content) return
    const offset = Math.max(0, event.clientY - dragStartY.current)
    dragStartY.current = null

    if (offset > DISMISS_OFFSET_PX) {
      content.style.transition = DISMISS_TRANSITION
      content.style.transform = 'translateY(100%)'
      window.setTimeout(() => onOpenChange(false), SLIDE_OUT_MS)
      return
    }

    content.style.transition = SETTLE_TRANSITION
    content.style.transform = ''
    window.setTimeout(() => {
      content.style.transition = ''
    }, SPRING_BACK_MS)
  }

  return { contentRef, handleDragStart, handleDragMove, handleDragEnd }
}
