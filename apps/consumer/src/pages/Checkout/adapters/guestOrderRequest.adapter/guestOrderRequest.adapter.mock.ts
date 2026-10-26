import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'
import type { Store } from '@custom_types/store/store'

export const guestOrderRequestMock = {
  values: {
    channel: 'PICKUP',
    paymentMethod: 'CASH',
    guestName: 'Maria Silva',
    guestPhone: '11987654321',
  } as CheckoutFormValues,
  store: { id: 'unit-1' } as Store,
  cartLines: [
    { item: { id: 'product-1', price: '12.5' }, quantity: 2 },
  ] as CartLine[],
}
