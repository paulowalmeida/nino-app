import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

export const setName = (set: SetSignInState, name: string) => set({ name })
