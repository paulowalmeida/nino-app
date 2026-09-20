import { useMutation } from '@tanstack/react-query'

import { AccountService } from '@shared/services/account/account.service'
import type {
  CreateSubscriptionInterestInput,
  SubscriptionInterestResponse,
} from '@shared/types/profile/subscription-interest'

export const useSubscriptionInterest = () =>
  useMutation<
    SubscriptionInterestResponse,
    Error,
    CreateSubscriptionInterestInput
  >({
    meta: {
      success: 'Solicitação enviada',
      errorTitle: 'A solicitação não foi enviada',
    },
    mutationFn: AccountService.requestSubscriptionInterest,
  })
