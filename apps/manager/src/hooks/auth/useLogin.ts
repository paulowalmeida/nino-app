import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import type { AuthUser, LoginRequest } from '@custom_types/auth'
import { login } from '@services/auth/auth.service'
import { useSessionStore } from '@states/useSessionStore'

export const useLogin = () => {
  const navigate = useNavigate()
  const setSession = useSessionStore((state) => state.setSession)

  return useMutation<AuthUser, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (user) => {
      setSession(user, [])
      void navigate('/')
    },
  })
}
