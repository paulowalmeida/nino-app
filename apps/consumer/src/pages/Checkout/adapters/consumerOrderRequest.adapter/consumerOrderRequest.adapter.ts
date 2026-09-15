import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'
import type { CreateConsumerOrderRequest } from '@custom_types/order/create-consumer-order-request'
import type { Store } from '@custom_types/store/store'
import { orderItemsRequest } from '@pages/checkout/adapters/orderItemsRequest.adapter/orderItemsRequest.adapter'

export const consumerOrderRequest = (
  values: CheckoutFormValues,
  store: Store,
  cartLines: CartLine[]
): CreateConsumerOrderRequest => ({
  unitId: store.id,
  channel: values.channel,
  deliveryAddressId:
    values.channel === 'DELIVERY' ? values.deliveryAddressId : undefined,
  deliveryZoneId:
    values.channel === 'DELIVERY' ? values.deliveryZoneId : undefined,
  paymentMethod: values.paymentMethod,
  changeFor: values.paymentMethod === 'CASH' ? values.changeFor : undefined,
  notes: values.notes,
  items: orderItemsRequest(cartLines),
})
