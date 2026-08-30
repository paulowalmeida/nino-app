import { guestOrderRequestMock } from '@pages/checkout/adapters/guestOrderRequest.adapter/guestOrderRequest.adapter.mock'

export const usePlaceOrderMock = {
  input: {
    values: guestOrderRequestMock.values,
    store: guestOrderRequestMock.store,
    cartLines: guestOrderRequestMock.cartLines,
  },
}
