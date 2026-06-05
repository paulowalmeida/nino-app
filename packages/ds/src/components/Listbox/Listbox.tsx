import {
  createListCollection,
  Listbox as ArkListbox,
} from '@ark-ui/react/listbox'

import { ListboxOption, ListboxProps } from './Listbox.types'

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

const contentClass =
  'flex flex-col gap-0.5 rounded-md border border-gray-200 bg-white p-1 ' +
  'outline-none'

const itemClass =
  'flex cursor-pointer select-none items-center justify-between gap-2 rounded ' +
  'px-3 py-2 text-sm text-gray-900 outline-none transition-colors ' +
  'data-[highlighted]:bg-brand-soft data-[highlighted]:text-brand ' +
  'data-[state=checked]:font-medium data-[state=checked]:text-brand ' +
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const indicatorClass = 'text-brand'

const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

/**
 * Always-visible selectable list (Ark `Listbox`). Single or multiple
 * selection; highlighted/selected items use the brand color.
 *
 * @param options - Selectable options
 *
 * @param selectionMode - `single` or `multiple`. Default: `single`
 *
 * @param onValueChange - Fired with the selected values
 */
export function Listbox({
  options,
  value,
  defaultValue,
  onValueChange,
  selectionMode = 'single',
  label,
  className,
}: ListboxProps) {
  const collection = createListCollection<ListboxOption>({
    items: options,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
    isItemDisabled: (item) => Boolean(item.disabled),
  })

  return (
    <ArkListbox.Root
      collection={collection}
      selectionMode={selectionMode}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(e) => onValueChange?.(e.value)}
      className={className}
    >
      {label && (
        <ArkListbox.Label className={labelClass}>{label}</ArkListbox.Label>
      )}
      <ArkListbox.Content className={contentClass}>
        {collection.items.map((item) => (
          <ArkListbox.Item key={item.value} item={item} className={itemClass}>
            <ArkListbox.ItemText>{item.label}</ArkListbox.ItemText>
            <ArkListbox.ItemIndicator className={indicatorClass}>
              <CheckIcon />
            </ArkListbox.ItemIndicator>
          </ArkListbox.Item>
        ))}
      </ArkListbox.Content>
    </ArkListbox.Root>
  )
}

Listbox.displayName = 'Listbox'
