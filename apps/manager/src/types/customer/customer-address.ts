/** An address a customer has already registered, from any store's checkout. */
export type CustomerAddress = {
  id: string
  zipCode: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  isPrimary: boolean | null
}
