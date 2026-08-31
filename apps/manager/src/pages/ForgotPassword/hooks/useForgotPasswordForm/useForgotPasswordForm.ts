import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { useForgotPassword } from '@pages/ForgotPassword/hooks/useForgotPassword/useForgotPassword'
import { authErrorMessage } from '@pages/ForgotPassword/utils/authErrorMessage/authErrorMessage'
import type { ForgotPasswordRequest } from '@shared/types/auth/forgot-password-request.type'

export const useForgotPasswordForm = () => {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword()
  const [isSent, setIsSent] = useState(false)
  const { register, handleSubmit, setError, formState } =
    useForm<ForgotPasswordRequest>()

  const submit = handleSubmit(async (data) => {
    try {
      await forgotPassword(data)
      setIsSent(true)
    } catch (error) {
      setError('root', { message: authErrorMessage(error) })
    }
  })

  return {
    register,
    submit,
    formState,
    isSending: formState.isSubmitting || isPending,
    isSent,
  }
}
