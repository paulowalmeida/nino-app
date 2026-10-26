import { ApiError } from '@nino/lib/utils/api-error'
import { AuthService } from '@shared/services/auth/auth.service'
import type { GetSession } from '@shared/types/session/get-session'
import { forgetSession, rememberSession } from '@shared/utils/session-hint/session-hint'

let pendingLoad: Promise<ReturnType<GetSession>['user']> | null = null
let loadGeneration = 0

export const invalidatePendingSessionLoad = (): void => {
  loadGeneration += 1
  pendingLoad = null
}

export const loadSession = (get: GetSession) => {
  const { user, setSession } = get()
  if (user) return Promise.resolve(user)
  if (pendingLoad) return pendingLoad

  const requestGeneration = loadGeneration
  const request = AuthService.me()
    .then(({ memberships, ...fetched }) => {
      if (requestGeneration !== loadGeneration) return null
      setSession(fetched, memberships)
      rememberSession()
      return fetched
    })
    .catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        if (requestGeneration === loadGeneration) forgetSession()
        return null
      }

      throw error
    })
    .finally(() => {
      if (requestGeneration === loadGeneration) pendingLoad = null
    })

  pendingLoad = request

  return pendingLoad
}
