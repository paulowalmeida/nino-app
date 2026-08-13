import { useForm } from 'react-hook-form'

import type { SignupAccount } from '@custom_types/auth/signup-account'
import { useCheckAvailability } from '@hooks/auth/useCheckAvailability'

export type AccountFormValues = SignupAccount & {
  confirmPassword: string
}

type UseAccountFormParams = {
  defaultValues?: SignupAccount | null
  onValid: (account: SignupAccount) => void
}

export const useAccountForm = ({
  defaultValues,
  onValid,
}: UseAccountFormParams) => {
  const { mutateAsync: checkAvailability } = useCheckAvailability()

  const form = useForm<AccountFormValues>({
    mode: 'onTouched',
    defaultValues: defaultValues
      ? { ...defaultValues, confirmPassword: defaultValues.password }
      : undefined,
  })

  const { setError, handleSubmit } = form

  const markTaken = (availability: {
    email?: boolean | null
    cpf?: boolean | null
  }) => {
    const takenFields: Array<'email' | 'cpf'> = []

    if (availability.email === false) takenFields.push('email')
    if (availability.cpf === false) takenFields.push('cpf')

    const messages = {
      email: 'E-mail já cadastrado',
      cpf: 'CPF já cadastrado',
    }

    takenFields.forEach((field) =>
      setError(field, { message: messages[field] })
    )

    return takenFields.length > 0
  }

  const submit = handleSubmit(async (data: AccountFormValues) => {
    try {
      const availability = await checkAvailability({
        email: data.email,
        cpf: data.cpf,
      })

      if (markTaken(availability)) return

      onValid({
        name: data.name,
        email: data.email,
        password: data.password,
        cpf: data.cpf,
        phone: data.phone,
      })
    } catch {
      setError('root', {
        message: 'Não foi possível validar os dados. Tente de novo.',
      })
    }
  })

  return { ...form, submit }
}
