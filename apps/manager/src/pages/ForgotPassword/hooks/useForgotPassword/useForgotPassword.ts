import { useMutation } from '@tanstack/react-query'

import { AuthService } from '@shared/services/auth/auth.service'
import type { ForgotPasswordRequest } from '@shared/types/auth/forgot-password-request.type'
import type { MessageResponse } from '@shared/types/auth/message-response.type'

export const useForgotPassword = () =>
  useMutation<MessageResponse, Error, ForgotPasswordRequest>({
    meta: { silentError: true },
    mutationFn: AuthService.forgotPassword,
  })
