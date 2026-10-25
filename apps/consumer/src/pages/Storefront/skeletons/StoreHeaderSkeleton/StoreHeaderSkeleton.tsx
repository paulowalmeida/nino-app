import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from './StoreHeaderSkeleton.module.css'

type StoreHeaderSkeletonProps = {
  showBanner: boolean
  showSearch: boolean
}

const topBarActions = ['search', 'info', 'notifications', 'cart', 'account']

export const StoreHeaderSkeleton = ({
  showBanner,
  showSearch,
}: StoreHeaderSkeletonProps) => {
  return (
    <Box
      className={styles.storeHeaderSkeletonHeader}
      aria-busy="true"
      aria-label="Carregando cabeçalho da loja"
    >
      <Box className={styles.topBar}>
        <Box direction="row" className={styles.topBarInner}>
          <Box direction="row" className={styles.topBarBrand}>
            <Skeleton className={styles.topBarLogo} />
            <Skeleton className={styles.topBarName} />
          </Box>

          {showSearch && <Skeleton className={styles.topBarSearch} />}

          <Box direction="row" className={styles.topBarActions}>
            <Skeleton className={styles.topBarStatus} />
            {topBarActions
              .filter((action) => showSearch || action !== 'search')
              .map((action) => (
                <Skeleton
                  key={action}
                  className={`${styles.topBarAction} ${
                    action === 'search'
                      ? styles.searchAction
                      : styles.desktopAction
                  }`}
                />
              ))}
          </Box>
        </Box>
      </Box>

      {showBanner && (
        <Box className={styles.storeHeaderSkeletonBanner}>
          <Skeleton className={styles.bannerFill} />
        </Box>
      )}

      <Box className={styles.storeHeaderSkeletonShell}>
        <Box
          direction="row"
          className={`${styles.identityRow} ${!showBanner ? styles.afterBanner : ''}`}
        >
          <Skeleton className={styles.identityLogo} />
          <Box className={styles.identityText}>
            <Skeleton className={styles.identityName} />
            <Box direction="row" className={styles.identityMetaRow}>
              <Skeleton className={styles.identityMeta} />
              <Skeleton className={styles.identityDetails} />
            </Box>
          </Box>
        </Box>

        {showSearch && (
          <Skeleton className={styles.storeHeaderSkeletonSearch} />
        )}
      </Box>
    </Box>
  )
}
