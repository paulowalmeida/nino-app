import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Profile, UpdateProfileRequest } from '@custom_types/account'
import { getProfile, updateProfile } from '@services/account/account.service'

const profileKey = ['account', 'profile'] as const

export const useProfile = () =>
  useQuery<Profile>({ queryKey: profileKey, queryFn: getProfile })

export const useSaveProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (profile) => queryClient.setQueryData(profileKey, profile),
  })
}
