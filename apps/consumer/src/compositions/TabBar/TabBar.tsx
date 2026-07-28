import { NavLink } from 'react-router'

import { Icon } from '@components/Icon/Icon'

import bagIcon from '@assets/icons/bag.svg?raw'
import cardIcon from '@assets/icons/credit-card.svg?raw'
import pinIcon from '@assets/icons/map-pin.svg?raw'
import userIcon from '@assets/icons/user.svg?raw'

import type { TabBarProps } from './TabBar.types'

import styles from './TabBar.module.css'

/**
 * A barra de ações do celular — os mesmos atalhos que o desktop guarda no
 * menu da conta, aqui abertos ao polegar.
 *
 * Sem "Início": a vitrine já é a página onde a pessoa está. Sem lupa: a busca
 * mora no topo e acompanha a rolagem, então um atalho para ela seria um botão
 * que leva a algo que já está à vista.
 */
const TABS = [
  { to: '/conta/pedidos', label: 'Pedidos', icon: bagIcon },
  { to: '/conta/enderecos', label: 'Endereços', icon: pinIcon },
  { to: '/conta/pagamento', label: 'Pagamento', icon: cardIcon },
  { to: '/conta/dados', label: 'Perfil', icon: userIcon },
]

export const TabBar = ({ base }: TabBarProps) => (
  <nav className={styles.bar} aria-label="Atalhos">
    {TABS.map(({ to, label, icon }) => (
      <NavLink
        key={to}
        to={`${base}${to}`}
        className={({ isActive }) =>
          isActive ? `${styles.tab} ${styles.tabOn}` : styles.tab
        }
      >
        <Icon svg={icon} />
        <span className={styles.label}>{label}</span>
      </NavLink>
    ))}
  </nav>
)
