import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useMenuImagesReady } from '@pages/Counter/hooks/useMenuImagesReady/useMenuImagesReady'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import motion from '@styles/motion.module.css'
import styles from './CounterHeader.module.css'

export const CounterHeader = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const { sections, isPending, isError, isSuccess } = useMenu(unitId)
  const { areMenuImagesReady } = useMenuImagesReady(sections)
  const isLoading = !isError && (isPending || !isSuccess || !areMenuImagesReady)

  if (isLoading) {
    return (
      <Box
        aria-busy="true"
        className={`${motion.deal} ${styles.skeletonHeader}`}
        direction="column"
        gap={1}
        mb={4}
      >
        <Text as="p" role="status" className={styles.loadingLabel}>
          Carregando balcão
        </Text>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.description} />
      </Box>
    )
  }

  return (
    <Header
      mb={4}
      className={motion.deal}
      title="Balcão"
      accent="Balcão"
      description="Monte o pedido de quem está na loja e feche a venda."
    />
  )
}
