import { Popover as ArkPopover } from '@ark-ui/react/popover'
import { Portal } from '@ark-ui/react/portal'

import { PopoverProps } from './Popover.types'

const baseContent =
  'z-50 w-72 rounded-md border border-gray-200 bg-white p-4 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'

const arrowClass = 'fill-white [&>*]:stroke-gray-200'

const titleClass = 'mb-2 text-sm font-semibold text-gray-900'

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
          <ArkPopover.Content className={baseContent}>
            <ArkPopover.Arrow className={arrowClass}>
              <ArkPopover.ArrowTip />
            </ArkPopover.Arrow>
            {title && (
              <ArkPopover.Title className={titleClass}>{title}</ArkPopover.Title>
            )}
            <ArkPopover.Description asChild>
              <div className='text-sm text-gray-600'>{children}</div>
            </ArkPopover.Description>
          </ArkPopover.Content>
        </ArkPopover.Positioner>
      </Portal>
    </ArkPopover.Root>
  )
}

Popover.displayName = 'Popover'
