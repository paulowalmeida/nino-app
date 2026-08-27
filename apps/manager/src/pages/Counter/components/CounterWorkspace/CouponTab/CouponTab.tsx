import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'
import { brl } from '@shared/utils/money/money'

import styles from './CouponTab.module.css'

export const CouponTab = () => {
  const { count, total, setSheet } = useCounterFacade()

  return (
    <Button
      variant="ghost"
      className={styles.tab}
      onClick={() => setSheet(true)}
    >
      <span className={styles.perforation} aria-hidden="true" />

      <span className={styles.body}>
        <span className={styles.count}>
          {count} {count === 1 ? 'item' : 'itens'}
        </span>
        <span className={styles.total}>{brl(total)}</span>
        <span className={styles.hint}>
          <Icon name="chevron-up" size="sm" />
        </span>
      </span>
    </Button>
  )
}
