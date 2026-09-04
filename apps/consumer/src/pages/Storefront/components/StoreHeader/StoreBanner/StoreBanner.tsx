import styles from './StoreBanner.module.css'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { storeInitials } from '@utils/store-info'

export const StoreBanner = () => {
  const { store } = useStorefrontFacade()
  return (
    <Box className={styles.banner}>
      {store?.logoUrl && (
        <img src={store.logoUrl} alt="" className={styles.mark} />
      )}
      {!store?.logoUrl && store && (
        <Text as="span" className={styles.monogram} aria-hidden="true">
          {storeInitials(store)}
        </Text>
      )}
    </Box>
  )
}
