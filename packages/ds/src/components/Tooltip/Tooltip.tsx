import { ReactNode } from 'react'

import { Tooltip as ArkTooltip } from '@ark-ui/react/tooltip'

import { TooltipProps } from './Tooltip.types'

const baseContent =
  'z-50 max-w-xs rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95'

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
      <ArkTooltip.Positioner>
        <ArkTooltip.Content className={baseContent}>
          <ArkTooltip.Arrow>
            <ArkTooltip.ArrowTip className="bg-gray-900" />
          </ArkTooltip.Arrow>
          {content}
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  )
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
