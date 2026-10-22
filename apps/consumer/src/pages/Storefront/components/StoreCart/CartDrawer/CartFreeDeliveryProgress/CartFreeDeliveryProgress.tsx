import { Box } from '@nino/ds/components/Box'
import { ProgressLine } from '@nino/ds/components/ProgressLine'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { freeDeliveryGap } from '@utils/free-delivery/free-delivery'
import { brl } from '@utils/money/money'

import styles from './CartFreeDeliveryProgress.module.css'

export const CartFreeDeliveryProgress = () => {
  const { freeDelivery, cartTotal } = useStorefrontFacade()

  if (!freeDelivery) return null

  const gap = freeDeliveryGap(freeDelivery, cartTotal)

  if (gap === 0) {
    return (
      <Text role="status" className={styles.freeDeliveryReached}>
        Frete grátis liberado na entrega
      </Text>
    )
  }

  return (
    <Box className={styles.freeDeliveryProgress} role="status">
      <Text className={styles.freeDeliveryGap}>
        Faltam <strong>{brl(gap)}</strong> para frete grátis
      </Text>
      <ProgressLine
        size="sm"
        value={cartTotal}
        max={freeDelivery.minOrderValue}
        label={`Faltam ${brl(gap)} para frete grátis`}
      />
    </Box>
  )
}
