import { useMutation } from '@tanstack/react-query'

import { AuthService } from '@shared/services/auth/auth.service'
import type { CheckAvailabilityRequest } from '@shared/types/auth/check-availability-request'
import type { CheckAvailabilityResponse } from '@shared/types/auth/check-availability-response'

export const useCheckAvailability = () =>
  useMutation<CheckAvailabilityResponse, Error, CheckAvailabilityRequest>({
    meta: { silentError: true },
    mutationFn: AuthService.checkAvailability,
  })
