import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { logout } from '@services/auth/customer-auth.service'

/**
 * Sair limpa o cache inteiro, não só a sessão: o histórico de pedidos que
 * ficou em memória é de quem estava logado, e ele não pode aparecer para a
 * próxima pessoa que usar o mesmo aparelho.
 */
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.session.all, null)
      void queryClient.removeQueries({ queryKey: queryKeys.myOrders.all })
    },
  })
}
