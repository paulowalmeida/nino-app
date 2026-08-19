import { Flexbox } from '@nino/ds/components/Flexbox'
import { Input } from '@nino/ds/components/Input'
import { CatalogActions } from '@molecules/CatalogActions/CatalogActions'

import styles from './CatalogToolbar.module.css'

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
  <Flexbox
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
      className={styles.search}
      onChange={(event) => onTermChange(event.target.value)}
    />

    {canManageCategories && <CatalogActions />}
  </Flexbox>
)
