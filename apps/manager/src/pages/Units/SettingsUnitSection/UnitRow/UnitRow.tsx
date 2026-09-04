import type { CSSProperties } from 'react'
import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'

import motion from '@styles/motion.module.css'
import styles from './UnitRow.module.css'

type UnitRowProps = {
  name: string
  companyName: string
  to: string
  isCurrent: boolean
  isMain: boolean
  delay: CSSProperties
  onRemove: () => void
}

export const UnitRow = ({
  name,
  companyName,
  to,
  isCurrent,
  isMain,
  delay,
  onRemove,
}: UnitRowProps) => (
  <ListRow gap={3} padding={2} wrap className={motion.deal} style={delay}>
    <Link to={to} className={mergeClasses(motion.lift, styles.unit)}>
      <Box direction="row" align="center" gap={2} wrap>
        <Text as="span" size="sm" weight="semibold">
          {name}
        </Text>

        {isCurrent && (
          <Badge variant="brand" size="sm">
            aqui
          </Badge>
        )}

        {isMain && <Badge size="sm">matriz</Badge>}
      </Box>

      <Text as="span" size="xs" color="faint">
        {companyName}
      </Text>
    </Link>

    {!isCurrent && (
      <Button
        variant="ghost"
        size="sm"
        className={mergeClasses(motion.press, styles.remove)}
        onClick={onRemove}
      >
        Excluir
      </Button>
    )}
  </ListRow>
)
