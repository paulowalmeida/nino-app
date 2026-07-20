import { Link } from 'react-router'

import type { BackLinkProps } from './BackLink.types'

import styles from './BackLink.module.css'
import motion from '@styles/motion.module.css'

/**
 * Voltar é o alvo mais usado das telas de detalhe e vive perto da borda: a
 * área de toque tem 44px de altura, o mínimo confortável no celular.
 */
export const BackLink = ({ to = '..', children }: BackLinkProps) => (
  <Link to={to} relative="path" className={`${motion.press} ${styles.link}`}>
    <span aria-hidden="true" className={styles.arrow}>
      ←
    </span>
    {children}
  </Link>
)
