import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useSignInBrand } from '@pages/sign-in/hooks/useSignInBrand/useSignInBrand'
import { useSignInMutations } from '@pages/sign-in/hooks/useSignInMutations/useSignInMutations'
import { useSignInStore } from '@pages/sign-in/states/sign-in/sign-in.store'

export const useSignInFacade = () => {
  const { home, store } = useSignInBrand()
  const { customer } = useCustomerSession()
  const clientState = useSignInStore()
  const mutations = useSignInMutations(
    home,
    {
      onCodeRequested: clientState.goToCode,
      goToCompleteProfile: clientState.goToCompleteProfile,
      onPhoneCodeRequested: clientState.goToCompletePhoneCode,
    },
    customer
  )

  return {
    home,
    store,
    customer,
    step: clientState.step,
    channel: clientState.channel,
    setChannel: clientState.setChannel,
    phone: clientState.phone,
    setPhone: clientState.setPhone,
    email: clientState.email,
    setEmail: clientState.setEmail,
    code: clientState.code,
    setCode: clientState.setCode,
    name: clientState.name,
    setName: clientState.setName,
    goToIdentify: clientState.goToIdentify,
    goToMethods: clientState.goToMethods,
    reset: clientState.reset,
    requestCode: mutations.requestCode,
    isRequesting: mutations.isRequesting,
    requestFailed: mutations.requestFailed,
    verifyCode: mutations.verifyCode,
    isVerifying: mutations.isVerifying,
    verifyFailed: mutations.verifyFailed,
    googleFailed: mutations.googleFailed,
    requestPhoneCode: mutations.requestPhoneCode,
    isRequestingPhoneCode: mutations.isRequestingPhoneCode,
    requestPhoneCodeFailed: mutations.requestPhoneCodeFailed,
    verifyPhoneCode: mutations.verifyPhoneCode,
    isVerifyingPhoneCode: mutations.isVerifyingPhoneCode,
    verifyPhoneCodeFailed: mutations.verifyPhoneCodeFailed,
    finishProfile: mutations.finishProfile,
    isFinishingProfile: mutations.isFinishingProfile,
    finishProfileFailed: mutations.finishProfileFailed,
    goHomeSkippingPhone: mutations.skipPhone,
  }
}
