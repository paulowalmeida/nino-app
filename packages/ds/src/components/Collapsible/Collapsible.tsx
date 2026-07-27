import { Collapsible as ArkCollapsible } from '@ark-ui/react/collapsible'

import { CollapsibleProps } from './Collapsible.types'

const triggerClass =
  'flex w-full items-center justify-between gap-2 rounded-card ' +
  'bg-surface-sunk px-3 py-2 text-sm font-semibold text-ink ' +
  'transition-colors outline-none cursor-pointer hover:bg-cream-deep ' +
  'focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2 disabled:pointer-events-none ' +
  'disabled:opacity-50'

const contentClass = 'collapsible-content overflow-hidden text-sm text-muted'

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
