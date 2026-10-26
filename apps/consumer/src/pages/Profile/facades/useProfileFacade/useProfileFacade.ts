import { useCompleteProfile } from '@shared/hooks/useCompleteProfile/useCompleteProfile'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useRequestPhoneLink } from '@shared/hooks/useRequestPhoneLink/useRequestPhoneLink'
import { useVerifyPhoneLink } from '@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink'

export const useProfileFacade = () => {
  const { consumer } = useConsumerSession()
  const completeProfile = useCompleteProfile()
  const requestPhoneLink = useRequestPhoneLink()
  const verifyPhoneLink = useVerifyPhoneLink()

  return {
    consumer,
    completeProfile: completeProfile.mutate,
    isCompletingProfile: completeProfile.isPending,
    requestPhoneLink: requestPhoneLink.mutate,
    isRequestingPhoneLink: requestPhoneLink.isPending,
    requestPhoneLinkFailed: requestPhoneLink.isError,
    verifyPhoneLink: verifyPhoneLink.mutate,
    isVerifyingPhoneLink: verifyPhoneLink.isPending,
    verifyPhoneLinkFailed: verifyPhoneLink.isError,
  }
}
