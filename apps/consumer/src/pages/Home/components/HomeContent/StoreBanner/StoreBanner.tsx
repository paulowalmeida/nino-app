import styles from './StoreBanner.module.css'
import { Box } from '@nino/ds/components/Box'
import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'
import { useHomeSlug } from '@pages/Home/hooks/useHomeSlug/useHomeSlug'

export const StoreBanner = () => {
  const { store } = useHomeFacade(useHomeSlug())
  return (
    <Box className={styles.banner}>
      {store?.logoUrl && (
        <img src={store.logoUrl} alt="" className={styles.mark} />
      )}
      <Box className={styles.scrim} />
    </Box>
  )
}
