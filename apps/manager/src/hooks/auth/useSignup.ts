import { useMutation } from '@tanstack/react-query'

import type { AuthUser, SignupRequest } from '@custom_types/auth'
import { AuthService } from '@services/auth.service'

export const useSignup = () =>
  useMutation<AuthUser, Error, SignupRequest>({
    meta: { silentError: true },
    mutationFn: AuthService.signup,
  })
