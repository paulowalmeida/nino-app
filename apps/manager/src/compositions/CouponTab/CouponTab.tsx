import { Button } from '@nino/ds/components/Button'
import { brl } from '@utils/money'

import styles from './CouponTab.module.css'

type CouponTabProps = {
  count: number
  total: number
  onOpen: () => void
}

export const CouponTab = ({ count, total, onOpen }: CouponTabProps) => (
  <Button variant="ghost" className={styles.tab} onClick={onOpen}>
    <span className={styles.perforation} aria-hidden="true" />

    <span className={styles.body}>
      <span className={styles.summary}>
        <span className={styles.count}>
          {count} {count === 1 ? 'item' : 'itens'}
        </span>
        <span className={styles.total}>{brl(total)}</span>
      </span>

      <span className={styles.cta}>Ver comanda</span>
    </span>
  </Button>
)
