import { useNavigate } from 'react-router'

import { useForm } from 'react-hook-form'

import { useSignup } from '@pages/Register/hooks/useSignup/useSignup'
import { signupErrorMessage } from '@pages/Register/utils/signupErrorMessage/signupErrorMessage'
import { toStoreSlug } from '@shared/adapters/store-slug.adapter/store-slug.adapter'
import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

type UseUnitFormParams = {
  account: SignupAccount | null
  company: SignupCompany | null
}

export const useUnitForm = ({ account, company }: UseUnitFormParams) => {
  const navigate = useNavigate()
  const { mutateAsync: signup } = useSignup()

  const form = useForm<FirstStoreFormValues>({
    mode: 'onTouched',
    defaultValues: {
      customName: company?.name ?? '',
      slug: company ? toStoreSlug(company.name) : '',
    },
  })
  const { getValues, setValue, setError, handleSubmit } = form

  const fillSlugFromName = () => {
    const { customName, slug } = getValues()
    if (!slug && customName) setValue('slug', toStoreSlug(customName))
  }

  const submit = handleSubmit(async (data) => {
    if (!account || !company) return

    try {
      await signup({
        account,
        company,
        unit: {
          customName: data.customName,
          slug: toStoreSlug(data.slug),
          zipCode: data.zipCode.replace(/\D/g, ''),
          street: data.street,
          number: data.number,
          complement: data.complement || undefined,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        },
      })
      void navigate('/')
    } catch (error) {
      setError('root', { message: signupErrorMessage(error) })
    }
  })

  return { ...form, submit, fillSlugFromName }
}
