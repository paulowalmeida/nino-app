import { useForm } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { CnpjInput } from '@nino/ds/components/CnpjInput'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { isValidCnpj } from '@nino/ds/validators'
import { useCheckAvailability } from '@hooks/auth/useCheckAvailability'
import { useSignup } from '@hooks/auth/useSignup'
import type { SignupAccount } from '@custom_types/auth/signup-account'
import type { SignupCompany } from '@custom_types/auth/signup-company'
import { ApiError } from '@nino/lib/utils/api-error'
import { riseDelay } from '@utils/rise-delay'

import styles from '@styles/authForm.module.css'
import motion from '@styles/rise.module.css'

type CompanyFormValues = {
  company: SignupCompany
}

export type CompanyStepProps = {
  account: SignupAccount
  onBack: () => void
  onSignedUp: () => void
}

export const CompanyStep = ({
  account,
  onBack,
  onSignedUp,
}: CompanyStepProps) => {
  const { mutateAsync: checkAvailability } = useCheckAvailability()
  const { mutateAsync: signup } = useSignup()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>()

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      const availability = await checkAvailability({ cnpj: data.company.cnpj })
      if (availability.cnpj === false) {
        setError('company.cnpj', { message: 'CNPJ já cadastrado' })
        return
      }

      await signup({ account, company: data.company })
      onSignedUp()
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError('root', { message: error.message })
        return
      }
      setError('root', {
        message: 'Não foi possível concluir. Confira os dados e tente de novo.',
      })
    }
  }

  return (
    <div>
      <header
        className={`${motion.rise} ${styles.header}`}
        style={riseDelay(0)}
      >
        <h1 className={styles.title}>Sua empresa</h1>
        <p className={styles.subtitle}>
          Quase lá, {account.name.split(' ')[0]}
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={motion.rise} style={riseDelay(120)}>
          <FormField label="Nome" error={errors.company?.name?.message}>
            <Input
              placeholder="Lanchonete do Zé"
              {...register('company.name', { required: 'Informe o nome' })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={riseDelay(180)}>
          <FormField label="CNPJ" error={errors.company?.cnpj?.message}>
            <CnpjInput
              error={!!errors.company?.cnpj}
              {...register('company.cnpj', {
                required: 'Informe o CNPJ',
                validate: (value) => isValidCnpj(value) || 'CNPJ inválido',
              })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={riseDelay(240)}>
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

        {errors.root && <Alert variant="error">{errors.root.message}</Alert>}

        <div className={motion.rise} style={riseDelay(300)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={styles.submit}
            loadingIndicator="dots"
          >
            Continuar
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={isSubmitting}
            className={styles.submit}
          >
            Voltar
          </Button>
        </div>
      </form>
    </div>
  )
}
