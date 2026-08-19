import { useState } from 'react'

import { Flexbox } from '@nino/ds/components/Flexbox'
import { Input } from '@nino/ds/components/Input'
import { CatalogActions } from '@molecules/CatalogActions/CatalogActions'
import { CategoryChips } from '@organisms/CategoryChips/CategoryChips'
import { MenuBoard } from '@organisms/MenuBoard/MenuBoard'
import { useCategories } from '@hooks/product/useCategories'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { useDebouncedValue } from '@hooks/ui/useDebouncedValue'

import styles from './CatalogWorkspace.module.css'

export const CatalogWorkspace = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const role = useTenantRole()
  const { categories, isPending: isCategoriesPending } =
    useCategories(tenantId)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [term, setTerm] = useState('')
  const search = useDebouncedValue(term.trim())

  return (
    <>
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
          onChange={(event) => setTerm(event.target.value)}
        />

        {role === 'TENANT_OWNER' && <CatalogActions />}
      </Flexbox>

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
    </>
  )
}
