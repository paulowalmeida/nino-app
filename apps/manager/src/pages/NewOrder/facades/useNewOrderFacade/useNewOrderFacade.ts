import { useNewOrderAvailability } from '@pages/NewOrder/hooks/useNewOrderAvailability/useNewOrderAvailability'
import { useNewOrderDraft } from '@pages/NewOrder/hooks/useNewOrderDraft/useNewOrderDraft'
import { useNewOrderPlacement } from '@pages/NewOrder/hooks/useNewOrderPlacement/useNewOrderPlacement'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useNewOrderFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const menu = useMenu(tenantId)
  const draft = useNewOrderDraft()
  const availability = useNewOrderAvailability(tenantId, draft)
  const placement = useNewOrderPlacement(tenantId, draft, availability.method)

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
