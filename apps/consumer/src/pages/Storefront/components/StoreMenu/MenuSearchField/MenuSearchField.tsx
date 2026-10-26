import { forwardRef } from 'react'

import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Box } from '@nino/ds/components/Box'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import styles from './MenuSearchField.module.css'

/**
 * A busca da página desaparece à medida que a do topo assume — é a mesma
 * busca em dois lugares, nunca duas visíveis ao mesmo tempo.
 */
export const MenuSearchField = forwardRef<HTMLInputElement>((_, ref) => {
  const { search, setSearch } = useStorefrontFacade()
  return (
    <Box className={styles.menuSearchFieldToolbar}>
      <Box className={styles.menuSearchField}>
        <Icon name="search" className={styles.menuSearchFieldIcon} />
        <Input
          ref={ref}
          type="search"
          aria-label="Buscar no cardápio"
          placeholder="Buscar no cardápio"
          className={styles.menuSearchFieldInput}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Box>
    </Box>
  )
})

MenuSearchField.displayName = 'MenuSearchField'
