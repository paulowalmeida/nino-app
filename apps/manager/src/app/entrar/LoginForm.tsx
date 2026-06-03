'use client'

import type { CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, FormField, Input } from '@nino/ds'
import type { LoginRequest } from '@nino/lib'

import { login, setTokens } from '@/services/auth.service'

const title = 'font-display text-3xl font-extrabold tracking-tight text-gray-900'
const subtitle = 'mt-2 text-sm text-gray-500'
const form = 'mt-8 flex flex-col gap-4'
const errorText = 'text-sm text-red-500 text-center'
const footer = 'mt-8 text-center text-sm text-gray-500'
const footerLink = 'text-brand font-semibold hover:underline'

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
      router.push('/')
    } catch {
      setError('root', { message: 'Email ou senha incorretos.' })
    }
  }

  return (
    <div>
      <header className="auth-rise" style={rise(0)}>
        <h1 className={title}>Bem-vindo de volta</h1>
        <p className={subtitle}>Acesse o painel da sua loja</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={form}>
        <div className="auth-rise" style={rise(120)}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register('email', { required: 'Informe o email' })}
            />
          </FormField>
        </div>

        <div className="auth-rise" style={rise(200)}>
          <FormField label="Senha" error={errors.password?.message}>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Informe a senha' })}
            />
          </FormField>
        </div>

        {errors.root && <p className={errorText}>{errors.root.message}</p>}

        <div className="auth-rise" style={rise(280)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className="mt-2 w-full"
          >
            Entrar
          </Button>
        </div>
      </form>

      <p className={`auth-rise ${footer}`} style={rise(360)}>
        Não tem conta?{' '}
        <Link href="/cadastrar" className={footerLink}>
          Criar conta
        </Link>
      </p>
    </div>
  )
}
