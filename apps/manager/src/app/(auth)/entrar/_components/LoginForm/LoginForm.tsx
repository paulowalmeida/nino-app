'use client'

import type { CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, FormField, Input, PasswordInput } from '@nino/ds'
import type { LoginRequest } from '@nino/lib'

import styles from '../../../motion.module.css'

import { login, setTokens } from '@/services/auth.service'

const title = 'font-display text-4xl font-extrabold tracking-tight text-dark'
const subtitle = 'mt-2 text-sm text-text/60'
const form = 'mt-8 flex flex-col gap-4'
const errorText = 'text-sm text-red-500 text-center'
const footer = 'mt-8 text-center text-sm text-text/60'
const footerLink = 'text-brand font-semibold hover:underline'
const riseWrapTitle = `${styles.rise} text-center`
const riseWrap = styles.rise
const footerRise = `${styles.rise} ${footer}`
const submit = 'mt-2 w-full'

const rise = (delay: number): CSSProperties =>
  ({ ['--d']: `${delay}ms` }) as CSSProperties

export function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>()

  async function onSubmit(data: LoginRequest) {
    try {
      const { tokens } = await login(data)
      setTokens(tokens.accessToken, tokens.refreshToken)
      router.push('/painel')
    } catch {
      setError('root', { message: 'Email ou senha incorretos.' })
    }
  }

  return (
    <div>
      <header className={riseWrapTitle} style={rise(0)}>
        <h1 className={title}>Bem-vindo</h1>
        <p className={subtitle}>Acesse o painel da sua loja</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} method="post" className={form}>
        <div className={riseWrap} style={rise(120)}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register('email', { required: 'Informe o email' })}
            />
          </FormField>
        </div>

        <div className={riseWrap} style={rise(200)}>
          <FormField label="Senha" error={errors.password?.message}>
            <PasswordInput
              placeholder="••••••••"
              error={!!errors.password}
              {...register('password', { required: 'Informe a senha' })}
            />
          </FormField>
        </div>

        {errors.root && <p className={errorText}>{errors.root.message}</p>}

        <div className={riseWrap} style={rise(280)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={submit}
            loadingIndicator="dots"
          >
            Entrar
          </Button>
        </div>
      </form>

      <p className={footerRise} style={rise(360)}>
        Não tem conta?{' '}
        <Link href="/cadastrar" className={footerLink}>
          Criar conta
        </Link>
      </p>
    </div>
  )
}
