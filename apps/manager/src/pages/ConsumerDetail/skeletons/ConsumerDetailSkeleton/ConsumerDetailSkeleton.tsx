import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { ConsumerContactSkeleton } from '@pages/ConsumerDetail/skeletons/ConsumerDetailSkeleton/ConsumerContactSkeleton/ConsumerContactSkeleton'
import { ConsumerHeaderSkeleton } from '@pages/ConsumerDetail/skeletons/ConsumerDetailSkeleton/ConsumerHeaderSkeleton/ConsumerHeaderSkeleton'
import { ConsumerSummarySkeleton } from '@pages/ConsumerDetail/skeletons/ConsumerDetailSkeleton/ConsumerSummarySkeleton/ConsumerSummarySkeleton'
import { ConsumerWorkspaceSkeleton } from '@pages/ConsumerDetail/skeletons/ConsumerDetailSkeleton/ConsumerWorkspaceSkeleton/ConsumerWorkspaceSkeleton'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import styles from './ConsumerDetailSkeleton.module.css'

/* WHY: o Breadcrumb não vira osso — já navega sem o cliente carregado e
 * sumiria da tela se virasse barra cinza. */
export const ConsumerDetailSkeleton = () => (
  <Box className={styles.page}>
    <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />

    <Text as="p" role="status" className="sr-only">
      Carregando o cliente
    </Text>

    <ConsumerHeaderSkeleton />
    <ConsumerSummarySkeleton />
    <ConsumerContactSkeleton />
    <ConsumerWorkspaceSkeleton />
  </Box>
)
