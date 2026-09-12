import { useMutation } from '@tanstack/react-query'

import type { LinkPhoneRequest } from '@shared/types/consumer/link-phone-request'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'

export const useRequestPhoneLink = () =>
  useMutation({
    mutationFn: (data: LinkPhoneRequest) =>
      consumerAuthService.requestPhoneLink(data),
  })
