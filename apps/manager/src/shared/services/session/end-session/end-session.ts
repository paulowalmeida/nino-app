import { queryClient } from '@lib/query-client/query-client'
import { STORE_DRAFT_KEY } from '@shared/constants/store-draft.constants'
import { clearRegisteredSession } from '@shared/services/session/session-bridge'
import { clearDraft } from '@shared/utils/form-draft/form-draft'
import { forgetSession } from '@shared/utils/session-hint/session-hint'

const LOGIN_PATH = '/entrar'

/**
 * Unrecoverable session: wipes store and cache, then goes to the login page.
 * The reload is intentional — it guarantees nothing from the previous unit
 * survives in memory.
 */
export const endSession = (): void => {
  clearRegisteredSession()
  queryClient.clear()
  clearDraft(STORE_DRAFT_KEY)
  forgetSession()

  if (window.location.pathname !== LOGIN_PATH) {
    window.location.replace(LOGIN_PATH)
  }
}
