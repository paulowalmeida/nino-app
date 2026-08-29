import { forwardRef } from 'react'

import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Box } from '@nino/ds/components/Box'
import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'
import { useHomeSlug } from '@pages/Home/hooks/useHomeSlug/useHomeSlug'

import styles from './MenuSearchField.module.css'

/**
 * A busca da página desaparece à medida que a do topo assume — é a mesma
 * busca em dois lugares, nunca duas visíveis ao mesmo tempo.
 */
export const MenuSearchField = forwardRef<HTMLInputElement>((_, ref) => {
  const { search, setSearch } = useHomeFacade(useHomeSlug())
  return (
    <Box className={styles.toolbar}>
      <Box className={styles.field}>
        <Icon name="search" className={styles.icon} />
        <Input
          ref={ref}
          type="search"
          aria-label="Buscar no cardápio"
          placeholder="Buscar no cardápio"
          className={styles.input}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Box>
    </Box>
  )
})

MenuSearchField.displayName = 'MenuSearchField'
