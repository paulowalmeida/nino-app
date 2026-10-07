import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import ghost from './PersonalizeSkeleton.module.css'

export const PersonalizeSkeleton = () => (
  <Box className={ghost.personalizeSkeletonPage}>
    <Text as="p" role="status" className={ghost.loadingLabel}>
      Carregando a personalização da loja
    </Text>

    <Box className={ghost.personalizeSkeletonHeader}>
      <Skeleton className={ghost.trail} />
      <Skeleton className={ghost.personalizeSkeletonTitle} />
      <Skeleton className={ghost.personalizeSkeletonSubtitle} />
    </Box>

    <Box className={ghost.studio}>
      <Box className={ghost.dock}>
        <Skeleton className={ghost.dockBar} />
        <Skeleton className={ghost.frame} />
      </Box>

      <Box className={ghost.personalizeSkeletonControls}>
        <Box className={ghost.personalizeSkeletonSection}>
          <Skeleton className={ghost.sectionTitle} />
          <Box direction="row" gap={2} className={ghost.themes}>
            <Skeleton className={ghost.theme} />
            <Skeleton className={ghost.theme} />
            <Skeleton className={ghost.theme} />
          </Box>
        </Box>

        <Box className={ghost.personalizeSkeletonSection}>
          <Skeleton className={ghost.sectionTitle} />
          <Box className={ghost.personalizeSkeletonGrid}>
            <Skeleton className={ghost.tile} />
            <Skeleton className={ghost.tile} />
            <Skeleton className={ghost.tile} />
            <Skeleton className={ghost.tile} />
            <Skeleton className={ghost.tile} />
            <Skeleton className={ghost.tile} />
          </Box>
        </Box>

        <Box className={ghost.personalizeSkeletonSection}>
          <Skeleton className={ghost.sectionTitle} />
          <Skeleton className={ghost.upload} />
        </Box>
      </Box>
    </Box>
  </Box>
)
