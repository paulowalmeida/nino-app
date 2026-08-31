import { useMutation } from '@tanstack/react-query'

import { AuthService } from '@shared/services/auth/auth.service'
import type { MessageResponse } from '@shared/types/auth/message-response.type'
import type { ResetPasswordRequest } from '@shared/types/auth/reset-password-request.type'

export const useResetPassword = () =>
  useMutation<MessageResponse, Error, ResetPasswordRequest>({
    meta: { silentError: true },
    mutationFn: AuthService.resetPassword,
  })
