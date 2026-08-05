import { Button } from '@nino/ds/components/Button'
import { AnimatedNumber } from '@elements/AnimatedNumber/AnimatedNumber'
import { brl } from '@utils/money'

import styles from './CheckoutFooter.module.css'

type CheckoutFooterProps = {
  total: number
  isSubmitting: boolean
  disabled: boolean
}

/** O picote + a barra de confirmar: o total sobe junto pra não haver susto. */
export const CheckoutFooter = ({
  total,
  isSubmitting,
  disabled,
}: CheckoutFooterProps) => (
  <div className={styles.tearBar}>
    <div className={styles.totals}>
      <span className={styles.label}>Total</span>
      <AnimatedNumber value={brl(total)} className={styles.total} />
    </div>
    <Button
      type="submit"
      loading={isSubmitting}
      disabled={disabled}
      className={styles.submit}
    >
      Confirmar pedido
    </Button>
  </div>
)
