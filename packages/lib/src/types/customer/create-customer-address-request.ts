export type CreateCustomerAddressRequest = {
  customerId: string
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  isPrimary?: boolean
  country?: string
}
