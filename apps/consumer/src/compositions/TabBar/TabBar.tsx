import { NavLink } from 'react-router'

import { Icon } from '@components/Icon/Icon'

import bagIcon from '@assets/icons/bag.svg?raw'
import searchIcon from '@assets/icons/search.svg?raw'
import userIcon from '@assets/icons/user.svg?raw'

import type { TabBarProps } from './TabBar.types'

import styles from './TabBar.module.css'

/**
 * A barra de ações do celular. Só existe no celular: no desktop os mesmos
 * destinos moram no topo, e uma barra colada no rodapé de uma tela de 27"
 * seria um alvo longe de qualquer mão.
 *
 * Sem "Início": a vitrine já é a página onde a pessoa está, e um botão que
 * leva para onde você já está é um botão que ensina a ignorar a barra.
 */
export const TabBar = ({ base, onSearch }: TabBarProps) => (
  <nav className={styles.bar} aria-label="Atalhos">
    <button type="button" className={styles.tab} onClick={onSearch}>
      <Icon svg={searchIcon} />
      <span className={styles.label}>Buscar</span>
    </button>

    <NavLink
      to={`${base}/conta/pedidos`}
      className={({ isActive }) =>
        isActive ? `${styles.tab} ${styles.tabOn}` : styles.tab
      }
    >
      <Icon svg={bagIcon} />
      <span className={styles.label}>Pedidos</span>
    </NavLink>

    <NavLink
      to={`${base}/conta/dados`}
      className={({ isActive }) =>
        isActive ? `${styles.tab} ${styles.tabOn}` : styles.tab
      }
    >
      <Icon svg={userIcon} />
      <span className={styles.label}>Perfil</span>
    </NavLink>
  </nav>
)
