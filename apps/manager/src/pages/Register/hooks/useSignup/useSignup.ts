import { useMutation } from '@tanstack/react-query'

import { AuthService } from '@shared/services/auth/auth.service'
import type { AuthUser } from '@shared/types/auth/auth-user'
import type { SignupRequest } from '@shared/types/auth/signup-request'

export const useSignup = () =>
  useMutation<AuthUser, Error, SignupRequest>({
    meta: { silentError: true },
    mutationFn: AuthService.signup,
  })
