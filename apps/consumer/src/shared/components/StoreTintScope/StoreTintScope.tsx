import type { CSSProperties, ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { useStoreTint } from '@shared/hooks/useStoreTint/useStoreTint'

import styles from './StoreTintScope.module.css'

type StoreTintScopeProps = { children: ReactNode }

/**
 * Redeclara `--store-tint` dentro de um portal (gaveta, modal), que sai da
 * árvore da página e perde a cor da loja. Não cria caixa: só carrega a
 * variável para o conteúdo.
 */
export const StoreTintScope = ({ children }: StoreTintScopeProps) => {
  const tint = useStoreTint()

  return (
    <Box
      className={styles.storeTintScope}
      style={tint ? ({ '--store-tint': tint } as CSSProperties) : undefined}
    >
      {children}
    </Box>
  )
}
