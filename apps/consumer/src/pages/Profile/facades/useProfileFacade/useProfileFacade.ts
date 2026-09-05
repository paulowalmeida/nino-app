import { useCompleteProfile } from '@shared/hooks/useCompleteProfile/useCompleteProfile'
import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'

export const useProfileFacade = () => {
  const { customer } = useCustomerSession()
  const completeProfile = useCompleteProfile()

  return {
    customer,
    completeProfile: completeProfile.mutate,
    isCompletingProfile: completeProfile.isPending,
  }
}
