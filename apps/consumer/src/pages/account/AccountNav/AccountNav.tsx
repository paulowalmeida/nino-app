import { NavLink } from 'react-router'

import { Icon } from '@nino/ds/components/Icon'
import { ACCOUNT_SECTIONS } from '@constants/account-sections'
import { riseDelay } from '@utils/rise-delay'

import type { AccountNavProps } from './AccountNav.types'

import styles from './AccountNav.module.css'
import motion from '@styles/motion.module.css'

/**
 * O índice da conta. No desktop é uma coluna à esquerda do painel; no celular
 * vira uma trilha rolável — o mesmo gesto da fila de pedidos do gestor, para
 * a mão não aprender dois jeitos de trocar de seção.
 *
 * Cada linha carrega a contagem do que guarda. Um menu que diz "3 endereços"
 * já respondeu metade da pergunta antes de abrir a gaveta; o que ainda não
 * existe diz "em breve" no mesmo lugar, sem fingir que está vazio.
 */
export const AccountNav = ({
  base,
  counts,
  onLogout,
  isLoggingOut,
}: AccountNavProps) => (
  <nav className={styles.nav} aria-label="Seções da conta">
    <ul className={styles.list}>
      {ACCOUNT_SECTIONS.map(({ to, label, icon, soon }, index) => (
        <li
          key={to}
          className={`${motion.deal} ${styles.item}`}
          style={riseDelay(90 + index * 45)}
        >
          <NavLink
            to={`${base}/${to}`}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkOn}` : styles.link
            }
          >
            <Icon name={icon} className={styles.icon} />
            <span className={styles.label}>{label}</span>

            {soon ? (
              <span className={styles.soon}>em breve</span>
            ) : (
              counts[to] !== undefined && (
                <span className={styles.count}>{counts[to]}</span>
              )
            )}
          </NavLink>
        </li>
      ))}
    </ul>

    <button
      type="button"
      className={`${motion.press} ${styles.logout}`}
      onClick={onLogout}
      disabled={isLoggingOut}
    >
      <Icon name="logout" className={styles.icon} />
      <span className={styles.label}>
        {isLoggingOut ? 'Saindo…' : 'Sair da conta'}
      </span>
    </button>
  </nav>
)
