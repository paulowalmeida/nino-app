import { useMutation } from '@tanstack/react-query'

import type {
  CheckAvailabilityRequest,
  CheckAvailabilityResponse,
} from '@custom_types/auth'
import { checkAvailability } from '@services/auth/auth.service'

export const useCheckAvailability = () =>
  useMutation<CheckAvailabilityResponse, Error, CheckAvailabilityRequest>({
    meta: { silentError: true },
    mutationFn: checkAvailability,
  })
