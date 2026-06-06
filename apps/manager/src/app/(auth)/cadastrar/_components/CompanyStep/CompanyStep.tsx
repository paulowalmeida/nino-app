'use client'

import type { CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { Button, FormField, Input } from '@nino/ds'

import styles from '../../../motion.module.css'
import type { CompanyFormValues, CompanyStepProps } from './CompanyStep.types'

import { completeOnboarding } from '@/services/onboarding.service'

const header = `${styles.rise} text-center`
const step = 'text-xs font-semibold uppercase tracking-wider text-brand'
const title = 'font-display text-4xl font-extrabold tracking-tight text-dark'
const subtitle = 'mt-2 text-sm text-text/60'
const form = 'mt-8 flex flex-col gap-4'
const errorText = 'text-sm text-red-500 text-center'
const riseWrap = styles.rise
const submit = 'mt-2 w-full'

const rise = (delay: number): CSSProperties =>
  ({ ['--d']: `${delay}ms` }) as CSSProperties

export function CompanyStep({ responsible }: CompanyStepProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>()

  async function onSubmit(data: CompanyFormValues) {
    try {
      await completeOnboarding({ company: data.company, responsible })
      router.push('/painel')
    } catch {
      setError('root', {
        message: 'Não foi possível concluir. Confira os dados e tente de novo.',
      })
    }
  }

  return (
    <div>
      <header className={header} style={rise(0)}>
        <p className={step}>Passo 2 de 2</p>
        <h1 className={title}>Sua empresa</h1>
        <p className={subtitle}>Quase lá, {responsible.name.split(' ')[0]}</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} method="post" className={form}>
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

        {errors.root && <p className={errorText}>{errors.root.message}</p>}

        <div className={riseWrap} style={rise(300)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={submit}
            loadingIndicator="dots"
          >
            Concluir cadastro
          </Button>
        </div>
      </form>
    </div>
  )
}
