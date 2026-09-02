import { create } from 'zustand'

import {
  setEmail,
  setPhone,
  setChannel,
} from '@pages/sign-in/states/sign-in/operations/identify-form/identify-form'
import { setCode } from '@pages/sign-in/states/sign-in/operations/code-form/code-form'
import {
  goToCode,
  goToIdentify,
} from '@pages/sign-in/states/sign-in/operations/step/step'
import type { SignInState } from '@pages/sign-in/types/SignInState.type'

export const useSignInStore = create<SignInState>((set) => ({
  step: 'identify',
  channel: 'phone',
  phone: '',
  email: '',
  code: '',
  setChannel: (channel) => setChannel(set, channel),
  setPhone: (phone) => setPhone(set, phone),
  setEmail: (email) => setEmail(set, email),
  setCode: (code) => setCode(set, code),
  goToCode: () => goToCode(set),
  goToIdentify: () => goToIdentify(set),
  reset: () =>
    set({ step: 'identify', channel: 'phone', phone: '', email: '', code: '' }),
}))
