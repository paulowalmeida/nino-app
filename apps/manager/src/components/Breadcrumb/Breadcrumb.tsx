import { Link } from 'react-router'

import type { BreadcrumbProps } from './Breadcrumb.types'

import styles from './Breadcrumb.module.css'

/**
 * Onde a pessoa está e como voltar, no lugar do rótulo decorativo que havia
 * antes. Só aparece em tela com hierarquia real — em tela de primeiro nível
 * não há caminho a mostrar.
 */
export const Breadcrumb = ({ trail }: BreadcrumbProps) => (
  <nav aria-label="Você está em" className={styles.trail}>
    {trail.map(({ label, to }, index) => (
      <span key={label} className={styles.step}>
        {index > 0 && (
          <span aria-hidden="true" className={styles.divider}>
            /
          </span>
        )}
        {to ? (
          <Link to={to} relative="path" className={styles.link}>
            {label}
          </Link>
        ) : (
          <span aria-current="page" className={styles.current}>
            {label}
          </span>
        )}
      </span>
    ))}
  </nav>
)
