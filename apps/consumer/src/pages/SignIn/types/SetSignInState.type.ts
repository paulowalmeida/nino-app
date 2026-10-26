import type { SignInState } from '@pages/sign-in/types/SignInState.type'

export type SetSignInState = (
  state: Partial<SignInState> | ((current: SignInState) => Partial<SignInState>)
) => void
