const KEY = 'nino.onboarding-seen'

/**
 * As boas-vindas acontecem uma vez. Quem pulou não quer de novo a cada login —
 * e quem quiser rever tem o link na tela de unidades.
 */
export const rememberOnboarding = (): void => {
  try {
    window.localStorage.setItem(KEY, '1')
  } catch {
    /* modo privado: mostrar de novo é menos ruim que travar a tela */
  }
}

export const sawOnboarding = (): boolean => {
  try {
    return window.localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
