import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import type { AuthUser, SignupRequest } from '@custom_types/auth'
import { signup } from '@services/auth/auth.service'
import { useSessionStore } from '@states/useSessionStore'

export const useSignup = () => {
  const navigate = useNavigate()
  const setSession = useSessionStore((state) => state.setSession)

  return useMutation<AuthUser, Error, SignupRequest>({
    mutationFn: signup,
    onSuccess: (user) => {
      setSession(user, [])
      void navigate('/')
    },
  })
}
