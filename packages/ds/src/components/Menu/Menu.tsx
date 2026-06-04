import { Menu as ArkMenu } from '@ark-ui/react/menu'
import { Portal } from '@ark-ui/react/portal'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { MenuItem, MenuProps } from './Menu.types'

const baseContent =
  'z-50 min-w-40 overflow-hidden rounded-md border border-gray-200 bg-white shadow-md p-1'

const baseItem =
  'relative flex cursor-pointer select-none items-center gap-2 rounded px-3 py-2 text-sm text-gray-900 outline-none transition-colors data-[highlighted]:bg-[color-mix(in_srgb,var(--color-brand)_10%,white)] data-[highlighted]:text-brand data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const destructiveItem =
  'text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600'

const baseSeparator = 'my-1 h-px bg-gray-200'

function isSeparator(item: MenuItem): item is { separator: true } {
  return 'separator' in item
}

/**
 * Dropdown menu for card/header actions. Wraps Ark Menu.
 * Item hover uses the tenant brand light variant.
 *
 * @param trigger - Element that opens the menu (passed via asChild)
 *
 * @param items - Action list; use `{ separator: true }` for dividers
 *
 * @example
 * <Menu trigger={<Button>Actions</Button>} items={[
 *   { value: 'edit', label: 'Edit', onSelect: edit },
 *   { separator: true },
 *   { value: 'del', label: 'Delete', destructive: true, onSelect: del },
 * ]} />
 */
export function Menu({ trigger, items }: MenuProps) {
  function handleSelect(value: string) {
    const item = items.find((i) => !isSeparator(i) && i.value === value)
    if (item && !isSeparator(item)) item.onSelect?.()
  }

  return (
    <ArkMenu.Root onSelect={({ value }) => handleSelect(value)}>
      <ArkMenu.Trigger asChild>{trigger}</ArkMenu.Trigger>
      <Portal>
        <ArkMenu.Positioner>
          <ArkMenu.Content className={baseContent}>
            {items.map((item, i) =>
              isSeparator(item) ? (
                <ArkMenu.Separator key={`sep-${i}`} className={baseSeparator} />
              ) : (
                <ArkMenu.Item
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className={mergeClasses(
                    baseItem,
                    item.destructive ? destructiveItem : ''
                  )}
                >
                  {item.icon}
                  {item.label}
                </ArkMenu.Item>
              )
            )}
          </ArkMenu.Content>
        </ArkMenu.Positioner>
      </Portal>
    </ArkMenu.Root>
  )
}

Menu.displayName = 'Menu'
