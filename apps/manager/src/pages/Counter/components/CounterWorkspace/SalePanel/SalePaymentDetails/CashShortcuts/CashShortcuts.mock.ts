import type { CashShortcutsProps } from './CashShortcuts'

export const cashShortcutsMock: Omit<CashShortcutsProps, 'onSelect'> = {
  notes: [50, 100, 200],
  hasChange: false,
}
