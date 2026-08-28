import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import ghost from './CustomerContactSkeleton.module.css'
import contact from '@pages/CustomerDetail/components/CustomerContact/CustomerContact.module.css'

export const CustomerContactSkeleton = () => (
  <Box
    as="section"
    aria-label="Contato"
    direction="row"
    gap={{ mobile: 2, desktop: 4 }}
    align="center"
    wrap
    className={contact.contact}
  >
    <Box direction="row" gap={2} wrap className={contact.actions}>
      <Skeleton className={ghost.action} />
      <Skeleton className={ghost.action} />
    </Box>

    <Skeleton className={ghost.document} />
  </Box>
)
