import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { brl, maskMoneyAmount } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './CashShortcuts.module.css'

export type CashShortcutsProps = {
  notes: number[]
  hasChange: boolean
  onSelect: (value: string) => void
}

export const CashShortcuts = ({
  notes,
  hasChange,
  onSelect,
}: CashShortcutsProps) => (
  <Box direction="row" wrap className={styles.shortcuts}>
    <Button
      type="button"
      variant="ghost"
      aria-pressed={!hasChange}
      onClick={() => onSelect('')}
      className={mergeClasses(
        motion.press,
        styles.shortcut,
        !hasChange && styles.shortcutOn
      )}
    >
      Valor exato
    </Button>
    {notes.map((note) => (
      <Button
        key={note}
        type="button"
        variant="ghost"
        onClick={() => onSelect(maskMoneyAmount(note))}
        className={mergeClasses(motion.press, styles.shortcut)}
      >
        {brl(note)}
      </Button>
    ))}
  </Box>
)
