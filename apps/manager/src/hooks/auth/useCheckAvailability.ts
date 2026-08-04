import { useMutation } from '@tanstack/react-query'

import type {
  CheckAvailabilityRequest,
  CheckAvailabilityResponse,
} from '@custom_types/auth'
import { AuthService } from '@services/auth.service'

export const useCheckAvailability = () =>
  useMutation<CheckAvailabilityResponse, Error, CheckAvailabilityRequest>({
    meta: { silentError: true },
    mutationFn: AuthService.checkAvailability,
  })
