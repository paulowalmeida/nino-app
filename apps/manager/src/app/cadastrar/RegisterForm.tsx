'use client'

import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, FormField, Input } from '@nino/ds'
import type { RegisterRequest } from '@nino/lib'
import { GlobalRole } from '@nino/lib'

import { register as registerOwner } from '@/services/auth.service'

const card = 'w-full max-w-sm p-8 bg-white rounded-xl shadow-sm border border-gray-200'
const header = 'mb-8 text-center'
const title = 'text-2xl font-semibold text-gray-900'
const subtitle = 'mt-1 text-sm text-gray-500'
const form = 'flex flex-col gap-4'
const errorText = 'text-sm text-red-500 text-center'
const footer = 'mt-6 text-center text-sm text-gray-500'
const footerLink = 'text-brand font-medium hover:underline'

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
    <div className={card}>
      <div className={header}>
        <h1 className={title}>Criar conta</h1>
        <p className={subtitle}>Comece a gerir sua loja</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={form}>
        <FormField label="Nome" error={errors.name?.message}>
          <Input
            placeholder="Seu nome"
            {...register('name', { required: 'Informe o nome' })}
          />
        </FormField>

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
            {...register('password', {
              required: 'Informe a senha',
              minLength: { value: 6, message: 'Mínimo de 6 caracteres' },
            })}
          />
        </FormField>

        {errors.root && <p className={errorText}>{errors.root.message}</p>}

        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Criar conta
        </Button>
      </form>

      <p className={footer}>
        Já tem conta?{' '}
        <Link href="/entrar" className={footerLink}>
          Entrar
        </Link>
      </p>
    </div>
  )
}
