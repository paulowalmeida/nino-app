import { Image } from '@nino/ds/components/Image'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { useStorefrontSlug } from '@pages/Storefront/hooks/useStorefrontSlug/useStorefrontSlug'
import { isOpen } from '@utils/store-info'
import { displayName, storeInitials } from '@utils/store-info'
import { riseDelay } from '@utils/rise-delay'

import styles from './StoreIdentity.module.css'
import motion from '@styles/motion.module.css'

export const StoreIdentity = () => {
  const { store, isHoursPending, hours, estimatedMinutes, setInfoOpen } =
    useStorefrontFacade(useStorefrontSlug())
  if (!store) return null
  const isStoreOpen = isHoursPending || isOpen(store, hours)
  return (
    <Box direction="row" className={styles.identityRow}>
      <Box className={styles.logoTile}>
        <Image
          src={store.logoUrl}
          alt=""
          className={styles.logoImg}
          wrapperClassName={styles.logoStack}
          placeholder={
            <Text as="span" className={styles.logoFallback}>
              {storeInitials(store)}
            </Text>
          }
        />
      </Box>

      <Box className={styles.identity}>
        <Heading level={1} className={`${motion.deal} ${styles.name}`}>
          {displayName(store)}
        </Heading>
        <Text
          className={`${motion.deal} ${styles.identityMeta}`}
          style={riseDelay(70)}
        >
          <Button
            variant="ghost"
            size="sm"
            className={styles.more}
            onClick={() => setInfoOpen(true)}
          >
            Detalhes da loja
          </Button>
          <Text as="span" className={styles.sep}>
            ·
          </Text>
          <Text as="span" className={styles.status}>
            <span
              className={
                isStoreOpen ? `${styles.dot} ${styles.dotOn}` : styles.dot
              }
              aria-hidden="true"
            />
            {isStoreOpen ? 'Aberto agora' : 'Fechado'}
          </Text>
          {isStoreOpen && estimatedMinutes ? (
            <>
              <Text as="span" className={styles.sep}>
                ·
              </Text>
              <Text as="span" className={styles.time}>
                ~{estimatedMinutes} min
              </Text>
            </>
          ) : null}
        </Text>
      </Box>
    </Box>
  )
}
