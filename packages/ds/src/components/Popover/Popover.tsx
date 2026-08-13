import { ReactNode } from 'react'

import { Popover as ArkPopover } from '@ark-ui/react/popover'
import { Portal } from '@ark-ui/react/portal'

import styles from './Popover.module.css'

type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

type PopoverProps = {
  /**
   * What opens the panel. Gets the open state through `asChild`, so pass a
   * real `Button`
   */
  trigger: ReactNode
  children: ReactNode
  /** Heading inside the panel, announced with it */
  title?: ReactNode
  /**
   * Side it opens on, with `-start`/`-end` to align by an edge. Default:
   * `bottom`
   */
  placement?: PopoverPlacement
  /** Controlled state. Leave it out to let the component keep its own */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Panel that opens from a trigger and takes focus — for a small form, a
 * filter, an explanation with a link inside.
 *
 * It is not a `Tooltip`: this one can be clicked into, holds focus and only
 * closes when asked. Reach for `Tooltip` when the content is a short line
 * that needs no interaction, and for `Menu` when every entry is an action.
 *
 * ```tsx
 * <Popover trigger={<Button variant="ghost">Filtros</Button>} title="Filtrar">
 *   <FilterForm />
 * </Popover>
 * ```
 */
export function Popover({
  trigger,
  children,
  title,
  placement = 'bottom',
  open,
  onOpenChange,
}: PopoverProps) {
  return (
    <ArkPopover.Root
      open={open}
      onOpenChange={({ open: o }) => onOpenChange?.(o)}
      positioning={{ placement }}
      lazyMount
      unmountOnExit
    >
      <ArkPopover.Trigger asChild>{trigger}</ArkPopover.Trigger>
      <Portal>
        <ArkPopover.Positioner>
          <ArkPopover.Content className={styles.panel}>
            <ArkPopover.Arrow className={styles.arrow}>
              <ArkPopover.ArrowTip />
            </ArkPopover.Arrow>
            {title && (
              <ArkPopover.Title className={styles.title}>
                {title}
              </ArkPopover.Title>
            )}
            <ArkPopover.Description className={styles.description}>
              {children}
            </ArkPopover.Description>
          </ArkPopover.Content>
        </ArkPopover.Positioner>
      </Portal>
    </ArkPopover.Root>
  )
}
