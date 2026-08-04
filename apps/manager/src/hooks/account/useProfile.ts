import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Profile, UpdateProfileRequest } from '@custom_types/account'
import { AccountService } from '@services/account.service'

export const profileKey = ['account', 'profile'] as const

export const useProfile = () =>
  useQuery<Profile>({
    queryKey: profileKey,
    queryFn: AccountService.getProfile,
  })

export const useSaveProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'Perfil salvo', errorTitle: 'O perfil não foi salvo' },
    mutationFn: (data: UpdateProfileRequest) =>
      AccountService.updateProfile(data),
    onSuccess: (profile) => queryClient.setQueryData(profileKey, profile),
  })
}

export const useUpdateMyEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    /* O modal fecha em sucesso e mostra o erro inline: só o sucesso vira toast. */
    meta: { success: 'E-mail de login atualizado', silentError: true },
    mutationFn: (email: string) => AccountService.updateMyEmail(email),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKey })
    },
  })
}
