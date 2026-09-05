import type { SignInChannel } from '@pages/sign-in/types/SignInChannel.type'
import type { SignInStep } from '@pages/sign-in/types/SignInStep.type'

export type SignInState = {
  step: SignInStep
  channel: SignInChannel
  phone: string
  email: string
  code: string
  name: string
  setChannel: (channel: SignInChannel) => void
  setPhone: (phone: string) => void
  setEmail: (email: string) => void
  setCode: (code: string) => void
  setName: (name: string) => void
  goToCode: () => void
  goToIdentify: () => void
  goToMethods: () => void
  goToCompleteProfile: (name: string) => void
  goToCompletePhoneCode: () => void
  reset: () => void
}
