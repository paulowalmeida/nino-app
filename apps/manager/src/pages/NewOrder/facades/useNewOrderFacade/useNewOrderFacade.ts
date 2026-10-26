import { useNewOrderAvailability } from '@pages/NewOrder/hooks/useNewOrderAvailability/useNewOrderAvailability'
import { useNewOrderDraft } from '@pages/NewOrder/hooks/useNewOrderDraft/useNewOrderDraft'
import { useNewOrderPlacement } from '@pages/NewOrder/hooks/useNewOrderPlacement/useNewOrderPlacement'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useNewOrderFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const menu = useMenu(unitId)
  const draft = useNewOrderDraft()
  const availability = useNewOrderAvailability(unitId, draft)
  const placement = useNewOrderPlacement(unitId, draft, availability.method)

  return {
    sections: menu.sections,
    isMenuPending: menu.isPending,
    draft,
    availability,
    failed: placement.failed,
    isSubmitting: placement.isSubmitting,
    placeOrder: placement.placeOrder,
    resetDraft: draft.reset,
  }
}
