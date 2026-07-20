import { useForm } from 'react-hook-form'

import { Button, FormField, Input, PasswordInput } from '@nino/ds'

import { NinoLogo } from '@components/NinoLogo'
import type { LoginRequest } from '@custom_types/auth'
import { useLogin } from '@hooks/auth/useLogin'
import { authErrorMessage } from '@utils/auth-error-message'

import styles from './Login.module.css'
import motion from '@styles/motion.module.css'

/**
 * Entrada do caixa: campos grandes, um só caminho. Quem opera não cria
 * conta aqui — a conta vem do gestor.
 */
export const Login = () => {
  const { mutateAsync: login } = useLogin()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>()

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data)
    } catch (error) {
      setError('root', { message: authErrorMessage(error) })
    }
  }

  return (
    <div className={styles.screen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${motion.settle} ${styles.card}`}
      >
        <NinoLogo size="md" tone="dark" />

        <div className={styles.head}>
          <h1 className={styles.title}>Abrir o caixa</h1>
          <p className={styles.hint}>
            Entre com a conta que o dono cadastrou para você.
          </p>
        </div>

        <FormField label="E-mail" error={errors.email?.message}>
          <Input
            type="email"
            autoFocus
            placeholder="seu@email.com"
            {...register('email', { required: 'Informe o e-mail' })}
          />
        </FormField>

        <FormField label="Senha" error={errors.password?.message}>
          <PasswordInput
            {...register('password', { required: 'Informe a senha' })}
          />
        </FormField>

        {errors.root && <p className={styles.error}>{errors.root.message}</p>}

        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          className={`${motion.press} ${styles.enter}`}
        >
          Entrar
        </Button>
      </form>
    </div>
  )
}
