import { PointerEvent, useRef } from 'react'

import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { DrawerPlacement, DrawerProps } from './Drawer.types'

/** Distância mínima arrastando pra baixo pra soltar a comanda em vez de voltar. */
const DISMISS_OFFSET_PX = 96
const SPRING_BACK_MS = 200
const SLIDE_OUT_MS = 180

const backdropClass =
  'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200'

const positionerClass = 'fixed inset-0 z-50 flex overflow-hidden'

const alignByPlacement: Record<DrawerPlacement, string> = {
  right: 'ml-auto',
  left: 'mr-auto',
  bottom: 'mt-auto',
  top: 'mb-auto',
}

const sizeByPlacement: Record<DrawerPlacement, string> = {
  right: 'h-full',
  left: 'h-full',
  bottom: 'w-full',
  top: 'w-full',
}

const animationByPlacement: Record<DrawerPlacement, string> = {
  right:
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
  left: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
  bottom:
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
  top: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
}

const baseContent =
  'flex flex-col bg-white shadow-overlay outline-none duration-300'

const baseHeader = 'flex items-center justify-between px-6 pb-2 pt-6'

const titleClass =
  'font-display text-base font-semibold tracking-[-0.01em] text-ink'
const descriptionClass = 'mt-1 text-[0.8125rem] leading-[1.45] text-muted'
const baseBody = 'flex-1 overflow-y-auto px-6 py-4'

const closeButtonClass =
  'cursor-pointer rounded-full p-1.5 text-faint transition-colors ' +
  'hover:bg-sand ' +
  'hover:text-ink focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2'

/* Alvo de toque de 44px pra segurar, pílula visual mais fina por dentro —
   ver screens.md, "Alvos de toque". */
const dragHandleRowClass =
  'flex h-11 shrink-0 cursor-grab items-center justify-center'
const dragHandlePillClass = 'h-1 w-9 rounded-full bg-black/15'

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

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

  const contentRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef<number | null>(null)

  /*
   * Arraste imperativo em vez de framer-motion: o `ArkDialog.Content` já é
   * quem controla a animação de entrada/saída (as classes `animate-in`/
   * `animate-out` via `data-state`) — um `motion.div` teria que assumir esse
   * papel também, duplicando o que o Ark já faz. Só a pílula do topo recebe
   * o pointer down, então a lista rolável do corpo não perde o próprio
   * gesto de scroll.
   */
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
    const node = contentRef.current
    if (dragStartY.current === null || !node) return
    const offset = Math.max(0, event.clientY - dragStartY.current)
    dragStartY.current = null

    node.style.transition = `transform ${SPRING_BACK_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`

    if (offset > DISMISS_OFFSET_PX) {
      node.style.transitionDuration = `${SLIDE_OUT_MS}ms`
      node.style.transform = 'translateY(100%)'
      window.setTimeout(() => onOpenChange(false), SLIDE_OUT_MS)
      return
    }

    node.style.transform = ''
    window.setTimeout(() => {
      node.style.transition = ''
    }, SPRING_BACK_MS)
  }

  return (
    <ArkDialog.Root
      open={open}
      onOpenChange={({ open: o }) => onOpenChange(o)}
      lazyMount
      unmountOnExit
    >
      <Portal>
        <ArkDialog.Backdrop className={backdropClass} />
        <ArkDialog.Positioner className={positionerClass}>
          <ArkDialog.Content
            ref={contentRef}
            className={mergeClasses(
              baseContent,
              sizeByPlacement[placement],
              alignByPlacement[placement],
              animationByPlacement[placement],
              contentClassName ?? ''
            )}
            style={sizeStyle}
          >
            {isDraggable && (
              <div
                className={dragHandleRowClass}
                aria-hidden="true"
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
              >
                <div className={dragHandlePillClass} />
              </div>
            )}
            {(title || description) && (
              <div className={baseHeader}>
                <div>
                  {title && (
                    <ArkDialog.Title className={titleClass}>
                      {title}
                    </ArkDialog.Title>
                  )}
                  {description && (
                    <ArkDialog.Description className={descriptionClass}>
                      {description}
                    </ArkDialog.Description>
                  )}
                </div>
                <ArkDialog.CloseTrigger
                  className={closeButtonClass}
                  aria-label="Close"
                >
                  <CloseIcon />
                </ArkDialog.CloseTrigger>
              </div>
            )}
            <div className={mergeClasses(baseBody, bodyClassName ?? '')}>
              {children}
            </div>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}

Drawer.displayName = 'Drawer'
