import { Menu as ArkMenu } from '@ark-ui/react/menu'
import { Portal } from '@ark-ui/react/portal'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { MenuItem, MenuProps } from './Menu.types'

const baseContent =
  'menu-animated-content z-50 min-w-40 overflow-hidden rounded-card ' +
  'bg-white shadow-overlay p-1 outline-none'

const baseItem =
  'relative flex cursor-pointer select-none items-center gap-2 rounded-[6px] px-3 py-2.5 text-sm font-medium text-body outline-none transition-colors data-[highlighted]:bg-surface-mute data-[highlighted]:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const destructiveItem =
  'text-danger data-[highlighted]:bg-danger-surface data-[highlighted]:text-danger'

// `border-0`: o Ark usa <hr>, que traz borda do navegador por padrão
const baseSeparator = 'my-1 h-px border-0 bg-sand'

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
export function Menu({
  trigger,
  items,
  contentClassName,
  itemClassName,
}: MenuProps) {
  function handleSelect(value: string) {
    const item = items.find((i) => !isSeparator(i) && i.value === value)
    if (item && !isSeparator(item)) item.onSelect?.()
  }

  return (
    <ArkMenu.Root onSelect={({ value }) => handleSelect(value)}>
      <ArkMenu.Trigger asChild>{trigger}</ArkMenu.Trigger>
      <Portal>
        <ArkMenu.Positioner>
          <ArkMenu.Content
            className={mergeClasses(baseContent, contentClassName ?? '')}
          >
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
                    item.destructive ? destructiveItem : '',
                    itemClassName ?? ''
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
