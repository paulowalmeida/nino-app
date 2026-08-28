import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { KitchenBoard } from '@pages/Kitchen/components/KitchenBoard/KitchenBoard'
import { KitchenHeader } from '@pages/Kitchen/components/KitchenHeader/KitchenHeader'
import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'

import styles from './Kitchen.module.css'

export const Kitchen = () => {
  const { isError } = useKitchenFacade()
  const [isCompact, setIsCompact] = useState(false)

  return (
    <Box className={styles.screen}>
      <KitchenHeader
        isCompact={isCompact}
        onToggleCompact={() => setIsCompact((current) => !current)}
      />

      {isError ? (
        <EmptyState className={styles.failure}>
          Não foi possível carregar os pedidos. Recarregue a página para tentar
          de novo.
        </EmptyState>
      ) : (
        <KitchenBoard isCompact={isCompact} />
      )}
    </Box>
  )
}
