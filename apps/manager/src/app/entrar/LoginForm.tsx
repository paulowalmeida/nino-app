'use client'

import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, FormField, Input } from '@nino/ds'
import type { LoginRequest } from '@nino/lib'

import { login, setTokens } from '@/services/auth.service'

const card = 'w-full max-w-sm p-8 bg-white rounded-xl shadow-sm border border-gray-200'
const header = 'mb-8 text-center'
const title = 'text-2xl font-semibold text-gray-900'
const subtitle = 'mt-1 text-sm text-gray-500'
const form = 'flex flex-col gap-4'
const errorText = 'text-sm text-red-500 text-center'
const footer = 'mt-6 text-center text-sm text-gray-500'
const footerLink = 'text-brand font-medium hover:underline'

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
    <div className={card}>
      <div className={header}>
        <h1 className={title}>Nino</h1>
        <p className={subtitle}>Acesse sua conta</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={form}>
        <FormField label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="seu@email.com"
            {...register('email', { required: 'Informe o email' })}
          />
        </FormField>

        <FormField label="Senha" error={errors.password?.message}>
          <Input
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Informe a senha' })}
          />
        </FormField>

        {errors.root && (
          <p className={errorText}>{errors.root.message}</p>
        )}

        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Entrar
        </Button>
      </form>

      <p className={footer}>
        Não tem conta?{' '}
        <Link href="/cadastrar" className={footerLink}>
          Criar conta
        </Link>
      </p>
    </div>
  )
}
