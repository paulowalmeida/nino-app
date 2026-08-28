import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import local from './CompanyCardSkeleton.module.css'

export const CompanyCardSkeleton = () => (
  <Box as="section" className={local.panel}>
    <p role="status" className="sr-only">
      Carregando empresa
    </p>

    <Box as="header" className={local.head}>
      <Skeleton variant="text" className={local.ghostTitle} />
      <Skeleton variant="text" className={local.ghostHint} />
    </Box>

    <Box className={local.identity}>
      <Skeleton variant="text" className={local.ghostIdentityLabel} />
      <Skeleton variant="text" className={local.ghostIdentityValue} />
    </Box>

    <Box className={local.fields}>
      <Skeleton className={`${local.wide} ${local.ghostField}`} />
      <Skeleton className={`${local.wide} ${local.ghostField}`} />
      <Skeleton className={local.ghostField} />
    </Box>

    <Box className={local.address}>
      <Skeleton variant="text" className={local.ghostGroupTitle} />
      <Box className={local.ghostAddressGrid}>
        <Skeleton className={`${local.ghostField} ${local.ghostZip}`} />
        <Skeleton className={`${local.ghostField} ${local.ghostStreet}`} />
        <Skeleton className={`${local.ghostField} ${local.ghostNumber}`} />
        <Skeleton
          className={`${local.ghostField} ${local.ghostComplement}`}
        />
        <Skeleton
          className={`${local.ghostField} ${local.ghostNeighborhood}`}
        />
        <Skeleton className={`${local.ghostField} ${local.ghostCity}`} />
        <Skeleton className={`${local.ghostField} ${local.ghostState}`} />
      </Box>
    </Box>
  </Box>
)
