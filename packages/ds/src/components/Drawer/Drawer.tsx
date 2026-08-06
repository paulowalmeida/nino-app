import { PointerEvent, useRef } from 'react'

import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses'

import styles from './Drawer.module.css'
import { DrawerPlacement, DrawerProps } from './Drawer.types'

const DISMISS_OFFSET_PX = 96
const SPRING_BACK_MS = 200
const SLIDE_OUT_MS = 260

/*
 * Settling back decelerates (same entry curve as the rest of the app).
 * Dismissing is the opposite: it starts slow and speeds up leaving, to read
 * as something dropped rather than a hard cut at whatever speed the hand
 * had when it let go.
 */
const EASE_SETTLE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_DISMISS = 'cubic-bezier(0.32, 0, 0.67, 0)'
const SETTLE_TRANSITION = `transform ${SPRING_BACK_MS}ms ${EASE_SETTLE}`
const DISMISS_TRANSITION = `transform ${SLIDE_OUT_MS}ms ${EASE_DISMISS}`

const alignByPlacement: Record<DrawerPlacement, string> = {
  right: styles.alignRight,
  left: styles.alignLeft,
  bottom: styles.alignBottom,
  top: styles.alignTop,
}

const sizeByPlacement: Record<DrawerPlacement, string> = {
  right: styles.sizeVertical,
  left: styles.sizeVertical,
  bottom: styles.sizeHorizontal,
  top: styles.sizeHorizontal,
}

const animationByPlacement: Record<DrawerPlacement, string> = {
  right: styles.animateRight,
  left: styles.animateLeft,
  bottom: styles.animateBottom,
  top: styles.animateTop,
}

/*
 * Imperative drag instead of framer-motion: `ArkDialog.Content` already
 * owns the enter/exit animation (the `animate-in`/`animate-out` classes via
 * `data-state`) — a `motion.div` would have to take over that role too,
 * duplicating what Ark already does. Only the top handle gets the pointer
 * down, so the scrollable body keeps its own scroll gesture.
 */
const useDrawerDrag = (onOpenChange: (open: boolean) => void) => {
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

export function Drawer({
  open,
  onOpenChange,
  placement = 'right',
  title,
  description,
  children,
  size,
  contentClassName,
  bodyClassName,
}: DrawerProps) {
  const isHorizontal = placement === 'left' || placement === 'right'
  const isDraggable = placement === 'bottom'
  const sizeStyle = size
    ? isHorizontal
      ? { width: size }
      : { height: size }
    : isHorizontal
      ? { width: '400px' }
      : { height: '320px' }

  const { contentRef, handleDragStart, handleDragMove, handleDragEnd } =
    useDrawerDrag(onOpenChange)

  return (
    <ArkDialog.Root
      open={open}
      onOpenChange={({ open: o }) => onOpenChange(o)}
      lazyMount
      unmountOnExit
    >
      <Portal>
        <ArkDialog.Backdrop className={styles.backdrop} />
        <ArkDialog.Positioner className={styles.positioner}>
          <ArkDialog.Content
            ref={contentRef}
            className={mergeClasses(
              styles.content,
              sizeByPlacement[placement],
              alignByPlacement[placement],
              animationByPlacement[placement],
              contentClassName ?? ''
            )}
            style={sizeStyle}
          >
            {isDraggable && (
              <div
                className={styles.dragHandleRow}
                aria-hidden="true"
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
              >
                <div className={styles.dragHandlePill} />
              </div>
            )}
            {(title || description) && (
              <div className={styles.header}>
                <div>
                  {title && (
                    <ArkDialog.Title className={styles.title}>
                      {title}
                    </ArkDialog.Title>
                  )}
                  {description && (
                    <ArkDialog.Description className={styles.description}>
                      {description}
                    </ArkDialog.Description>
                  )}
                </div>
                <ArkDialog.CloseTrigger
                  className={styles.closeButton}
                  aria-label="Fechar"
                >
                  <Icon name="x" size="sm" />
                </ArkDialog.CloseTrigger>
              </div>
            )}
            <div className={mergeClasses(styles.body, bodyClassName ?? '')}>
              {children}
            </div>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}
