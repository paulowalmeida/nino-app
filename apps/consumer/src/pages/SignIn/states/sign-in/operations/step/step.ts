import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

export const goToCode = (set: SetSignInState) => set({ step: 'code' })

/**
 * Volta para a escolha do método. Limpa o que foi digitado: quem volta até
 * aqui está trocando de caminho, não corrigindo um dígito.
 */
export const goToMethods = (set: SetSignInState) =>
  set({
    step: 'method',
    phone: '',
    email: '',
    code: '',
  })

export const goToIdentify = (set: SetSignInState) => set({ step: 'identify' })

/**
 * Abre a tela de completar cadastro, igual para os três jeitos de entrar.
 * `name` chega pronto quando existe (o Google manda; telefone e e-mail não
 * têm nome nenhum para sugerir) — a tela decide sozinha se preenche o campo
 * ou deixa em branco.
 */
export const goToCompleteProfile = (set: SetSignInState, name: string) =>
  set({ step: 'complete-profile', code: '', phone: '', name })

export const goToCompletePhoneCode = (set: SetSignInState) =>
  set({ step: 'complete-phone-code', code: '' })
