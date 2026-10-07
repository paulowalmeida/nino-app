import { Box } from '@nino/ds/components/Box'
import { Input } from '@nino/ds/components/Input'
import { CatalogActions } from '@pages/Catalog/components/CatalogHeader/CatalogActions/CatalogActions'

import styles from '@pages/Catalog/components/CatalogHeader/CatalogToolbar/CatalogToolbar.module.css'

type CatalogToolbarProps = {
  term: string
  onTermChange: (term: string) => void
  canManageCategories: boolean
}

export const CatalogToolbar = ({
  term,
  onTermChange,
  canManageCategories,
}: CatalogToolbarProps) => (
  <Box
    direction={{ mobile: 'column', desktop: 'row' }}
    gap={{ mobile: 2, desktop: 4 }}
    align={{ desktop: 'center' }}
    shrink={false}
    mb={3}
  >
    <Input
      type="search"
      value={term}
      placeholder="Buscar item pelo nome"
      aria-label="Buscar item pelo nome"
      className={styles.catalogToolbarSearch}
      onChange={(event) => onTermChange(event.target.value)}
    />

    {canManageCategories && <CatalogActions />}
  </Box>
)
