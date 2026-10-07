import { useEffect, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { CatalogToolbar } from '@pages/Catalog/components/CatalogHeader/CatalogToolbar/CatalogToolbar'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'
import { CategoryChips } from '@shared/components/CategoryChips/CategoryChips'
import { useDebouncedValue } from '@shared/hooks/ui/useDebouncedValue/useDebouncedValue'

import styles from '@pages/Catalog/components/CatalogHeader/CatalogHeader.module.css'

const DESCRIPTION =
  'Desligue o que acabou — o item some do app do cliente na hora.'

export const CatalogHeader = () => {
  const [term, setTerm] = useState('')
  const {
    categoryId,
    setSearch,
    setCategoryId,
    categories,
    categoriesStatus,
    unitRole,
  } = useCatalogFacade()
  const debouncedTerm = useDebouncedValue(term)
  useEffect(() => {
    setSearch(debouncedTerm.trim())
  }, [debouncedTerm, setSearch])
  return (
    <>
      <Header
        mb={{ mobile: 3, desktop: 4 }}
        className={styles.catalogHeader}
        title="Cardápio"
        accent="Cardápio"
        description={DESCRIPTION}
      />

      <CatalogToolbar
        term={term}
        onTermChange={setTerm}
        canManageCategories={
          unitRole === 'UNIT_OWNER' || unitRole === 'MANAGER'
        }
      />

      <Box shrink={false} mb={3}>
        <CategoryChips
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
          isPending={categoriesStatus === 'loading'}
        />
      </Box>
    </>
  )
}
