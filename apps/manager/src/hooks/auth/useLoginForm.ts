import { useForm } from 'react-hook-form'

import type { LoginRequest } from '@custom_types/auth/login-request'
import { useLogin } from '@hooks/auth/useLogin'
import { authErrorMessage } from '@utils/auth-error-message'

/**
 * O formulário de entrar: campos, envio e a tradução da falha em uma frase
 * que a pessoa entenda.
 *
 * O erro nunca aponta um campo — senha errada e e-mail inexistente respondem
 * igual, de propósito, para a tela não confirmar quais e-mails existem.
 */
export const useLoginForm = () => {
  const { mutateAsync: login } = useLogin()
  const form = useForm<LoginRequest>()
  const { setError, handleSubmit } = form

  const submit = handleSubmit(async (data: LoginRequest) => {
    try {
      await login(data)
    } catch (error) {
      setError('root', { message: authErrorMessage(error) })
    }
  })

  return { ...form, submit }
}
