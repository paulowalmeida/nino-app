import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import type { OtpCredentials } from '@services/auth/customer-auth.service'
import { verifyOtp } from '@services/auth/customer-auth.service'

/**
 * Confirma o código e abre a sessão. O cliente volta no corpo da resposta e já
 * entra no cache da sessão — sem isso a tela seguinte pediria de novo ao
 * servidor o que acabou de chegar.
 */
export const useVerifyOtp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      credentials,
      code,
    }: {
      credentials: OtpCredentials
      code: string
    }) => verifyOtp(credentials, code),
    onSuccess: (customer: Customer) => {
      queryClient.setQueryData(queryKeys.session.all, customer)
    },
  })
}
