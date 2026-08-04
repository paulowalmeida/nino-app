import { useQuery } from '@tanstack/react-query'

import type { Profile } from '@custom_types/account'
import { AccountService } from '@services/account.service'

export const profileKey = ['account', 'profile'] as const

export const useProfile = () =>
  useQuery<Profile>({
    queryKey: profileKey,
    queryFn: AccountService.getProfile,
  })
