import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Consumer } from '@custom_types/consumer/consumer'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'

/**
 * Quem está usando a vitrine. Sem sessão a API responde 401 e o hook devolve
 * `null` — visitante é um estado normal aqui, não um erro: a loja inteira
 * funciona sem conta, e a conta só some do caminho de quem não quer uma.
 */
export const useConsumerSession = () => {
  const query = useQuery<Consumer | null>({
    queryKey: queryKeys.session.all,
    queryFn: () => consumerAuthService.getMe().catch(() => null),
    staleTime: 5 * 60_000,
    retry: false,
  })

  return { consumer: query.data ?? null, isPending: query.isPending }
}
