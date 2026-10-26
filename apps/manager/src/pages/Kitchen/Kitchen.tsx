import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { KitchenWorkspace } from '@pages/Kitchen/components/KitchenWorkspace/KitchenWorkspace'
import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'

import styles from './Kitchen.module.css'

export const Kitchen = () => {
  const { isError } = useKitchenFacade()

  return (
    <Box className={styles.screen}>
      {isError ? (
        <EmptyState className={styles.failure}>
          Não foi possível carregar os pedidos. Recarregue a página para tentar
          de novo.
        </EmptyState>
      ) : (
        <KitchenWorkspace />
      )}
    </Box>
  )
}
