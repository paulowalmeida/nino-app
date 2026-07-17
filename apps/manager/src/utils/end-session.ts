import { queryClient } from '@services/query-client'
import { useSessionStore } from '@states/useSessionStore'

const LOGIN_PATH = '/entrar'

/**
 * Unrecoverable session: wipes store and cache, then goes to the login page.
 * The reload is intentional — it guarantees nothing from the previous tenant
 * survives in memory.
 */
export const endSession = (): void => {
  useSessionStore.getState().clear()
  queryClient.clear()

  if (window.location.pathname !== LOGIN_PATH) {
    window.location.replace(LOGIN_PATH)
  }
}
