import { NavLink } from 'react-router'

import { riseDelay } from '@utils/rise-delay'

import type { SectionNavProps } from './SectionNav.types'

import styles from './SectionNav.module.css'
import motion from '@styles/motion.module.css'

/**
 * Índice de uma tela dividida em sub-rotas. Vertical no desktop, onde há
 * coluna sobrando; trilho rolável no celular, o mesmo gesto da fila de
 * pedidos. A dica só aparece onde cabe — no trilho, o rótulo basta.
 */
export const SectionNav = ({ sections, ariaLabel }: SectionNavProps) => (
  <nav className={styles.nav} aria-label={ariaLabel}>
    {sections.map(({ to, label, hint }, index) => (
      <NavLink
        key={to}
        to={to}
        style={riseDelay(index * 45 + 60)}
        className={({ isActive }) =>
          isActive
            ? `${motion.deal} ${styles.link} ${styles.current}`
            : `${motion.deal} ${styles.link}`
        }
      >
        <span className={styles.label}>{label}</span>
        <span className={styles.hint}>{hint}</span>
      </NavLink>
    ))}
  </nav>
)
