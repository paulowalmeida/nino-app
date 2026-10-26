import type { SaveAddressRequest } from '@custom_types/address/save-address-request'

export const addressFormFieldsMock = {
  values: {
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  } satisfies SaveAddressRequest,
}
