'use client'

import type { CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, FormField, Input } from '@nino/ds'
import type { RegisterRequest } from '@nino/lib'
import { GlobalRole } from '@nino/lib'

import { register as registerOwner } from '@/services/auth.service'

const title = 'font-display text-3xl font-extrabold tracking-tight text-gray-900'
const subtitle = 'mt-2 text-sm text-gray-500'
const form = 'mt-8 flex flex-col gap-4'
const errorText = 'text-sm text-red-500 text-center'
const footer = 'mt-8 text-center text-sm text-gray-500'
const footerLink = 'text-brand font-semibold hover:underline'

const rise = (delay: number): CSSProperties =>
  ({ ['--d']: `${delay}ms` }) as CSSProperties

type RegisterFormValues = Omit<RegisterRequest, 'globalRole'>

export function RegisterForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>()

  async function onSubmit(data: RegisterFormValues) {
    try {
      await registerOwner({ ...data, globalRole: GlobalRole.OWNER })
      router.push('/entrar')
    } catch {
      setError('root', { message: 'Não foi possível criar a conta.' })
    }
  }

  return (
    <div>
      <header className="auth-rise" style={rise(0)}>
        <h1 className={title}>Crie sua conta</h1>
        <p className={subtitle}>Comece a gerir sua loja em minutos</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={form}>
        <div className="auth-rise" style={rise(120)}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input
              placeholder="Seu nome"
              {...register('name', { required: 'Informe o nome' })}
            />
          </FormField>
        </div>

        <div className="auth-rise" style={rise(180)}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register('email', { required: 'Informe o email' })}
            />
          </FormField>
        </div>

        <div className="auth-rise" style={rise(240)}>
          <FormField label="Senha" error={errors.password?.message}>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Informe a senha',
                minLength: { value: 6, message: 'Mínimo de 6 caracteres' },
              })}
            />
          </FormField>
        </div>

        {errors.root && <p className={errorText}>{errors.root.message}</p>}

        <div className="auth-rise" style={rise(320)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className="mt-2 w-full"
          >
            Criar conta
          </Button>
        </div>
      </form>

      <p className={`auth-rise ${footer}`} style={rise(400)}>
        Já tem conta?{' '}
        <Link href="/entrar" className={footerLink}>
          Entrar
        </Link>
      </p>
    </div>
  )
}
