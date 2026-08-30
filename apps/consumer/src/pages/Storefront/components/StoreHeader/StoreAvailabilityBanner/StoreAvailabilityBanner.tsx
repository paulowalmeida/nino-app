import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { useStorefrontSlug } from '@pages/Storefront/hooks/useStorefrontSlug/useStorefrontSlug'
import { isOpen } from '@utils/store-info'

import styles from './StoreAvailabilityBanner.module.css'

/** Direciona a pessoa antes do menu quando a loja não pode aceitar pedidos. */
export const StoreAvailabilityBanner = () => {
  const { store, hours, isHoursPending } = useStorefrontFacade(useStorefrontSlug())

  if (!store || isHoursPending || isOpen(store, hours)) return null

  return (
    <Box className={styles.wrapper}>
      <Alert variant="warning" title="Pedidos indisponíveis no momento">
        Abra “Detalhes da loja” para consultar os horários.
      </Alert>
    </Box>
  )
}
