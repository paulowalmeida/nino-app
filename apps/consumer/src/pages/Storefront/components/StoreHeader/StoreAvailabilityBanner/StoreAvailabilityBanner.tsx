import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { StoreClosedIllustration } from '@shared/components/Illustrations/StoreClosedIllustration/StoreClosedIllustration'
import { isOpen } from '@utils/store-info'

import styles from './StoreAvailabilityBanner.module.css'

/** Direciona a pessoa antes do menu quando a loja não pode aceitar pedidos. */
export const StoreAvailabilityBanner = () => {
  const { store, hours, isHoursPending } = useStorefrontFacade()

  if (!store || isHoursPending || isOpen(store, hours)) return null

  return (
    <Box
      direction="row"
      role="status"
      className={styles.storeAvailabilityBanner}
    >
      <StoreClosedIllustration className={styles.storeAvailabilityBannerArt} />
      <Box className={styles.storeAvailabilityBannerText}>
        <Text size="base" weight="bold" font="display" color="strong">
          Pedidos indisponíveis no momento
        </Text>
        <Text size="sm" color="muted">
          Abra “Detalhes da loja” para consultar os horários.
        </Text>
      </Box>
    </Box>
  )
}
