import type { SignInChannel } from '@pages/sign-in/types/SignInChannel.type'
import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

export const setChannel = (set: SetSignInState, channel: SignInChannel) =>
  set({ channel })

export const setPhone = (set: SetSignInState, phone: string) => set({ phone })

export const setEmail = (set: SetSignInState, email: string) => set({ email })
