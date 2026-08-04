import { useMutation, useQueryClient } from '@tanstack/react-query'

import { profileKey } from '@hooks/account/useProfile'
import { AccountService } from '@services/account.service'

export const useUpdateMyEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'E-mail de login atualizado', silentError: true },
    mutationFn: (email: string) => AccountService.updateMyEmail(email),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKey })
    },
  })
}
