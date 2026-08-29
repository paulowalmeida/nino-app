import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

export const setCode = (set: SetSignInState, code: string) => set({ code })
