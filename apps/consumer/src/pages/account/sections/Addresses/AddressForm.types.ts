import type { Address } from '@custom_types/address/address'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'

export type AddressFormProps = {
  address?: Address
  isSaving: boolean
  hasError: boolean
  onCancel: () => void
  onSubmit: (data: SaveAddressRequest) => void
}
