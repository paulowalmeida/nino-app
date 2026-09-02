import { useSignInBrand } from '@pages/sign-in/hooks/useSignInBrand/useSignInBrand'
import { useSignInMutations } from '@pages/sign-in/hooks/useSignInMutations/useSignInMutations'
import { useSignInStore } from '@pages/sign-in/states/sign-in/sign-in.store'

export const useSignInFacade = () => {
  const { home, store } = useSignInBrand()
  const clientState = useSignInStore()
  const mutations = useSignInMutations(home, clientState.goToCode)

  return {
    home,
    store,
    step: clientState.step,
    channel: clientState.channel,
    setChannel: clientState.setChannel,
    phone: clientState.phone,
    setPhone: clientState.setPhone,
    email: clientState.email,
    setEmail: clientState.setEmail,
    code: clientState.code,
    setCode: clientState.setCode,
    goToIdentify: clientState.goToIdentify,
    reset: clientState.reset,
    requestCode: mutations.requestCode,
    isRequesting: mutations.isRequesting,
    requestFailed: mutations.requestFailed,
    verifyCode: mutations.verifyCode,
    isVerifying: mutations.isVerifying,
    verifyFailed: mutations.verifyFailed,
  }
}
