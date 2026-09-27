import { EmptyState } from '@nino/ds/components/EmptyState'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

import motion from '@styles/motion.module.css'

export const MenuBoardEmptyState = () => {
  const { search } = useCatalogFacade()

  return (
    <EmptyState
      size="md"
      illustration={search ? undefined : <NinoMascot />}
      className={motion.unroll}
    >
      {search
        ? `Nenhum item com "${search}". Tente outro nome.`
        : 'Nada nesta categoria ainda. Cadastre o primeiro item.'}
    </EmptyState>
  )
}
