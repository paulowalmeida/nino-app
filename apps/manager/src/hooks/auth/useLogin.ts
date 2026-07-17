import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import type { AuthUser, LoginRequest } from '@custom_types/auth'
import { login } from '@services/auth/auth.service'

/**
 * Login only sets the cookies — `/auth/login` has no memberships in its body,
 * so seeding the store here would leave the session without stores. The root
 * route bootstraps it from `/auth/me` instead.
 */
export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation<AuthUser, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: () => {
      void navigate('/')
    },
  })
}
