import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import type { AuthUser } from '@custom_types/auth/auth-user'
import type { LoginRequest } from '@custom_types/auth/login-request'
import { AuthService } from '@services/auth.service'

export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation<AuthUser, Error, LoginRequest>({
    meta: { silentError: true },
    mutationFn: AuthService.login,
    onSuccess: () => {
      void navigate('/')
    },
  })
}
