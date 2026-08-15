/** Uma linha do ranking de clientes — quem mais gastou ou mais pediu. */
export type TopCustomer = {
  id: string
  name: string
  orders: number
  spent: number
}
