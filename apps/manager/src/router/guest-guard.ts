import { redirect, type LoaderFunctionArgs } from 'react-router'

import { STORE_DRAFT_KEY } from '@constants/drafts'
import { loadSession } from '@services/auth/session.service'
import { useSessionStore } from '@states/useSessionStore'
import { clearDraft } from '@utils/form-draft'
import { hadSession } from '@utils/session-hint'

/**
 * Guarda das telas de entrada. Sessão viva aqui tem três leituras, e a rota é
 * o que as separa:
 *
 * - **Sessão com loja**: cadastro terminou. Login e cadastro não são lugar de
 *   ficar — a raiz decide entre unidade, seleção ou lista.
 * - **Sessão sem loja em `/cadastrar`**: a conta existe e falta a loja. Segue
 *   para `/unidades`, em vez de pedir de novo os dados de uma conta criada.
 * - **Sessão sem loja em `/entrar`**: voltar até o login é desistir. Fica no
 *   login e o rascunho da loja é descartado, senão a próxima pessoa a abrir
 *   `/unidades` neste navegador herda o endereço que a anterior digitou.
 *
 * Guarda de rota não desloga ninguém: um erro de classificação aqui derrubaria
 * a sessão de quem só abriu `/entrar` por engano. Descartar rascunho é
 * reversível; encerrar sessão, não.
 */
const SIGNUP_PATH = '/cadastrar'

export const GuestGuard = async ({ request }: LoaderFunctionArgs) => {
  /* Sem dica de sessão neste navegador não há o que perguntar — visitante é
   * visitante, e a viagem até a API só atrasaria a tela. */
  if (!hadSession()) return null

  const user = await loadSession()
  if (!user) return null

  const { memberships } = useSessionStore.getState()
  if (memberships.length > 0) return redirect('/')

  const { pathname } = new URL(request.url)
  if (pathname === SIGNUP_PATH) return redirect('/unidades')

  clearDraft(STORE_DRAFT_KEY)

  return null
}
