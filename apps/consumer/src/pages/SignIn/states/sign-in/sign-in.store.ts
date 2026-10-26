import { create } from 'zustand'

import {
  setEmail,
  setPhone,
  setChannel,
} from '@pages/sign-in/states/sign-in/operations/identify-form/identify-form'
import { setCode } from '@pages/sign-in/states/sign-in/operations/code-form/code-form'
import { setName } from '@pages/sign-in/states/sign-in/operations/complete-profile/complete-profile'
import {
  goToCode,
  goToCompletePhoneCode,
  goToCompleteProfile,
  goToIdentify,
  goToMethods,
} from '@pages/sign-in/states/sign-in/operations/step/step'
import type { SignInState } from '@pages/sign-in/types/SignInState.type'

export const useSignInStore = create<SignInState>((set) => ({
  step: 'method',
  channel: 'phone',
  phone: '',
  email: '',
  code: '',
  name: '',
  setChannel: (channel) => setChannel(set, channel),
  setPhone: (phone) => setPhone(set, phone),
  setEmail: (email) => setEmail(set, email),
  setCode: (code) => setCode(set, code),
  setName: (name) => setName(set, name),
  goToCode: () => goToCode(set),
  goToIdentify: () => goToIdentify(set),
  goToMethods: () => goToMethods(set),
  goToCompleteProfile: (name) => goToCompleteProfile(set, name),
  goToCompletePhoneCode: () => goToCompletePhoneCode(set),
  reset: () =>
    set({
      step: 'method',
      channel: 'phone',
      phone: '',
      email: '',
      code: '',
      name: '',
    }),
}))
