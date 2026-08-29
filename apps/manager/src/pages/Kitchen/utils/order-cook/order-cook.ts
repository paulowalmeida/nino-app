import type { Order } from '@shared/types/order/order'
import type { StaffMember } from '@shared/types/team/staff-member'

/** A atribuição explícita vence o histórico de etapas da comanda. */
export const orderCook = (
  order: Order,
  staff: StaffMember[]
): string | null => {
  return (
    staff.find(({ user }) => user.id === order.kitchenAssigneeId)?.user.name ??
    null
  )
}
