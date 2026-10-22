import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'
import { useMenuImagesReady } from '@pages/Counter/hooks/ui/useMenuImagesReady/useMenuImagesReady'

import motion from '@styles/motion.module.css'
import styles from './CounterHeader.module.css'

export const CounterHeader = () => {
  const { sections, isMenuPending, isMenuError, isMenuSuccess } =
    useCounterFacade()
  const { areMenuImagesReady } = useMenuImagesReady(sections)
  const isLoading =
    !isMenuError &&
    (isMenuPending || !isMenuSuccess || !areMenuImagesReady)

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
