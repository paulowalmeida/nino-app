import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { CatalogToolbar } from '@organisms/CatalogToolbar/CatalogToolbar'
import { useCategories } from '@hooks/product/useCategories'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { CategoryChips } from '@molecules/CategoryChips/CategoryChips'

import styles from './CatalogHeaderContainer.module.css'

const DESCRIPTION =
  'Desligue o que acabou — o item some do app do cliente na hora.'

type CatalogHeaderContainerProps = {
  term: string
  categoryId: string | null
  onTermChange: (term: string) => void
  onCategoryChange: (categoryId: string | null) => void
}

export const CatalogHeaderContainer = ({
  term,
  categoryId,
  onTermChange,
  onCategoryChange,
}: CatalogHeaderContainerProps) => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const role = useTenantRole()
  const { categories, isPending } = useCategories(tenantId)

  return (
    <>
      <Header
        mb={{ mobile: 3, desktop: 4 }}
        className={styles.header}
        title="Cardápio"
        accent="Cardápio"
        description={DESCRIPTION}
      />

      <CatalogToolbar
        term={term}
        onTermChange={onTermChange}
        canManageCategories={role === 'TENANT_OWNER'}
      />

      <Box shrink={false} mb={3}>
        <CategoryChips
          categories={categories}
          value={categoryId}
          onChange={onCategoryChange}
          isPending={isPending}
        />
      </Box>
    </>
  )
}
