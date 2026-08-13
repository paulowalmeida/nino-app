import { useMemo } from 'react'

import {
  createListCollection,
  Listbox as ArkListbox,
} from '@ark-ui/react/listbox'
import { Icon } from '@ds/components/Icon/Icon'

import styles from './Listbox.module.css'

type ListboxOption = {
  value: string
  label: string
  disabled?: boolean
}

type ListboxProps = {
  /** What can be picked. `disabled` greys out one entry */
  options: ListboxOption[]
  /**
   * Controlled selection. Leave it out and pass `defaultValue` to let the
   * component keep its own
   */
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** `single` (default) or `multiple` */
  selectionMode?: 'single' | 'multiple'
  /** Heading above the list, tied to it for screen readers */
  label?: string
  className?: string
}

/**
 * List of choices that stays open on the screen, instead of hiding behind a
 * trigger like `Select` does.
 *
 * Reach for it when the choice is the screen's job and the options are few
 * enough to show at once — picking a printer, a delivery zone. When the list
 * is long or the choice is one field among many, `Select` costs less space.
 *
 * ```tsx
 * <Listbox
 *   label="Impressora"
 *   options={printers}
 *   onValueChange={([id]) => setPrinter(id)}
 * />
 * ```
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
  /* A coleção precisa sobreviver ao render: recriada a cada ciclo, o Ark a
   * lê como uma lista nova e descarta o item em foco no meio da navegação
   * por teclado. */
  const collection = useMemo(
    () =>
      createListCollection<ListboxOption>({
        items: options,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        isItemDisabled: (item) => Boolean(item.disabled),
      }),
    [options]
  )

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
        <ArkListbox.Label className={styles.label}>{label}</ArkListbox.Label>
      )}
      <ArkListbox.Content className={styles.optionList}>
        {collection.items.map((item) => (
          <ArkListbox.Item
            key={item.value}
            item={item}
            className={styles.option}
          >
            <ArkListbox.ItemText>{item.label}</ArkListbox.ItemText>
            <ArkListbox.ItemIndicator className={styles.checkMark}>
              <Icon name="check" size="sm" />
            </ArkListbox.ItemIndicator>
          </ArkListbox.Item>
        ))}
      </ArkListbox.Content>
    </ArkListbox.Root>
  )
}
