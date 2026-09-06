import { useCompleteProfile } from '@shared/hooks/useCompleteProfile/useCompleteProfile'
import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useRequestPhoneLink } from '@shared/hooks/useRequestPhoneLink/useRequestPhoneLink'
import { useVerifyPhoneLink } from '@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink'

export const useProfileFacade = () => {
  const { customer } = useCustomerSession()
  const completeProfile = useCompleteProfile()
  const requestPhoneLink = useRequestPhoneLink()
  const verifyPhoneLink = useVerifyPhoneLink()

  return {
    customer,
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
