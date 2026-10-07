import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import ghost from './ZoneFormSkeleton.module.css'
import form from '@pages/Settings/components/SettingsDeliverySection/ZoneForm/ZoneForm.module.css'

export const ZoneFormSkeleton = () => (
  <Box className={form.zoneFormSection}>
    <Text as="p" role="status" className="sr-only">
      Carregando o formulário de faixas
    </Text>

    <Box className={form.intro}>
      <Skeleton className={ghost.zoneFormSkeletonTitle} />
      <Skeleton className={ghost.zoneFormSkeletonDescription} />
    </Box>

    <Skeleton className={`${form.slider} ${ghost.slider}`} />

    <Box className={form.zoneForm}>
      <Skeleton className={ghost.zoneFormSkeletonField} />
      <Skeleton className={ghost.zoneFormSkeletonField} />
    </Box>

    <Skeleton className={`${form.submit} ${ghost.submit}`} />
  </Box>
)
