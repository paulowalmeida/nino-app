import { ReactNode } from 'react'

import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Drawer.module.css'
import { useDrawerDrag } from './useDragDrawer'

type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

type DrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  placement?: DrawerPlacement
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** Width (for left/right) or height (for top/bottom). E.g. '400px', '80%' */
  size?: string
  /** Extra classes for the content surface — for apps with their own theme */
  contentClassName?: string
  /**
   * Extra classes for the scrolling body. Use it when the drawer's own child
   * owns the scrolling — a cart that keeps its total fixed and scrolls only
   * the item list needs the body to stop scrolling and hand over its height.
   */
  bodyClassName?: string
}

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

const slideByPlacement: Record<DrawerPlacement, string> = {
  right: styles.slideFromRight,
  left: styles.slideFromLeft,
  bottom: styles.slideFromBottom,
  top: styles.slideFromTop,
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
  const { handleDragStart, handleDragMove, handleDragEnd } =
    useDrawerDrag(onOpenChange)
  const isHorizontal = placement === 'left' || placement === 'right'
  const sizeStyle = size
    ? isHorizontal
      ? { width: size }
      : { height: size }
    : isHorizontal
      ? { width: '400px' }
      : { height: '320px' }

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
            className={mergeClasses(
              styles.panel,
              sizeByPlacement[placement],
              alignByPlacement[placement],
              slideByPlacement[placement],
              contentClassName ?? ''
            )}
            style={sizeStyle}
          >
            {placement === 'bottom' && (
              <div
                aria-hidden="true"
                className={styles.dragHandleRow}
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
              >
                <span className={styles.dragHandlePill} />
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
            <div
              className={mergeClasses(styles.scrollArea, bodyClassName ?? '')}
            >
              {children}
            </div>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}
