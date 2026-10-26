import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './UnitsTable.module.css'

type UnitsTableUnit = {
  id: string
  name: string
  companyName: string
}

type UnitsTableProps = {
  units: UnitsTableUnit[]
  currentUnitId: string | null
  isCurrentMain: boolean
  detailTo: (unitId: string) => string
  onRemove: (unit: UnitsTableUnit) => void
}

export const UnitsTable = ({
  units,
  currentUnitId,
  isCurrentMain,
  detailTo,
  onRemove,
}: UnitsTableProps) => (
  <Box className={styles.shell}>
    <Table>
      <colgroup>
        <col className={styles.colName} />
        <col className={styles.colCompany} />
        <col className={styles.colActions} />
      </colgroup>
      <TableHeader>
        <TableRow className={styles.headRow}>
          <TableHead>Unidade</TableHead>
          <TableHead className={styles.hideOnSmall}>Empresa</TableHead>
          <TableHead>
            <Text as="span" className="sr-only">
              Ações
            </Text>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {units.map((unit, index) => {
          const isCurrent = unit.id === currentUnitId

          return (
            <TableRow
              key={unit.id}
              className={motion.deal}
              style={riseDelay(index * 40 + 60)}
            >
              <TableCell>
                <Box direction="row" align="center" gap={2} wrap>
                  <Link to={detailTo(unit.id)} className={styles.name}>
                    {unit.name}
                  </Link>
                  {isCurrent && (
                    <Badge variant="brand" size="sm">
                      aqui
                    </Badge>
                  )}
                  {isCurrent && isCurrentMain && (
                    <Badge size="sm">matriz</Badge>
                  )}
                </Box>
                <Text className={styles.smallOnly}>{unit.companyName}</Text>
              </TableCell>
              <TableCell className={styles.hideOnSmall}>
                <Text className={styles.company}>{unit.companyName}</Text>
              </TableCell>
              <TableCell className={styles.actions}>
                <Box direction="row" align="center" className={styles.buttons}>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    aria-label={`Ver detalhes de ${unit.name}`}
                  >
                    <Link to={detailTo(unit.id)} title="Ver detalhes">
                      <Icon name="eye" />
                    </Link>
                  </Button>
                  {!isCurrent && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={styles.removeButton}
                      aria-label={`Excluir ${unit.name}`}
                      title="Excluir"
                      onClick={() => onRemove(unit)}
                    >
                      <Icon name="trash" />
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  </Box>
)
