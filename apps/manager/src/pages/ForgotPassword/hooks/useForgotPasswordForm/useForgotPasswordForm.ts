import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { useForgotPassword } from '@pages/ForgotPassword/hooks/useForgotPassword/useForgotPassword'
import { authErrorMessage } from '@pages/ForgotPassword/utils/authErrorMessage/authErrorMessage'
import type { ForgotPasswordRequest } from '@shared/types/auth/forgot-password-request.type'

/* WHY: guarda o endereço, não um booleano — a tela de confirmação mostra
 * para onde o link foi, que é como a pessoa percebe na hora que digitou
 * `gmial` em vez de `gmail`. */
export const useForgotPasswordForm = () => {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword()
  const [sentTo, setSentTo] = useState<string | null>(null)
  const { register, handleSubmit, setError, formState } =
    useForm<ForgotPasswordRequest>()

  const submit = handleSubmit(async (data) => {
    try {
      await forgotPassword(data)
      setSentTo(data.email)
    } catch (error) {
      setError('root', { message: authErrorMessage(error) })
    }
  })

  const useAnotherEmail = () => setSentTo(null)

  return {
    register,
    submit,
    formState,
    isSending: formState.isSubmitting || isPending,
    sentTo,
    useAnotherEmail,
  }
}
