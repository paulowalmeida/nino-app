import { backofficeService } from '@app/services/backoffice.service'
import { sessionHint } from '@app/services/http.service'
import { BackofficeUser, LoginInput } from '@app/services/types'
import { ApiError } from '@nino/lib/utils/api-error'
import { useCallback, useEffect, useState } from 'react'

type SessionState = {
  user: BackofficeUser | null
  isLoading: boolean
  error: string | null
}

const signedInState = (user: BackofficeUser): SessionState => ({
  user,
  isLoading: false,
  error: null,
})

const failedState = (error: unknown): SessionState => {
  const isExpectedVisitor = error instanceof ApiError && error.status === 401

  return {
    user: null,
    isLoading: false,
    error: isExpectedVisitor
      ? null
      : error instanceof Error
        ? error.message
        : 'Não foi possível validar sua sessão.',
  }
}

export function useBackofficeSession() {
  const [state, setState] = useState<SessionState>({
    user: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let isCurrent = true
    backofficeService
      .getMe()
      .then((user) => isCurrent && setState(signedInState(user)))
      .catch((error) => isCurrent && setState(failedState(error)))
    const onSessionEnded = () =>
      setState({ user: null, isLoading: false, error: null })
    window.addEventListener('backoffice-session-ended', onSessionEnded)
    return () => {
      isCurrent = false
      window.removeEventListener('backoffice-session-ended', onSessionEnded)
    }
  }, [])

  const retry = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }))
    try {
      setState(signedInState(await backofficeService.getMe()))
    } catch (error) {
      setState(failedState(error))
    }
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const user = await backofficeService.login(input)
    setState(signedInState(user))
  }, [])

  const logout = useCallback(async () => {
    await backofficeService.logout()
  }, [])

  return { ...state, login, logout, retry, clearSession: sessionHint.clear }
}
