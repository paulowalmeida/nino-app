import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { recoveryTarget } from '@router/pending-navigation'

import styles from './RouteErrorBoundary.module.css'

const RELOAD_FLAG = 'nino-manager-chunk-reload-at'
const RELOAD_COOLDOWN_MS = 10_000

const isStaleChunkError = (error: unknown): boolean =>
  error instanceof Error &&
  /dynamically imported module/i.test(error.message)

const readLastReload = (): number => {
  try {
    return Number(sessionStorage.getItem(RELOAD_FLAG) ?? 0)
  } catch {
    return 0
  }
}

const rememberReload = (): void => {
  try {
    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()))
  } catch {
    // WORKAROUND: storage can be unavailable while recovering from a chunk error.
  }
}

export const RouteErrorBoundary = () => {
  const error = useRouteError()
  const isStaleChunk = isStaleChunkError(error)

  useEffect(() => {
    if (!isStaleChunk) return

    const lastReload = readLastReload()
    if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) return

    rememberReload()
    window.location.assign(recoveryTarget(window.location.href))
  }, [isStaleChunk])

  if (isStaleChunk) return null

  const title = isRouteErrorResponse(error)
    ? 'Essa página não existe'
    : 'Essa tela travou'

  return (
    <Box direction="row" className={styles.routeErrorBoundaryShell}>
      <Box direction="column" className={styles.routeErrorBoundaryPanel}>
        <Header
          level={1}
          size="2xl"
          title={title}
          description="Recarregue a página. Se continuar acontecendo, avise o suporte."
        />
        <Button onClick={() => window.location.reload()}>Recarregar</Button>
      </Box>
    </Box>
  )
}
