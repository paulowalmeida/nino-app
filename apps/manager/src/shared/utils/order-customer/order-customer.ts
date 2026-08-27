import type { Order } from '@shared/types/order/order'

export const customerNameOf = (order: Order): string =>
  order.guestName ?? 'Cliente sem cadastro'

const formatAddress = (
  street: string,
  number: string | null,
  complement: string | null,
  neighborhood: string | null
): string => {
  const line = [street, number].filter(Boolean).join(', ')
  const rest = [complement, neighborhood].filter(Boolean).join(' · ')

  return rest ? `${line} — ${rest}` : line
}

export const addressOf = (order: Order): string | null => {
  if (order.deliveryAddress) {
    const { street, number, complement, neighborhood } = order.deliveryAddress
    return formatAddress(street, number, complement, neighborhood)
  }

  if (!order.guestStreet) return null

  return formatAddress(
    order.guestStreet,
    order.guestNumber,
    order.guestComplement,
    order.guestNeighborhood
  )
}
