import { useMutation } from '@tanstack/react-query'

import type { LinkPhoneRequest } from '@shared/types/customer/link-phone-request'
import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'

export const useRequestPhoneLink = () =>
  useMutation({
    mutationFn: (data: LinkPhoneRequest) =>
      customerAuthService.requestPhoneLink(data),
  })
