import type { ReactNode } from 'react'

import { HoverCard as ArkHoverCard } from '@ark-ui/react/hover-card'
import { Portal } from '@ark-ui/react/portal'

import styles from './HoverCard.module.css'

type HoverCardPlacement = 'top' | 'bottom' | 'left' | 'right'

type HoverCardProps = {
  /** Element that reveals the card on hover or focus */
  trigger: ReactNode
  /** Content shown inside the card */
  children: ReactNode
  /** Side it opens on. Default: `bottom` */
  placement?: HoverCardPlacement
  /**
   * Milliseconds the pointer must rest before it opens. Default: `300` —
   * enough that crossing the trigger does not open it
   */
  openDelay?: number
  /**
   * Milliseconds before it closes. Default: `200` — the grace period to
   * travel from the trigger into the card
   */
  closeDelay?: number
}

/**
 * Card that appears when the pointer rests on something, for a preview that
 * would crowd the screen if it were always there — a product, a courier, a
 * profile.
 *
 * Hover is not a gesture on a phone: the trigger has to work by tap or focus
 * on its own, and what is inside the card can never be the only way to reach
 * a piece of information.
 *
 * ```tsx
 * <HoverCard trigger={<Avatar name="Ana" />}>
 *   <Text size="sm">Entregando desde março</Text>
 * </HoverCard>
 * ```
 */
export function HoverCard({
  trigger,
  children,
  placement = 'bottom',
  openDelay = 300,
  closeDelay = 200,
}: HoverCardProps) {
  return (
    <ArkHoverCard.Root
      positioning={{ placement }}
      openDelay={openDelay}
      closeDelay={closeDelay}
      lazyMount
      unmountOnExit
    >
      <ArkHoverCard.Trigger asChild>{trigger}</ArkHoverCard.Trigger>
      <Portal>
        <ArkHoverCard.Positioner>
          <ArkHoverCard.Content className={styles.panel}>
            <ArkHoverCard.Arrow className={styles.arrow}>
              <ArkHoverCard.ArrowTip />
            </ArkHoverCard.Arrow>
            {children}
          </ArkHoverCard.Content>
        </ArkHoverCard.Positioner>
      </Portal>
    </ArkHoverCard.Root>
  )
}
