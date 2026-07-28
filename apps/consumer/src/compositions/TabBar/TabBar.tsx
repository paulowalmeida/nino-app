import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'

import { Icon } from '@components/Icon/Icon'
import { AccountDrawer } from '@compositions/AccountDrawer/AccountDrawer'

import bagIcon from '@assets/icons/bag.svg?raw'
import homeIcon from '@assets/icons/home.svg?raw'
import userIcon from '@assets/icons/user.svg?raw'

import type { TabBarProps } from './TabBar.types'

import styles from './TabBar.module.css'

/**
 * A barra de ações do celular — três alvos, com a vitrine no meio.
 *
 * Três e não seis: o resto da conta mora na gaveta que o "Perfil" abre, e uma
 * barra que repete o que a gaveta já lista gasta o lugar mais valioso da tela
 * com atalhos para o que quase ninguém abre duas vezes. Ficam aqui os dois
 * destinos de uso repetido — o cardápio e os pedidos — e a porta da conta.
 *
 * "Pedidos" à esquerda e "Perfil" à direita porque é onde a mão já procura:
 * a conta no canto direito é convenção de quase todo app de celular, e
 * contrariá-la custaria um reflexo aprendido sem devolver nada.
 */
export const TabBar = ({ base }: TabBarProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const home = base || '/'
  const isHome = pathname === home || pathname === `${home}/`
  const orders = `${base}/conta/pedidos`

  /* um aceso por vez: "Pedidos" tem alvo próprio, então o "Perfil" só se
     acende pelas gavetas que não estão na barra — e enquanto a sua está
     aberta, porque é ela que a pessoa está olhando */
  const isAccount =
    isAccountOpen ||
    (pathname.startsWith(`${base}/conta`) && !pathname.startsWith(orders))

  /*
   * Tocar na aba da tela em que já se está sobe ao topo, em vez de recarregar
   * a mesma rota — o mesmo gesto que o celular ensinou em todo app de lista.
   * Fora da vitrine, o mesmo botão é o caminho de volta para o cardápio.
   */
  const handleHome = () => {
    if (!isHome) {
      navigate(home)
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' })
  }

  return (
    <>
      <nav className={styles.bar} aria-label="Atalhos">
        <NavLink
          to={orders}
          className={({ isActive }) =>
            isActive && !isAccountOpen
              ? `${styles.tab} ${styles.tabOn}`
              : styles.tab
          }
        >
          <Icon svg={bagIcon} />
          <span className={styles.label}>Pedidos</span>
        </NavLink>

        {/* o único alvo que veste a cor da loja: a vitrine é a casa, e o anel
            é a marca do cliente aparecendo na navegação do freguês dele */}
        <button
          type="button"
          onClick={handleHome}
          aria-current={isHome ? 'page' : undefined}
          aria-label={isHome ? 'Voltar ao topo do cardápio' : 'Ir ao cardápio'}
          className={isHome ? `${styles.home} ${styles.homeOn}` : styles.home}
        >
          <span className={styles.homeRing}>
            <Icon svg={homeIcon} />
          </span>
          <span className={styles.label}>Início</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAccountOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isAccountOpen}
          className={isAccount ? `${styles.tab} ${styles.tabOn}` : styles.tab}
        >
          <Icon svg={userIcon} />
          <span className={styles.label}>Perfil</span>
        </button>
      </nav>

      <AccountDrawer
        open={isAccountOpen}
        onOpenChange={setIsAccountOpen}
        base={base}
      />
    </>
  )
}
