import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { QuantityStepper } from '@nino/ds/components/QuantityStepper'
import { AnimatedNumber } from '@shared/components/AnimatedNumber/AnimatedNumber'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { brl } from '@utils/money'

import styles from './ProductAddBar.module.css'

export const ProductAddBar = () => {
  const { product, quantity, setQuantity, total, missingGroup, addToBag } =
    useProductDetailFacade()

  if (!product) return null

  return (
    <Box direction="row" className={styles.bar}>
      <QuantityStepper
        quantity={quantity}
        count={<AnimatedNumber value={quantity} />}
        incrementLabel="Aumentar quantidade"
        decrementLabel="Diminuir quantidade"
        isDecrementDisabled={quantity <= 1}
        onIncrement={() => setQuantity(quantity + 1)}
        onDecrement={() => setQuantity(quantity - 1)}
      />

      <Button
        className={styles.confirm}
        disabled={missingGroup !== null}
        onClick={addToBag}
      >
        {missingGroup ? (
          `Escolha: ${missingGroup.name}`
        ) : (
          <>
            Adicionar{' '}
            <AnimatedNumber className={styles.confirmValue} value={brl(total)} />
          </>
        )}
      </Button>
    </Box>
  )
}
