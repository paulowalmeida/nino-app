import { redirect } from 'react-router'

import { useSessionStore } from '@states/useSessionStore'

/**
 * `/unidades` é a tela de quem ainda não tem loja nenhuma. Quem já tem cadastra
 * a próxima dentro do painel, em Configurações › Unidades, com a casca e a
 * navegação por perto — cair aqui só mostraria "sua primeira loja" para quem já
 * passou dessa fase.
 */
export const FirstStoreGuard = async () => {
  const user = await useSessionStore.getState().load()
  if (!user) return redirect('/entrar')

  const { memberships } = useSessionStore.getState()
  if (memberships.length > 0) return redirect('/')

  return null
}
