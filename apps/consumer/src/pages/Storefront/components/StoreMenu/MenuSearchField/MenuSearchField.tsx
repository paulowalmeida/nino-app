import { forwardRef } from 'react'

import { Icon } from '@nino/ds/components/Icon'
import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import styles from './MenuSearchField.module.css'

/**
 * Parece um campo, mas é o gatilho da busca: abre a modal e não filtra a
 * lista da página. É botão, e não campo que abre ao focar, porque o foco
 * volta para ele ao fechar a modal e reabriria a busca em loop.
 */
export const MenuSearchField = forwardRef<HTMLButtonElement>((_, ref) => {
  const { setSearchOpen } = useStorefrontFacade()
  return (
    <Box className={styles.menuSearchFieldToolbar}>
      <Button
        ref={ref}
        variant="ghost"
        className={styles.menuSearchFieldTrigger}
        aria-haspopup="dialog"
        onClick={() => setSearchOpen(true)}
      >
        <Icon name="search" className={styles.menuSearchFieldIcon} />
        Buscar no cardápio
      </Button>
    </Box>
  )
})

MenuSearchField.displayName = 'MenuSearchField'
