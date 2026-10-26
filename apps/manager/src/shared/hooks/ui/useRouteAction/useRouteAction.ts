import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'

const ACTION_PARAM = 'acao'

/**
 * Runs `onRequest` when the URL asks for `action` (`?acao=<action>`) and
 * drops the parameter right after, so a reload or a back navigation does not
 * fire it again. Reacts to the parameter changing, not only to the first
 * render — the command palette can request an action on the screen that is
 * already open.
 */
export const useRouteAction = (action: string, onRequest: () => void) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isRequested = searchParams.get(ACTION_PARAM) === action
  const onRequestRef = useRef(onRequest)
  onRequestRef.current = onRequest

  useEffect(() => {
    if (!isRequested) return

    onRequestRef.current()
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.delete(ACTION_PARAM)
        return next
      },
      { replace: true }
    )
  }, [isRequested, setSearchParams])
}
