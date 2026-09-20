import { LoginPage } from '@app/pages/LoginPage'
import { SubscriptionInterestsPage } from '@app/pages/SubscriptionInterestsPage'
import styles from '@app/styles/app.module.css'
import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useState } from 'react'

import { useBackofficeSession } from './useBackofficeSession'

export function App() {
  const session = useBackofficeSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (session.isLoading) {
    return (
      <main className={styles.loadingScreen}>
        <Text role="status">Validando sessão…</Text>
      </main>
    )
  }

  if (!session.user) {
    return (
      <LoginPage
        error={session.error}
        isLoading={session.isLoading}
        onLogin={session.login}
      />
    )
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await session.logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className={styles.appShell}>
      <aside className={styles.rail} aria-label="Contexto do backoffice">
        <div>
          <p className={styles.brandMark}>nino</p>
          <p className={styles.railLabel}>Backoffice</p>
        </div>
        <div className={styles.railFooter}>
          <Text className={styles.onDark} size="sm" weight="semibold">
            {session.user.name}
          </Text>
          <Text className={styles.onDark} size="xs">
            {session.user.role === 'ADMIN' ? 'Administrador' : 'Suporte'}
          </Text>
          <Button
            className={styles.railButton}
            variant="inverseOutline"
            size="sm"
            loading={isLoggingOut}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <SubscriptionInterestsPage />
      </main>
    </div>
  )
}

export function SessionError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className={styles.centeredError}>
      <Heading level={1} size="lg">
        Não foi possível abrir o backoffice
      </Heading>
      <Alert variant="error" title="Falha ao validar a sessão">
        {message}
      </Alert>
      <Button onClick={onRetry}>Tentar novamente</Button>
    </div>
  )
}
