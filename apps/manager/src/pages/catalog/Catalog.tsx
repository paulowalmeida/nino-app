import { Flexbox } from '@nino/ds/components/Flexbox'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Input } from '@nino/ds/components/Input'
import { Header } from '@nino/ds/components/Header'
import { CategoryChips } from '@compositions/CategoryChips/CategoryChips'
import { MenuBoard } from '@compositions/MenuBoard/MenuBoard'
import { useCategories } from '@hooks/product/useCategories'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { useDebouncedValue } from '@hooks/ui/useDebouncedValue'

import styles from './Catalog.module.css'
import motion from '@styles/motion.module.css'

export const Catalog = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const role = useTenantRole()

  const { categories, isPending: isCategoriesPending } = useCategories(tenantId)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [term, setTerm] = useState('')
  const search = useDebouncedValue(term.trim())

  const ordered = [...categories].sort((a, b) => a.position - b.position)

  return (
    <div className={styles.page}>
      <Header
        mb={{ mobile: 3, desktop: 4 }}
        className={styles.header}
        title="Cardápio"
        accent="Cardápio"
        description="Desligue o que acabou — o item some do app do cliente na hora."
      />

      {/*
        Busca e ações na mesma barra: no desktop as ações não cabiam no slot do
        Header sem espremer o título, e numa faixa própria ficavam soltas.
      */}
      <Flexbox direction={{ mobile: 'column', desktop: 'row' }} gap={{ mobile: 2, desktop: 4 }} align={{ desktop: 'center' }} shrink={false} mb={3}>
        <Input
          type="search"
          value={term}
          placeholder="Buscar item pelo nome"
          aria-label="Buscar item pelo nome"
          className={styles.search}
          onChange={(event) => setTerm(event.target.value)}
        />

        {role === 'TENANT_OWNER' && (
          <div className={styles.actions}>
            <Button
              asChild
              variant="outline"
              className={`${motion.press} ${styles.manageCategories}`}
            >
              <Link to="categorias">Gerenciar categorias</Link>
            </Button>
            <Button asChild className={`${motion.press} ${styles.newItem}`}>
              <Link to="novo">Novo item</Link>
            </Button>
          </div>
        )}
      </Flexbox>

      <div className={styles.chips}>
        <CategoryChips
          categories={ordered}
          value={categoryId}
          onChange={setCategoryId}
          isPending={isCategoriesPending}
        />
      </div>

      {/* só a lista rola: título, busca e fichas ficam parados */}
      <div className={styles.scroller}>
        <MenuBoard
          tenantId={tenantId}
          categoryId={categoryId}
          search={search}
        />
      </div>
    </div>
  )
}
