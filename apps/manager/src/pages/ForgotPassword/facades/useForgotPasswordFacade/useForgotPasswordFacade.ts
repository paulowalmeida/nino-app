import { useForgotPasswordForm } from '@pages/ForgotPassword/hooks/useForgotPasswordForm/useForgotPasswordForm'

export const useForgotPasswordFacade = () => {
  const { register, submit, formState, isSending, isSent } =
    useForgotPasswordForm()

  return {
    register,
    submit,
    fieldErrors: formState.errors,
    isSending,
    isSent,
  }
}
