import { useState } from 'react'

import { Flexbox } from '@nino/ds/components/Flexbox'
import { useDebouncedValue } from '@hooks/ui/useDebouncedValue'

import { CatalogBoardContainer } from '@containers/CatalogBoardContainer/CatalogBoardContainer'
import { CatalogHeaderContainer } from '@containers/CatalogHeaderContainer/CatalogHeaderContainer'
import styles from './Catalog.module.css'

export const Catalog = () => {
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [term, setTerm] = useState('')
  const search = useDebouncedValue(term.trim())

  return (
    <Flexbox className={styles.page}>
      <CatalogHeaderContainer
        term={term}
        categoryId={categoryId}
        onTermChange={setTerm}
        onCategoryChange={setCategoryId}
      />
      <CatalogBoardContainer categoryId={categoryId} search={search} />
    </Flexbox>
  )
}
