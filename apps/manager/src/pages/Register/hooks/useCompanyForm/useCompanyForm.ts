import { useNavigate } from 'react-router'

import { useForm } from 'react-hook-form'

import { useCheckAvailability } from '@pages/Register/hooks/useCheckAvailability/useCheckAvailability'
import { useSignup } from '@pages/Register/hooks/useSignup/useSignup'
import type { CompanyFormValues } from '@pages/Register/types/CompanyFormValues.type'
import { signupErrorMessage } from '@pages/Register/utils/signupErrorMessage/signupErrorMessage'
import type { SignupAccount } from '@shared/types/auth/signup-account'

type UseCompanyFormParams = {
  account: SignupAccount | null
}

export const useCompanyForm = ({ account }: UseCompanyFormParams) => {
  const navigate = useNavigate()
  const { mutateAsync: checkAvailability } = useCheckAvailability()
  const { mutateAsync: signup } = useSignup()

  const form = useForm<CompanyFormValues>()
  const { setError, handleSubmit } = form

  const submit = handleSubmit(async (data) => {
    if (!account) return

    try {
      const availability = await checkAvailability({ cnpj: data.company.cnpj })

      if (availability.cnpj === false) {
        setError('company.cnpj', { message: 'CNPJ já cadastrado' })
        return
      }

      await signup({ account, company: data.company })
      void navigate('/')
    } catch (error) {
      setError('root', { message: signupErrorMessage(error) })
    }
  })

  return { ...form, submit }
}
