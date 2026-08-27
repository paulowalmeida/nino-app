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
