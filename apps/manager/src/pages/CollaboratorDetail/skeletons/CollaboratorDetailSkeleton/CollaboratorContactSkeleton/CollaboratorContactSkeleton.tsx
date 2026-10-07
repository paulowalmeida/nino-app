import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import ghost from './CollaboratorContactSkeleton.module.css'
import contact from '@pages/CollaboratorDetail/components/CollaboratorContact/CollaboratorContact.module.css'

export const CollaboratorContactSkeleton = () => (
  <Box
    as="section"
    aria-label="Contato"
    direction="row"
    align="center"
    wrap
    className={contact.contact}
  >
    <Box direction="row" wrap className={contact.collaboratorContactActions}>
      <Skeleton className={ghost.collaboratorContactSkeletonAction} />
      <Skeleton className={ghost.collaboratorContactSkeletonAction} />
    </Box>

    <Skeleton className={ghost.provider} />
  </Box>
)
