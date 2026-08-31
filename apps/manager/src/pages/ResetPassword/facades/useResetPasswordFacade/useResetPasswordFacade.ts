import { useResetPasswordForm } from '@pages/ResetPassword/hooks/useResetPasswordForm/useResetPasswordForm'

export const useResetPasswordFacade = () => {
  const { register, submit, getValues, formState, isSending, hasToken } =
    useResetPasswordForm()

  return {
    register,
    submit,
    getValues,
    fieldErrors: formState.errors,
    isSending,
    hasToken,
  }
}
