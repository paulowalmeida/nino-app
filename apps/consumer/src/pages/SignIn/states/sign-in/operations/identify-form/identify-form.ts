import type { SignInChannel } from '@pages/sign-in/types/SignInChannel.type'
import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

/**
 * Escolher o canal é escolher por onde entrar, então a escolha já abre o
 * campo correspondente — não existe estado útil em "canal escolhido, mas
 * ainda na tela de métodos".
 */
export const setChannel = (set: SetSignInState, channel: SignInChannel) =>
  set({ channel, step: 'identify' })

export const setPhone = (set: SetSignInState, phone: string) => set({ phone })

export const setEmail = (set: SetSignInState, email: string) => set({ email })
