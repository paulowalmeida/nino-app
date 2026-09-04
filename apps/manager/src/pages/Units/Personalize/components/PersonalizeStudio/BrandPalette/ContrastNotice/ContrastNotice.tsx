import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import type { BrandColors } from '@pages/Units/types/BrandColors.type'
import { toLowContrastPairs } from '@pages/Units/utils/toLowContrastPairs/toLowContrastPairs'

import styles from './ContrastNotice.module.css'

export type ContrastNoticeProps = {
  colors: BrandColors
}

export const ContrastNotice = ({ colors }: ContrastNoticeProps) => {
  const pairs = toLowContrastPairs(colors)

  if (!pairs.length) return null

  return (
    <Alert variant="warning" title="Difícil de ler no celular do cliente">
      <Box as="ul" gap={1} className={styles.pairs}>
        {pairs.map(({ label, advice, ratio, minimum }) => (
          <Box as="li" key={label} className={styles.pair}>
            <Text as="span" weight="semibold">
              {label}
            </Text>
            <Text as="span" className={styles.ratio}>
              {` ${ratio.toFixed(1)}:1 · mínimo ${minimum}:1. `}
            </Text>
            <Text as="span">{advice}</Text>
          </Box>
        ))}
      </Box>
    </Alert>
  )
}
