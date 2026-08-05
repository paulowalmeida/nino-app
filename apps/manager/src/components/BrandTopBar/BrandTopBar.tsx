import { NinoLogo } from '@elements/NinoLogo/NinoLogo'

import styles from './BrandTopBar.module.css'

type BrandTopBarProps = {
  actionLabel: string
  onAction: () => void
}

/**
 * Barra das telas anteriores ao painel. A marca aqui é identidade, não
 * navegação — não há para onde voltar antes da primeira loja existir —, então
 * o logo não vira link e fica no mesmo tamanho da casca do app.
 */
export const BrandTopBar = ({ actionLabel, onAction }: BrandTopBarProps) => (
  <header className={styles.bar}>
    <NinoLogo size="sm" />

    <button type="button" className={styles.action} onClick={onAction}>
      {actionLabel}
    </button>
  </header>
)
