import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { AnimatedNumber } from '@elements/AnimatedNumber/AnimatedNumber'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { brl } from '@utils/money'

import styles from './CheckoutFooter.module.css'

type CheckoutFooterProps = {
  disabled: boolean
}

/** O picote + a barra de confirmar: o total sobe junto pra não haver susto. */
export const CheckoutFooter = ({ disabled }: CheckoutFooterProps) => {
  const { total, isSubmitting } = useCheckoutFacade()

  return (
    <Box className={styles.tearBar}>
      <Box className={styles.totals}>
        <Text as="span" className={styles.label}>
          Total
        </Text>
        <AnimatedNumber value={brl(total)} className={styles.total} />
      </Box>
      <Button
        type="submit"
        loading={isSubmitting}
        disabled={disabled}
        className={styles.submit}
      >
        Confirmar pedido
      </Button>
    </Box>
  )
}
