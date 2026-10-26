import type { ReactNode } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'

import motion from '@styles/motion.module.css'
import styles from './ChoiceCard.module.css'

export type ChoiceCardProps = {
  icon: ReactNode
  label: string
  hint?: string
  isSelected: boolean
  onSelect: () => void
}

export const ChoiceCard = ({
  icon,
  label,
  hint,
  isSelected,
  onSelect,
}: ChoiceCardProps) => (
  <Button
    type="button"
    variant="outline"
    aria-pressed={isSelected}
    onClick={onSelect}
    className={mergeClasses(
      motion.press,
      styles.choice,
      isSelected && styles.selected
    )}
  >
    <Text as="span" aria-hidden="true" className={styles.choiceCardIcon}>
      {icon}
    </Text>
    <Text as="span" weight="bold" className={styles.choiceCardLabel}>
      {label}
    </Text>
    {hint && (
      <Text as="span" size="xs" color="muted" className={styles.hint}>
        {hint}
      </Text>
    )}
  </Button>
)
