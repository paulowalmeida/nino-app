import { useNavigate, useSearchParams } from 'react-router'

import { useForm } from 'react-hook-form'

import { useResetPassword } from '@pages/ResetPassword/hooks/useResetPassword/useResetPassword'
import { authErrorMessage } from '@pages/ResetPassword/utils/authErrorMessage/authErrorMessage'

type ResetPasswordFormValues = {
  password: string
  confirmPassword: string
}

export const useResetPasswordForm = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()
  const { mutateAsync: resetPassword, isPending } = useResetPassword()
  const { register, handleSubmit, getValues, setError, formState } =
    useForm<ResetPasswordFormValues>()

  const submit = handleSubmit(async (data) => {
    try {
      await resetPassword({ token, password: data.password })
      void navigate('/entrar')
    } catch (error) {
      setError('root', { message: authErrorMessage(error) })
    }
  })

  return {
    register,
    submit,
    getValues,
    formState,
    isSending: formState.isSubmitting || isPending,
    hasToken: token.length > 0,
  }
}
