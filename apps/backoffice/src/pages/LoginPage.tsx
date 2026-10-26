import { LoginInput } from '@app/services/types'
import styles from '@app/styles/app.module.css'
import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { FormEvent, useState } from 'react'

type LoginPageProps = {
  error: string | null
  isLoading: boolean
  onLogin: (input: LoginInput) => Promise<void>
}

export function LoginPage({ error, isLoading, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      await onLogin({ email: email.trim(), password })
    } catch (submitFailure) {
      setSubmitError(
        submitFailure instanceof Error
          ? submitFailure.message
          : 'Não foi possível entrar. Tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const message = submitError ?? error

  return (
    <main className={styles.loginShell}>
      <section className={styles.loginPanel} aria-labelledby="login-title">
        <div className={styles.loginEyebrow}>nino · operação</div>
        <Heading id="login-title" level={1}>
          Entrar no backoffice
        </Heading>
        <Text color="muted" className={styles.loginIntro}>
          Acompanhe as solicitações comerciais e mantenha cada conversa em movimento.
        </Text>
        {message && (
          <Alert variant="error" title="Não foi possível entrar">
            {message}
          </Alert>
        )}
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <FormField label="E-mail" required>
            <Input
              autoComplete="username"
              inputMode="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </FormField>
          <FormField label="Senha" required>
            <Input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </FormField>
          <Button
            className={styles.loginSubmit}
            disabled={isLoading}
            loading={isSubmitting}
            type="submit"
          >
            Entrar
          </Button>
        </form>
      </section>
      <aside className={styles.loginAside} aria-label="Mensagem do produto">
        <span className={styles.accentLine} />
        <Text className={styles.onDark} size="xl" font="display" weight="semibold">
          A próxima boa conversa começa com contexto.
        </Text>
        <Text className={styles.onDark}>
          Organize as solicitações Rede, dê visibilidade ao time e avance cada oportunidade com clareza.
        </Text>
      </aside>
    </main>
  )
}
