import { useLoginForm } from '@pages/Login/hooks/useLoginForm/useLoginForm'

export const useLoginFacade = () => {
  const { register, submit, formState, isSending } = useLoginForm()

  return {
    register,
    submit,
    fieldErrors: formState.errors,
    isSending,
  }
}
