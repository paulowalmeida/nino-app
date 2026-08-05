import { useMutation } from '@tanstack/react-query'

import type { CheckAvailabilityRequest } from '@custom_types/auth/check-availability-request'
import type { CheckAvailabilityResponse } from '@custom_types/auth/check-availability-response'
import { AuthService } from '@services/auth.service'

export const useCheckAvailability = () =>
  useMutation<CheckAvailabilityResponse, Error, CheckAvailabilityRequest>({
    meta: { silentError: true },
    mutationFn: AuthService.checkAvailability,
  })
