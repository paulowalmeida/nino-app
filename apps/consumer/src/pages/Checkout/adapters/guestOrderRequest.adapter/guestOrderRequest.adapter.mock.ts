import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@custom_types/checkout/checkout-form-values'
import type { Store } from '@custom_types/store/store'

export const guestOrderRequestMock = {
  values: {
    channel: 'PICKUP',
    paymentMethod: 'CASH',
    guestName: 'Maria Silva',
    guestPhone: '11987654321',
  } as CheckoutFormValues,
  store: { id: 'tenant-1' } as Store,
  cartLines: [
    { item: { id: 'product-1', price: '12.5' }, quantity: 2 },
  ] as CartLine[],
}
