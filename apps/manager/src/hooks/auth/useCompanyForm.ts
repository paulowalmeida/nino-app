import { useForm } from 'react-hook-form'

import type { SignupAccount } from '@custom_types/auth/signup-account'
import type { SignupCompany } from '@custom_types/auth/signup-company'
import { useCheckAvailability } from '@hooks/auth/useCheckAvailability'
import { useSignup } from '@hooks/auth/useSignup'
import { signupErrorMessage } from '@utils/signup-error-message'

export type CompanyFormValues = {
  company: SignupCompany
}

type UseCompanyFormParams = {
  account: SignupAccount
  onSignedUp: () => void
}

/**
 * O último passo do cadastro: a empresa entra junto com a conta guardada no
 * passo anterior, e as duas nascem na mesma chamada.
 *
 * O CNPJ é conferido antes do envio para o erro cair no campo, e não numa
 * faixa vermelha no rodapé — é o único dado deste passo que pode já existir.
 */
export const useCompanyForm = ({
  account,
  onSignedUp,
}: UseCompanyFormParams) => {
  const { mutateAsync: checkAvailability } = useCheckAvailability()
  const { mutateAsync: signup } = useSignup()

  const form = useForm<CompanyFormValues>()
  const { setError, handleSubmit } = form

  const submit = handleSubmit(async (data: CompanyFormValues) => {
    try {
      const availability = await checkAvailability({ cnpj: data.company.cnpj })

      if (availability.cnpj === false) {
        setError('company.cnpj', { message: 'CNPJ já cadastrado' })
        return
      }

      await signup({ account, company: data.company })
      onSignedUp()
    } catch (error) {
      setError('root', { message: signupErrorMessage(error) })
    }
  })

  return { ...form, submit }
}
