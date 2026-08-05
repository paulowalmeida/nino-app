import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { Button } from '@nino/ds/components/Button'

import styles from './RouteErrorBoundary.module.css'

const RELOAD_FLAG = 'nino-manager-chunk-reload-at'
const RELOAD_COOLDOWN_MS = 10_000

const isStaleChunkError = (error: unknown): boolean =>
  error instanceof Error &&
  /dynamically imported module/i.test(error.message)

/**
 * Depois de um deploy, uma aba aberta ainda referencia o hash antigo dos
 * chunks — o arquivo já não existe no servidor. Recarregar resolve sozinho
 * na quase totalidade dos casos; o cooldown em sessionStorage evita loop
 * infinito se o deploy realmente quebrou.
 */
export const RouteErrorBoundary = () => {
  const error = useRouteError()
  const staleChunk = isStaleChunkError(error)

  useEffect(() => {
    if (!staleChunk) return

    const lastReload = Number(sessionStorage.getItem(RELOAD_FLAG) ?? 0)
    if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) return

    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()))
    window.location.reload()
  }, [staleChunk])

  if (staleChunk) return null

  const title = isRouteErrorResponse(error)
    ? 'Essa página não existe'
    : 'Essa tela travou'

  return (
    <div className={styles.shell}>
      <div className={styles.panel}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>
          Recarregue a página. Se continuar acontecendo, avise o suporte.
        </p>
        <Button onClick={() => window.location.reload()}>Recarregar</Button>
      </div>
    </div>
  )
}
