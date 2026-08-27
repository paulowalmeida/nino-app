import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import { AuthService } from '@shared/services/auth/auth.service'
import type { AuthUser } from '@shared/types/auth/auth-user'
import type { LoginRequest } from '@shared/types/auth/login-request'

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
