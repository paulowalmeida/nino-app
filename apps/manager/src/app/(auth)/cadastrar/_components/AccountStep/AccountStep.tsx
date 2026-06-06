'use client'

import type { CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

import {
  Button,
  CpfInput,
  FormField,
  Input,
  PasswordInput,
  PhoneInput,
} from '@nino/ds'
import { GlobalRole } from '@nino/lib'

import styles from '../../../motion.module.css'
import type { AccountFormValues, AccountStepProps } from './AccountStep.types'

import {
  login,
  register as registerOwner,
  setTokens,
} from '@/services/auth.service'

const header = `${styles.rise} text-center`
const step = 'text-xs font-semibold uppercase tracking-wider text-brand'
const title = 'font-display text-4xl font-extrabold tracking-tight text-dark'
const subtitle = 'mt-2 text-sm text-text/60'
const form = 'mt-8 flex flex-col gap-4'
const errorText = 'text-sm text-red-500 text-center'
const footer = 'mt-8 text-center text-sm text-text/60'
const footerLink = 'text-brand font-semibold hover:underline'
const riseWrap = styles.rise
const footerRise = `${styles.rise} ${footer}`
const submit = 'mt-2 w-full'

const rise = (delay: number): CSSProperties =>
  ({ ['--d']: `${delay}ms` }) as CSSProperties

export function AccountStep({ onNext }: AccountStepProps) {
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>()

  async function onSubmit(data: AccountFormValues) {
    try {
      await registerOwner({
        name: data.name,
        email: data.email,
        password: data.password,
        globalRole: GlobalRole.OWNER,
      })
      const { tokens } = await login({
        email: data.email,
        password: data.password,
      })
      setTokens(tokens.accessToken, tokens.refreshToken)
      onNext({
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
      })
    } catch {
      setError('root', {
        message: 'Não foi possível criar a conta. Verifique os dados.',
      })
    }
  }

  return (
    <div>
      <header className={header} style={rise(0)}>
        <p className={step}>Passo 1 de 2</p>
        <h1 className={title}>Crie sua conta</h1>
        <p className={subtitle}>Comece pelos seus dados de responsável</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} method="post" className={form}>
        <div className={riseWrap} style={rise(120)}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input
              placeholder="Seu nome"
              {...register('name', { required: 'Informe o nome' })}
            />
          </FormField>
        </div>

        <div className={riseWrap} style={rise(180)}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register('email', { required: 'Informe o email' })}
            />
          </FormField>
        </div>

        <div className={riseWrap} style={rise(240)}>
          <FormField label="Telefone" error={errors.phone?.message}>
            <PhoneInput
              error={!!errors.phone}
              {...register('phone', { required: 'Informe o telefone' })}
            />
          </FormField>
        </div>

        <div className={riseWrap} style={rise(300)}>
          <FormField label="CPF" error={errors.cpf?.message}>
            <CpfInput
              error={!!errors.cpf}
              {...register('cpf', { required: 'Informe o CPF' })}
            />
          </FormField>
        </div>

        <div className={riseWrap} style={rise(360)}>
          <FormField label="Senha" error={errors.password?.message}>
            <PasswordInput
              placeholder="••••••••"
              error={!!errors.password}
              {...register('password', { required: 'Informe a senha' })}
            />
          </FormField>
        </div>

        <div className={riseWrap} style={rise(420)}>
          <FormField
            label="Confirmar senha"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              placeholder="••••••••"
              error={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Confirme a senha',
                validate: (value) =>
                  value === getValues('password') || 'As senhas não conferem',
              })}
            />
          </FormField>
        </div>

        {errors.root && <p className={errorText}>{errors.root.message}</p>}

        <div className={riseWrap} style={rise(480)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={submit}
            loadingIndicator="dots"
          >
            Continuar
          </Button>
        </div>
      </form>

      <p className={footerRise} style={rise(540)}>
        Já tem conta?{' '}
        <Link href="/entrar" className={footerLink}>
          Entrar
        </Link>
      </p>
    </div>
  )
}
