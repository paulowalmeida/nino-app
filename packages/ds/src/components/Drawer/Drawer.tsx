import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses'

import styles from './Drawer.module.css'
import { DrawerPlacement, DrawerProps } from './Drawer.types'
import { useDrawerDrag } from './useDragDrawer'

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
