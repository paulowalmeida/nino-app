import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'
import { rememberSession } from '@utils/session-hint'

/**
 * Troca o crachá do Google por uma sessão. O Google resolve o login sozinho
 * — casa por credencial, por e-mail verificado, ou cria a conta na hora —
 * então esta mutação sempre termina autenticada, nunca com um passo pendente.
 */
export const useGoogleSignIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idToken: string) =>
      customerAuthService.signInWithGoogle(idToken),
    onSuccess: (customer: Customer) => {
      rememberSession()
      queryClient.setQueryData(queryKeys.session.all, customer)
    },
  })
}
