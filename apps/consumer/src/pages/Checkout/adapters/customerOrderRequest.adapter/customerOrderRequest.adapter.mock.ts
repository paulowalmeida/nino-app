import { guestOrderRequestMock } from '@pages/checkout/adapters/guestOrderRequest.adapter/guestOrderRequest.adapter.mock'

export const customerOrderRequestAdapterMock = {
  ...guestOrderRequestMock,
  deliveryAddressId: 'address-1',
}
