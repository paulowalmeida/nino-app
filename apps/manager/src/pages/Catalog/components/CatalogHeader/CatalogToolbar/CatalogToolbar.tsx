import { Box } from '@nino/ds/components/Box'
import { Input } from '@nino/ds/components/Input'

import styles from '@pages/Catalog/components/CatalogHeader/CatalogToolbar/CatalogToolbar.module.css'

type CatalogToolbarProps = {
  term: string
  onTermChange: (term: string) => void
}

export const CatalogToolbar = ({
  term,
  onTermChange,
}: CatalogToolbarProps) => (
  <Box shrink={false} mb={3}>
    <Input
      type="search"
      value={term}
      placeholder="Buscar item pelo nome"
      aria-label="Buscar item pelo nome"
      className={styles.catalogToolbarSearch}
      onChange={(event) => onTermChange(event.target.value)}
    />
  </Box>
)
