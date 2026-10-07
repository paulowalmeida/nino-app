import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import ghost from './ConsumerContactSkeleton.module.css'
import contact from '@pages/ConsumerDetail/components/ConsumerContact/ConsumerContact.module.css'

export const ConsumerContactSkeleton = () => (
  <Box
    as="section"
    aria-label="Contato"
    direction="row"
    gap={{ mobile: 2, desktop: 4 }}
    align="center"
    wrap
    className={contact.contact}
  >
    <Box direction="row" gap={2} wrap className={contact.consumerContactActions}>
      <Skeleton className={ghost.consumerContactSkeletonAction} />
      <Skeleton className={ghost.consumerContactSkeletonAction} />
    </Box>

    <Skeleton className={ghost.document} />
  </Box>
)
