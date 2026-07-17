import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import type { AuthUser, SignupRequest } from '@custom_types/auth'
import { signup } from '@services/auth/auth.service'

/** Same bootstrap rule as `useLogin`: the session is loaded by the root route. */
export const useSignup = () => {
  const navigate = useNavigate()

  return useMutation<AuthUser, Error, SignupRequest>({
    mutationFn: signup,
    onSuccess: () => {
      void navigate('/')
    },
  })
}
