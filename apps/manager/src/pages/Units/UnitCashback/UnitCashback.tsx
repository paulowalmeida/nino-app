import { useUnitCashbackFacade } from '@pages/Units/facades/useUnitCashbackFacade/useUnitCashbackFacade'

import { CashbackRules } from './CashbackRules/CashbackRules'

export const UnitCashback = () => {
  const { query, save } = useUnitCashbackFacade()

  return (
    <CashbackRules
      settings={query.data}
      isPending={query.isPending}
      isSaving={save.isPending}
      onSave={save.mutate}
    />
  )
}
