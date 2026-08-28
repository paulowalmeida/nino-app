import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import ghost from './CollaboratorHeaderSkeleton.module.css'
import hero from '@pages/CollaboratorDetail/components/CollaboratorHeader/CollaboratorHeader.module.css'

export const CollaboratorHeaderSkeleton = () => (
  <Box as="header" direction="row" gap={4} align="center" className={hero.hero}>
    <Skeleton variant="circle" className={hero.mark} />

    <Box className={hero.heroText}>
      <Skeleton className={ghost.eyebrow} />
      <Skeleton className={ghost.name} />
      <Skeleton className={ghost.cadence} />
    </Box>
  </Box>
)
