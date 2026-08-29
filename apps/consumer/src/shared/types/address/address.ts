/**
 * Um endereço salvo do cliente. `isPrimary` é `true` ou `null` — nunca
 * `false`: o unique do banco usa o truque de `NULL != NULL` no Postgres para
 * garantir um único principal por pessoa.
 */
export type Address = {
  id: string
  zipCode: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  country: string
  isPrimary: boolean | null
  createdAt: string
  updatedAt: string
}
