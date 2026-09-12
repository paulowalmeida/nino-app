import { ReactNode } from 'react'

import { Menu as ArkMenu } from '@ark-ui/react/menu'
import { Portal } from '@ark-ui/react/portal'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Tooltip } from '../Tooltip/Tooltip'
import styles from './Menu.module.css'
import { MenuItem } from './Menu.types'

export type { MenuItem } from './Menu.types'

type MenuPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

type MenuProps = {
  /**
   * What opens the menu. Gets the open state through `asChild`, so pass a
   * real `Button`, not a `<div>`
   */
  trigger: ReactNode
  /** Short description shown when the trigger is icon-only. */
  triggerTooltip?: ReactNode
  /**
   * The entries, in order. `{ separator: true }` draws a rule between groups
   */
  items: MenuItem[]
  /**
   * Extra classes on the panel, for an app that gives the menu its own
   * surface
   */
  contentClassName?: string
  /** Extra classes per entry, for a themed surface */
  itemClassName?: string
  /**
   * Side it opens on, with `-start`/`-end` to align by an edge. Default:
   * `bottom-start`
   */
  placement?: MenuPlacement
}

const isSeparator = (
  item: MenuItem
): item is Extract<MenuItem, { separator: true }> => 'separator' in item

/**
 * List of actions that opens from a trigger — the three dots of a card, the
 * avatar in the header.
 *
 * Every entry is an action on the thing the trigger belongs to. A menu that
 * navigates somewhere is a nav; a menu that picks a value is a `Select`.
 *
 * ```tsx
 * <Menu
 *   trigger={<Button variant="ghost"><Icon name="more-vertical" /></Button>}
 *   items={[
 *     { value: 'edit', label: 'Editar', onSelect: edit },
 *     { separator: true },
 *     { value: 'del', label: 'Excluir', destructive: true, onSelect: del },
 *   ]}
 * />
 * ```
 */
export function Menu({
  trigger,
  triggerTooltip,
  items,
  contentClassName,
  itemClassName,
  placement = 'bottom-start',
}: MenuProps) {
  const handleSelect = (value: string) => {
    const selected = items.find(
      (item) => !isSeparator(item) && item.value === value
    )
    if (selected && !isSeparator(selected)) selected.onSelect?.()
  }

  return (
    <ArkMenu.Root
      onSelect={({ value }) => handleSelect(value)}
      positioning={{ placement, gutter: 8, strategy: 'fixed' }}
      lazyMount
      unmountOnExit
    >
      {triggerTooltip ? (
        <Tooltip content={triggerTooltip} side="right" delayDuration={0}>
          {/* WHY: dois `asChild` no mesmo elemento colidem — o tooltip vence o
              merge e o menu fica sem âncora, abrindo em 0,0. O span dá a cada
              máquina um elemento próprio. */}
          <span className={styles.triggerWrap}>
            <ArkMenu.Trigger asChild>{trigger}</ArkMenu.Trigger>
          </span>
        </Tooltip>
      ) : (
        <ArkMenu.Trigger asChild>{trigger}</ArkMenu.Trigger>
      )}
      <Portal>
        <ArkMenu.Positioner className={styles.positioner}>
          {/* `menu-animated-content` é gancho global: as regras de entrada e
              saída (e o corte delas em prefers-reduced-motion) vivem em
              globals.css e precisam do nome literal, sem hash. */}
          <ArkMenu.Content
            className={mergeClasses(
              'menu-animated-content',
              styles.panel,
              contentClassName ?? ''
            )}
          >
            {items.map((item, i) =>
              isSeparator(item) ? (
                <ArkMenu.Separator
                  key={`sep-${i}`}
                  className={styles.separator}
                />
              ) : (
                <ArkMenu.Item
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className={mergeClasses(
                    styles.option,
                    item.destructive
                      ? styles.optionDanger
                      : styles.optionDefault,
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
