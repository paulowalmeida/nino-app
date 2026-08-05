import { useMutation } from '@tanstack/react-query'

import type { AuthUser } from '@custom_types/auth/auth-user'
import type { SignupRequest } from '@custom_types/auth/signup-request'
import { AuthService } from '@services/auth.service'

export const useSignup = () =>
  useMutation<AuthUser, Error, SignupRequest>({
    meta: { silentError: true },
    mutationFn: AuthService.signup,
  })
