import { useForm } from 'react-hook-form'

import { useLogin } from '@pages/Login/hooks/useLogin/useLogin'
import { authErrorMessage } from '@pages/Login/utils/authErrorMessage/authErrorMessage'
import type { LoginRequest } from '@shared/types/auth/login-request'

/* WHY: o erro nunca aponta um campo — senha errada e e-mail inexistente
 * respondem igual, de propósito, para a tela não confirmar quais e-mails
 * existem. E o botão só descarrega quando a navegação acontece, por isso o
 * envio soma o estado do formulário ao da mutation.
 */
export const useLoginForm = () => {
  const { mutateAsync: login, isPending } = useLogin()
  const { register, handleSubmit, setError, formState } =
    useForm<LoginRequest>()

  const submit = handleSubmit(async (data) => {
    try {
      await login(data)
    } catch (error) {
      setError('root', { message: authErrorMessage(error) })
    }
  })

  return {
    register,
    submit,
    formState,
    isSending: formState.isSubmitting || isPending,
  }
}
