import { Link } from 'react-router'
import { useForm } from 'react-hook-form'

import { Button, FormField, Input, PasswordInput } from '@nino/ds'

import type { LoginRequest } from '@custom_types/auth'
import { useLogin } from '@hooks/auth/useLogin'
import { authErrorMessage } from '@utils/auth-error-message'
import { riseDelay } from '@utils/rise-delay'

import styles from '@layouts/AuthLayout/authForm.module.css'
import motion from '@layouts/AuthLayout/motion.module.css'

export const LoginForm = () => {
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
    <div>
      <header
        className={`${motion.rise} ${styles.header}`}
        style={riseDelay(0)}
      >
        <h1 className={styles.title}>Bem-vindo</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={motion.rise} style={riseDelay(120)}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register('email', { required: 'Informe o email' })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={riseDelay(200)}>
          <FormField label="Senha" error={errors.password?.message}>
            <PasswordInput
              placeholder="••••••••"
              error={!!errors.password}
              {...register('password', { required: 'Informe a senha' })}
            />
          </FormField>
        </div>

        {errors.root && <p className={styles.errorText}>{errors.root.message}</p>}

        <div className={motion.rise} style={riseDelay(280)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={styles.submit}
            loadingIndicator="dots"
          >
            Entrar
          </Button>
        </div>
      </form>

      <p className={`${motion.rise} ${styles.footer}`} style={riseDelay(360)}>
        Não tem conta?{' '}
        <Link to="/cadastrar" className={styles.footerLink}>
          Criar conta
        </Link>
      </p>
    </div>
  )
}
