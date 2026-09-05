import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'
import type { CreateCustomerOrderRequest } from '@custom_types/order/create-customer-order-request'
import type { Store } from '@custom_types/store/store'
import { orderItemsRequest } from '@pages/checkout/adapters/orderItemsRequest.adapter/orderItemsRequest.adapter'

export const customerOrderRequest = (
  values: CheckoutFormValues,
  store: Store,
  cartLines: CartLine[]
): CreateCustomerOrderRequest => ({
  tenantId: store.id,
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
