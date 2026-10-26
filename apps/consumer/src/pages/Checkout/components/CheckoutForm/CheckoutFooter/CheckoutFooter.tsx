import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { AnimatedNumber } from '@shared/components/AnimatedNumber/AnimatedNumber'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { brl } from '@utils/money'

import styles from './CheckoutFooter.module.css'

type CheckoutFooterProps = {
  disabled: boolean
  isLastStep?: boolean
  canGoBack?: boolean
  onBack?: () => void
  onContinue?: () => void
  checkout?: CheckoutFacade
}

export const CheckoutFooter = ({
  disabled,
  isLastStep = true,
  canGoBack = false,
  onBack,
  onContinue,
  checkout,
}: CheckoutFooterProps) => {
  const { total, isSubmitting } = useCheckoutFacade(checkout)

  return (
    <Box className={styles.tearBar}>
      <Box className={styles.totals}>
        <Text as="span" className={styles.checkoutFooterLabel}>
          Total
        </Text>
        <AnimatedNumber
          value={brl(total)}
          className={styles.checkoutFooterTotal}
        />
      </Box>
      <Box direction="row" gap={2} className={styles.checkoutFooterActions}>
        {canGoBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className={styles.back}
          >
            Voltar
          </Button>
        )}
        <Button
          type={isLastStep ? 'submit' : 'button'}
          loading={isLastStep && isSubmitting}
          disabled={isLastStep && disabled}
          onClick={isLastStep ? undefined : onContinue}
          className={styles.submit}
        >
          {isLastStep ? 'Confirmar pedido' : 'Continuar'}
        </Button>
      </Box>
    </Box>
  )
}
