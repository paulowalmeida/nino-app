import { EmptyState } from '@nino/ds/components/EmptyState'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

import motion from '@styles/motion.module.css'

export const MenuBoardEmptyState = () => {
  const { search } = useCatalogFacade()

  return (
    <EmptyState size="md" className={motion.unroll}>
      {search
        ? `Nenhum item com "${search}". Tente outro nome.`
        : 'Nada nesta categoria ainda. Cadastre o primeiro item.'}
    </EmptyState>
  )
}
