const KEY = 'nino.had-session'

/**
 * The session cookies are httpOnly, so the app cannot tell "logged out" from
 * "token expired" by looking at them. This flag is that memory: it says a
 * session existed at some point in this browser, which is what makes a token
 * refresh worth attempting.
 *
 * It is a hint, never an authorization — the server remains the only judge of
 * whether the cookies are valid.
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
