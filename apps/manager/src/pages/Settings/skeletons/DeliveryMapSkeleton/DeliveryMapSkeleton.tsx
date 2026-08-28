import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import ghost from './DeliveryMapSkeleton.module.css'
import map from '@pages/Settings/components/SettingsDeliverySection/DeliveryMap/DeliveryMap.module.css'

export const DeliveryMapSkeleton = () => (
  <Box className={map.wrapper}>
    <Text as="p" role="status" className="sr-only">
      Carregando a área de atendimento
    </Text>

    <Box className={map.header}>
      <Skeleton className={ghost.title} />
      <Skeleton className={ghost.status} />
    </Box>
    <Skeleton className={`${map.map} ${ghost.frame}`} />
  </Box>
)
