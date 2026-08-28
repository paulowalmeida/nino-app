import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import ghost from './CustomerHeaderSkeleton.module.css'
import hero from '@pages/CustomerDetail/components/CustomerHeader/CustomerHeader.module.css'

export const CustomerHeaderSkeleton = () => (
  <Box as="header" direction="row" gap={4} align="center" className={hero.hero}>
    <Skeleton variant="circle" className={hero.mark} />

    <Box className={hero.heroText}>
      <Skeleton className={ghost.eyebrow} />
      <Skeleton className={ghost.name} />
      <Skeleton className={ghost.cadence} />
    </Box>
  </Box>
)
