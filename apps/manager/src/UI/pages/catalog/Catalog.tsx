import { useState } from 'react'

import { Flexbox } from '@nino/ds/components/Flexbox'
import { Header } from '@nino/ds/components/Header'
import { CategoryChips } from '@organisms/CategoryChips/CategoryChips'
import { CatalogToolbar } from '@organisms/CatalogToolbar/CatalogToolbar'
import { useCategories } from '@hooks/product/useCategories'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { useDebouncedValue } from '@hooks/ui/useDebouncedValue'
import { MenuBoard } from '@templates/MenuBoard/MenuBoard'

import styles from './Catalog.module.css'

const DESCRIPTION =
  'Desligue o que acabou — o item some do app do cliente na hora.'

export const Catalog = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const role = useTenantRole()
  const { categories, isPending: isCategoriesPending } =
    useCategories(tenantId)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [term, setTerm] = useState('')
  const search = useDebouncedValue(term.trim())

  return (
    <Flexbox className={styles.page}>
      <Header
        mb={{ mobile: 3, desktop: 4 }}
        className={styles.header}
        title="Cardápio"
        accent="Cardápio"
        description={DESCRIPTION}
      />

      <CatalogToolbar
        term={term}
        onTermChange={setTerm}
        canManageCategories={role === 'TENANT_OWNER'}
      />

      <Flexbox shrink={false} mb={3}>
        <CategoryChips
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
          isPending={isCategoriesPending}
        />
      </Flexbox>

      <Flexbox className={styles.scroller}>
        <MenuBoard
          tenantId={tenantId}
          categoryId={categoryId}
          search={search}
        />
      </Flexbox>
    </Flexbox>
  )
}
