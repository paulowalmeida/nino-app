import { forwardRef } from 'react'

import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'

import styles from './MenuSearchField.module.css'

type MenuSearchFieldProps = {
  value: string
  onChange: (value: string) => void
}

/**
 * A busca da página desaparece à medida que a do topo assume — é a mesma
 * busca em dois lugares, nunca duas visíveis ao mesmo tempo.
 */
export const MenuSearchField = forwardRef<
  HTMLInputElement,
  MenuSearchFieldProps
>(({ value, onChange }, ref) => (
  <div className={styles.toolbar}>
    <div className={styles.field}>
      <Icon name="search" className={styles.icon} />
      <Input
        ref={ref}
        type="search"
        aria-label="Buscar no cardápio"
        placeholder="Buscar no cardápio"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  </div>
))

MenuSearchField.displayName = 'MenuSearchField'
