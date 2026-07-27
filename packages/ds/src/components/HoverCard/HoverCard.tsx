import { HoverCard as ArkHoverCard } from '@ark-ui/react/hover-card'
import { Portal } from '@ark-ui/react/portal'

import { HoverCardProps } from './HoverCard.types'

const contentClass =
  'z-50 max-w-xs rounded-card bg-paper p-4 text-sm ' +
  'text-muted shadow-overlay outline-none data-[state=open]:animate-in ' +
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 ' +
  'data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 ' +
  'data-[state=open]:zoom-in-95'

const arrowClass = 'fill-paper'

/**
 * Floating card revealed on hover/focus of a trigger (Ark `HoverCard`).
 * Good for previews — a product, a courier, a profile.
 *
 * @param trigger - Element that opens the card on hover
 *
 * @param placement - Position relative to the trigger. Default: `bottom`
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
          <ArkHoverCard.Content className={contentClass}>
            <ArkHoverCard.Arrow className={arrowClass}>
              <ArkHoverCard.ArrowTip />
            </ArkHoverCard.Arrow>
            {children}
          </ArkHoverCard.Content>
        </ArkHoverCard.Positioner>
      </Portal>
    </ArkHoverCard.Root>
  )
}

HoverCard.displayName = 'HoverCard'
