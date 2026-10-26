export type Consumer = {
  id: string
  cpf: string | null
  createdAt: string
  updatedAt: string
  user: { name: string; phone: string | null }
}
