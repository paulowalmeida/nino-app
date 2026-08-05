import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateProfileRequest } from '@custom_types/account/update-profile-request'
import { profileKey } from '@hooks/account/useProfile'
import { AccountService } from '@services/account.service'

export const useSaveProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'Perfil salvo', errorTitle: 'O perfil não foi salvo' },
    mutationFn: (data: UpdateProfileRequest) =>
      AccountService.updateProfile(data),
    onSuccess: (profile) => queryClient.setQueryData(profileKey, profile),
  })
}
