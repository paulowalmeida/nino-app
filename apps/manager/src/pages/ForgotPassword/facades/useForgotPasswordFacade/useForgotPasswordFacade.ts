import { useForgotPasswordForm } from '@pages/ForgotPassword/hooks/useForgotPasswordForm/useForgotPasswordForm'

export const useForgotPasswordFacade = () => {
  const { register, submit, formState, isSending, sentTo, useAnotherEmail } =
    useForgotPasswordForm()

  return {
    register,
    submit,
    fieldErrors: formState.errors,
    isSending,
    sentTo,
    useAnotherEmail,
  }
}
