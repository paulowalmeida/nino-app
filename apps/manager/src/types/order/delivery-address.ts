/** A saved address a registered customer picked for a delivery order. */
export type DeliveryAddress = {
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
}
