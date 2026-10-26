import type { SaveAddressRequest } from '@custom_types/address/save-address-request'

export const useSaveAddressMock: { data: SaveAddressRequest } = {
  data: {
    zipCode: '01001000',
    street: 'Rua das Flores',
    number: '123',
    complement: undefined,
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
  },
}
