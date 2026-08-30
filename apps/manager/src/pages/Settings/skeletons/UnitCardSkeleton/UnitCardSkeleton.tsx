import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import ghost from './UnitCardSkeleton.module.css'
import panel from
  '../../components/SettingsUnitDetailSection/UnitCard/UnitCard.module.css'
import address from '@shared/components/AddressFields/AddressFields.module.css'

export const UnitCardSkeleton = () => (
  <Box as="section" className={panel.panel}>
    <Text as="p" role="status" className="sr-only">
      Carregando os dados da unidade
    </Text>

    <Box as="header" align="start" justify="between" wrap gap={3} mb={4}>
      <Skeleton className={ghost.title} />
      <Skeleton className={ghost.promote} />
    </Box>

    <Box direction="row" gap={0.5} className={ghost.tabs}>
      <Skeleton className={ghost.tab} />
      <Skeleton className={ghost.tab} />
    </Box>

    <Box className={panel.fields}>
      <Box direction="column" gap={1.5}>
        <Skeleton className={ghost.label} />
        <Skeleton className={ghost.input} />
      </Box>
      <Box direction="column" gap={1.5}>
        <Skeleton className={ghost.label} />
        <Skeleton className={ghost.input} />
      </Box>
      <Box direction="column" gap={1.5}>
        <Skeleton className={ghost.label} />
        <Skeleton className={ghost.input} />
      </Box>
    </Box>

    <Box className={panel.address}>
      <Skeleton className={ghost.groupTitle} />
      <Box className={address.grid}>
        <Skeleton className={`${ghost.input} ${address.zip}`} />
        <Skeleton className={`${ghost.input} ${address.street}`} />
        <Skeleton className={`${ghost.input} ${address.number}`} />
        <Skeleton className={`${ghost.input} ${address.complement}`} />
        <Skeleton className={`${ghost.input} ${address.neighborhood}`} />
        <Skeleton className={`${ghost.input} ${address.city}`} />
        <Skeleton className={`${ghost.input} ${address.state}`} />
      </Box>
    </Box>

    <Skeleton className={ghost.save} />
  </Box>
)
