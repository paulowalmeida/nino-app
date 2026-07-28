import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import { getMe } from '@services/auth/customer-auth.service'

/**
 * Quem está usando a vitrine. Sem sessão a API responde 401 e o hook devolve
 * `null` — visitante é um estado normal aqui, não um erro: a loja inteira
 * funciona sem conta, e a conta só some do caminho de quem não quer uma.
 */
export const useCustomerSession = () => {
  const query = useQuery<Customer | null>({
    queryKey: queryKeys.session.all,
    queryFn: () => getMe().catch(() => null),
    staleTime: 5 * 60_000,
    retry: false,
  })

  return { customer: query.data ?? null, isPending: query.isPending }
}
