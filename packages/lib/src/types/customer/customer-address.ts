export type CustomerAddress = {
  id: string
  customerId: string
  zipCode: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  country: string | null
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}
