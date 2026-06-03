'use client'

import type { CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { Button, FormField, Input } from '@nino/ds'
import type { CompleteOnboardingRequest } from '@nino/lib'

import type { OnboardingFormProps } from './OnboardingForm.types'

import { completeOnboarding } from '@/services/onboarding.service'

const title = 'font-display text-3xl font-extrabold tracking-tight text-gray-900'
const subtitle = 'mt-2 text-sm text-gray-500'
const form = 'mt-8 flex flex-col gap-6'
const section = 'flex flex-col gap-4'
const sectionTitle =
  'text-xs font-semibold uppercase tracking-wider text-gray-400'
const errorText = 'text-sm text-red-500 text-center'
const riseWrapTitle = 'auth-rise text-center'
const riseWrap = 'auth-rise'
const submit = 'mt-2 w-full'

const rise = (delay: number): CSSProperties =>
  ({ ['--d']: `${delay}ms` }) as CSSProperties

export function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompleteOnboardingRequest>({
    defaultValues: {
      responsible: {
        name: user.name,
        email: user.credentials[0]?.email ?? '',
        phone: user.phone ?? '',
      },
    },
  })

  async function onSubmit(data: CompleteOnboardingRequest) {
    try {
      await completeOnboarding(data)
      router.replace('/painel')
    } catch {
      setError('root', {
        message: 'Não foi possível concluir. Confira os dados e tente de novo.',
      })
    }
  }

  return (
    <div>
      <header className={riseWrapTitle} style={rise(0)}>
        <h1 className={title}>Cadastre sua empresa</h1>
        <p className={subtitle}>Só mais um passo para começar a usar o Nino</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} method="post" className={form}>
        <div className={section}>
          <p className={sectionTitle}>Sua empresa</p>

          <div className={riseWrap} style={rise(120)}>
            <FormField label="Nome" error={errors.company?.name?.message}>
              <Input
                placeholder="Lanchonete do Zé"
                {...register('company.name', { required: 'Informe o nome' })}
              />
            </FormField>
          </div>

          <div className={riseWrap} style={rise(180)}>
            <FormField label="CNPJ" error={errors.company?.cnpj?.message}>
              <Input
                placeholder="00.000.000/0000-00"
                {...register('company.cnpj', { required: 'Informe o CNPJ' })}
              />
            </FormField>
          </div>

          <div className={riseWrap} style={rise(240)}>
            <FormField
              label="Razão social (opcional)"
              error={errors.company?.legalName?.message}
            >
              <Input
                placeholder="Zé Alimentos LTDA"
                {...register('company.legalName')}
              />
            </FormField>
          </div>
        </div>

        <div className={section}>
          <p className={sectionTitle}>Responsável</p>

          <div className={riseWrap} style={rise(300)}>
            <FormField label="Nome" error={errors.responsible?.name?.message}>
              <Input
                placeholder="José da Silva"
                {...register('responsible.name', {
                  required: 'Informe o nome',
                })}
              />
            </FormField>
          </div>

          <div className={riseWrap} style={rise(360)}>
            <FormField label="CPF" error={errors.responsible?.cpf?.message}>
              <Input
                placeholder="000.000.000-00"
                {...register('responsible.cpf', { required: 'Informe o CPF' })}
              />
            </FormField>
          </div>

          <div className={riseWrap} style={rise(420)}>
            <FormField label="Email" error={errors.responsible?.email?.message}>
              <Input
                type="email"
                placeholder="ze@email.com"
                {...register('responsible.email', {
                  required: 'Informe o email',
                })}
              />
            </FormField>
          </div>

          <div className={riseWrap} style={rise(480)}>
            <FormField
              label="Telefone"
              error={errors.responsible?.phone?.message}
            >
              <Input
                placeholder="(00) 00000-0000"
                {...register('responsible.phone', {
                  required: 'Informe o telefone',
                })}
              />
            </FormField>
          </div>
        </div>

        {errors.root && <p className={errorText}>{errors.root.message}</p>}

        <div className={riseWrap} style={rise(540)}>
          <Button type="submit" loading={isSubmitting} className={submit}>
            Concluir cadastro
          </Button>
        </div>
      </form>
    </div>
  )
}
