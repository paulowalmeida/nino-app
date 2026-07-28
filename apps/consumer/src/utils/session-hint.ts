const KEY = 'nino.customer.had-session'

/**
 * Os cookies de sessão são httpOnly, então o app não distingue "nunca entrou"
 * de "token venceu" olhando para eles. Esta marca é essa memória: diz que já
 * existiu sessão neste navegador, que é o que torna a renovação válida a
 * tentativa.
 *
 * Importa mais aqui do que no gestor: a vitrine é feita para visitante
 * anônimo. Sem a dica, cada pessoa que abre a loja sem conta pagaria um POST
 * de refresh inútil antes de ver o cardápio.
 *
 * É dica, nunca autorização — quem julga o cookie continua sendo o servidor.
 */
export const rememberSession = (): void => {
  try {
    window.localStorage.setItem(KEY, '1')
  } catch {
    /* modo privado ou storage cheio: seguir sem a dica */
  }
}

export const forgetSession = (): void => {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* idem */
  }
}

export const hadSession = (): boolean => {
  try {
    return window.localStorage.getItem(KEY) === '1'
  } catch {
    /* sem storage, assume que vale tentar renovar */
    return true
  }
}
