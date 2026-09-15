import { useForm } from 'react-hook-form'

import { useCheckAvailability } from '@pages/Register/hooks/useCheckAvailability/useCheckAvailability'
import type { CompanyFormValues } from '@pages/Register/types/CompanyFormValues.type'
import type { SignupCompany } from '@shared/types/auth/signup-company'

type UseCompanyFormParams = {
  goToUnit: (company: SignupCompany) => void
}

export const useCompanyForm = ({ goToUnit }: UseCompanyFormParams) => {
  const { mutateAsync: checkAvailability } = useCheckAvailability()

  const form = useForm<CompanyFormValues>()
  const { setError, handleSubmit } = form

  const submit = handleSubmit(async (data) => {
    try {
      const availability = await checkAvailability({ cnpj: data.company.cnpj })

      if (availability.cnpj === false) {
        setError('company.cnpj', { message: 'CNPJ já cadastrado' })
        return
      }

      goToUnit(data.company)
    } catch {
      setError('root', {
        message: 'Não foi possível validar o CNPJ. Tente de novo.',
      })
    }
  })

  return { ...form, submit }
}
