import { useMutation } from '@tanstack/react-query'

import type { AuthUser, SignupRequest } from '@custom_types/auth'
import { AuthService } from '@services/auth.service'

/**
 * Signup creates account and company and sets the cookies — nothing else.
 * Where to go next belongs to the wizard, which still has the store step ahead.
 */
export const useSignup = () =>
  useMutation<AuthUser, Error, SignupRequest>({
    /* O wizard mostra o erro da API no próprio passo. */
    meta: { silentError: true },
    mutationFn: AuthService.signup,
  })
