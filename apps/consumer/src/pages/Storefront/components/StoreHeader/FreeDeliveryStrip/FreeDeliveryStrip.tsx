import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { freeDeliveryLabel } from '@utils/free-delivery/free-delivery'

import styles from './FreeDeliveryStrip.module.css'

export const FreeDeliveryStrip = () => {
  const { freeDelivery } = useStorefrontFacade()

  if (!freeDelivery) return null

  return (
    <Box direction="row" className={styles.freeDeliveryStrip}>
      <Icon name="truck" size="sm" className={styles.freeDeliveryIcon} />
      <Text as="p" className={styles.freeDeliveryText}>
        {freeDeliveryLabel(freeDelivery)}
      </Text>
    </Box>
  )
}
