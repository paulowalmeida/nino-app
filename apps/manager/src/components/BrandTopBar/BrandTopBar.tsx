import { Button } from '@nino/ds/components/Button'
import { NinoLogo } from '@elements/NinoLogo/NinoLogo'

import styles from './BrandTopBar.module.css'

type BrandTopBarProps = {
  actionLabel: string
  onAction: () => void
}

export const BrandTopBar = ({ actionLabel, onAction }: BrandTopBarProps) => (
  <header className={styles.bar}>
    <NinoLogo size="sm" />

    <Button variant="ghost" className={styles.action} onClick={onAction}>
      {actionLabel}
    </Button>
  </header>
)
