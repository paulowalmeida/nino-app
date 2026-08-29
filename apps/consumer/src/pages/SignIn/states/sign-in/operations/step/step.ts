import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

export const goToCode = (set: SetSignInState) => set({ step: 'code' })

export const goToIdentify = (set: SetSignInState) =>
  set({ step: 'identify', code: '' })
