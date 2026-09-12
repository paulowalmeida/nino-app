import { guestOrderRequestMock } from '@pages/checkout/adapters/guestOrderRequest.adapter/guestOrderRequest.adapter.mock'

export const consumerOrderRequestAdapterMock = {
  ...guestOrderRequestMock,
  deliveryAddressId: 'address-1',
}
