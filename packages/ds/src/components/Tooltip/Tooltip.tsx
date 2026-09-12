import { ReactNode } from 'react'

import { Portal } from '@ark-ui/react/portal'
import { Tooltip as ArkTooltip } from '@ark-ui/react/tooltip'

import styles from './Tooltip.module.css'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

type TooltipProps = {
  /** The line to show. Keep it to a few words */
  content: ReactNode
  /**
   * What it hangs off. Gets the open state through `asChild`, so pass a real
   * element
   */
  children: ReactNode
  /** Which side it opens on. Default: `top` */
  side?: TooltipPlacement
  sideOffset?: number
  /**
   * Milliseconds the pointer must rest before it opens. Default: `300` —
   * enough that crossing the element does not open it
   */
  delayDuration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

/**
 * Short line that appears when the pointer rests on something — the name of
 * an icon-only button, the full text of what was truncated.
 *
 * Hover does not exist on a phone, so whatever is written here must be
 * available some other way: an `aria-label` on the trigger, or the text
 * itself somewhere on the screen. A tooltip is never the only place an
 * instruction lives.
 *
 * Reach for `Popover` when the content has a link or a control inside — this
 * one closes as soon as the pointer leaves, so there is no way to reach into
 * it.
 *
 * ```tsx
 * <Tooltip content="Excluir item">
 *   <Button variant="ghost"><Icon name="trash" /></Button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  sideOffset = 4,
  delayDuration = 300,
  open,
  onOpenChange,
  defaultOpen,
}: TooltipProps) {
  return (
    <ArkTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      openDelay={delayDuration}
      closeDelay={0}
      onOpenChange={({ open: o }) => onOpenChange?.(o)}
      positioning={{ placement: side, offset: { mainAxis: sideOffset } }}
    >
      <ArkTooltip.Trigger asChild>{children}</ArkTooltip.Trigger>
      <Portal>
        <ArkTooltip.Positioner>
          <ArkTooltip.Content className={styles.bubble}>
            <ArkTooltip.Arrow className={styles.arrow}>
              <ArkTooltip.ArrowTip />
            </ArkTooltip.Arrow>
            {content}
          </ArkTooltip.Content>
        </ArkTooltip.Positioner>
      </Portal>
    </ArkTooltip.Root>
  )
}

/**
 * Kept for symmetry with other providers — Ark needs no shared context for
 * tooltips, so nothing has to wrap the app.
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
