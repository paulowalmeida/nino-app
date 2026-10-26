import { useForm } from 'react-hook-form'

import { useCheckAvailability } from '@pages/Register/hooks/useCheckAvailability/useCheckAvailability'
import type { AccountFormValues } from '@pages/Register/types/AccountFormValues.type'
import type { SignupAccount } from '@shared/types/auth/signup-account'

type UseAccountFormParams = {
  defaultValues: SignupAccount | null
  onValid: (account: SignupAccount) => void
}

const TAKEN_MESSAGES = {
  email: 'E-mail já cadastrado',
  cpf: 'CPF já cadastrado',
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

  /* WHY: e-mail e CPF já cadastrados voltam no próprio campo — uma faixa no
   * rodapé não diz qual dos dois o dono precisa trocar. */
  const markTaken = (availability: {
    email?: boolean | null
    cpf?: boolean | null
  }) => {
    const takenFields: Array<'email' | 'cpf'> = []

    if (availability.email === false) takenFields.push('email')
    if (availability.cpf === false) takenFields.push('cpf')

    takenFields.forEach((field) =>
      setError(field, { message: TAKEN_MESSAGES[field] })
    )

    return takenFields.length > 0
  }

  const submit = handleSubmit(async (data) => {
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
