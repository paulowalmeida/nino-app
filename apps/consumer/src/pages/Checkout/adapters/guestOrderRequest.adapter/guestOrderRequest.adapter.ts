import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'
import type { CreateGuestOrderRequest } from '@custom_types/order/create-guest-order-request'
import type { Store } from '@custom_types/store/store'

import { toE164 } from '@utils/phone'

/** Campos de entrega só fazem sentido quando o pedido é `DELIVERY`. */
export const guestOrderRequest = (
  values: CheckoutFormValues,
  store: Store,
  cartLines: CartLine[]
): CreateGuestOrderRequest => {
  const isDelivery = values.channel === 'DELIVERY'

  return {
    tenantId: store.id,
    channel: values.channel,
    deliveryZoneId: isDelivery ? values.deliveryZoneId : undefined,
    paymentMethod: values.paymentMethod,
    changeFor: values.paymentMethod === 'CASH' ? values.changeFor : undefined,
    guestName: values.guestName,
    guestPhone: toE164(values.guestPhone),
    guestZipCode: isDelivery ? values.guestZipCode : undefined,
    guestStreet: isDelivery ? values.guestStreet : undefined,
    guestNumber: isDelivery ? values.guestNumber : undefined,
    guestComplement: isDelivery ? values.guestComplement : undefined,
    guestNeighborhood: isDelivery ? values.guestNeighborhood : undefined,
    guestCity: values.guestCity,
    guestState: values.guestState,
    notes: values.notes,
    items: cartLines.map(({ item, quantity }) => ({
      productId: item.id,
      quantity,
      unitPrice: Number(item.price),
    })),
  }
}
