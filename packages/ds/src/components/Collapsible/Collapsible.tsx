import { Collapsible as ArkCollapsible } from '@ark-ui/react/collapsible'

import { CollapsibleProps } from './Collapsible.types'

const triggerClass =
  'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 ' +
  'text-sm font-medium text-gray-900 transition-colors outline-none cursor-pointer ' +
  'hover:bg-brand-soft focus-visible:ring-2 focus-visible:ring-brand ' +
  'disabled:pointer-events-none disabled:opacity-50'

const contentClass = 'collapsible-content overflow-hidden text-sm text-gray-600'

/**
 * Show/hide a block of content behind a trigger (Ark `Collapsible`).
 * Hover on the trigger uses the brand light variant.
 *
 * @param trigger - Always-visible toggle element
 *
 * @param onOpenChange - Fired when the open state changes
 */
export function Collapsible({
  trigger,
  children,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  className,
}: CollapsibleProps) {
  return (
    <ArkCollapsible.Root
      open={open}
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={({ open: o }) => onOpenChange?.(o)}
      className={className}
    >
      <ArkCollapsible.Trigger className={triggerClass}>
        {trigger}
      </ArkCollapsible.Trigger>
      <ArkCollapsible.Content className={contentClass}>
        <div className="px-3 pb-3 pt-1">{children}</div>
      </ArkCollapsible.Content>
    </ArkCollapsible.Root>
  )
}

Collapsible.displayName = 'Collapsible'
