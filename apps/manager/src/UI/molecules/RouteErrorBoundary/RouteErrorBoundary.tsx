import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'

import styles from './RouteErrorBoundary.module.css'

const RELOAD_FLAG = 'nino-manager-chunk-reload-at'
const RELOAD_COOLDOWN_MS = 10_000

const isStaleChunkError = (error: unknown): boolean =>
  error instanceof Error &&
  /dynamically imported module/i.test(error.message)

export const RouteErrorBoundary = () => {
  const error = useRouteError()
  const isStaleChunk = isStaleChunkError(error)

  useEffect(() => {
    if (!isStaleChunk) return

    const lastReload = Number(sessionStorage.getItem(RELOAD_FLAG) ?? 0)
    if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) return

    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()))
    window.location.reload()
  }, [isStaleChunk])

  if (isStaleChunk) return null

  const title = isRouteErrorResponse(error)
    ? 'Essa página não existe'
    : 'Essa tela travou'

  return (
    <Flexbox direction="row" className={styles.shell}>
      <Flexbox direction="column" className={styles.panel}>
        <Heading level={1} size="2xl" className={styles.title}>
          {title}
        </Heading>
        <Text size="sm" color="muted">
          Recarregue a página. Se continuar acontecendo, avise o suporte.
        </Text>
        <Button onClick={() => window.location.reload()}>Recarregar</Button>
      </Flexbox>
    </Flexbox>
  )
}
