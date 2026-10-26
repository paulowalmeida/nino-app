import { useEffect, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { CatalogActions } from '@pages/Catalog/components/CatalogHeader/CatalogActions/CatalogActions'
import { CatalogToolbar } from '@pages/Catalog/components/CatalogHeader/CatalogToolbar/CatalogToolbar'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'
import { CategoryChips } from '@shared/components/CategoryChips/CategoryChips'
import { useDebouncedValue } from '@shared/hooks/ui/useDebouncedValue/useDebouncedValue'

import motion from '@styles/motion.module.css'
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
    isPagePending,
    isFirstRevealPending,
    canManageCatalog,
  } = useCatalogFacade()
  const debouncedTerm = useDebouncedValue(term)
  useEffect(() => {
    setSearch(debouncedTerm.trim())
  }, [debouncedTerm, setSearch])

  if (isPagePending || isFirstRevealPending) {
    return (
      <Box aria-busy="true" direction="column" className={styles.skeleton}>
        <Text as="p" role="status" className={styles.loadingLabel}>
          Carregando produtos
        </Text>
        <Box
          direction={{ mobile: 'column', tablet: 'row' }}
          justify="between"
          gap={4}
          className={styles.skeletonIdentity}
        >
          <Box direction="column" gap={1}>
            <Skeleton className={styles.skeletonTitle} />
            <Skeleton className={styles.skeletonDescription} />
          </Box>
          <Box
            direction={{ mobile: 'column', tablet: 'row' }}
            gap={2}
            shrink={false}
          >
            <Skeleton className={styles.skeletonManageCategories} />
            <Skeleton className={styles.skeletonNewItem} />
          </Box>
        </Box>
        <Skeleton className={styles.skeletonSearch} />
        <Box direction="row" className={styles.skeletonCategories}>
          <Skeleton className={styles.skeletonCategory} />
          <Skeleton className={styles.skeletonCategoryWide} />
          <Skeleton className={styles.skeletonCategoryWide} />
          <Skeleton className={styles.skeletonCategory} />
          <Skeleton className={styles.skeletonCategoryWide} />
          <Skeleton className={styles.skeletonCategory} />
          <Skeleton className={styles.skeletonCategoryWide} />
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Header
        mb={{ mobile: 3, desktop: 4 }}
        className={`${motion.deal} ${styles.catalogHeader}`}
        title="Produtos"
        accent="Produtos"
        description={DESCRIPTION}
        actions={canManageCatalog ? <CatalogActions /> : undefined}
      />

      <CatalogToolbar term={term} onTermChange={setTerm} />

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
