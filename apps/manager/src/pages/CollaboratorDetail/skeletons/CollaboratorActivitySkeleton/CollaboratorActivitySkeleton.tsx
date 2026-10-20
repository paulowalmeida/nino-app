import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import { COLLABORATOR_DETAIL_COLUMNS } from '@pages/CollaboratorDetail/constants/collaborator-detail.constants'

import ghost from './CollaboratorActivitySkeleton.module.css'
import activity from '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorActivity/CollaboratorActivity.module.css'

const GHOST_ENTRIES = ['first', 'second', 'third', 'fourth', 'fifth']

/* WHY: o título e a régua de colunas não viram osso — já funcionam sem a
 * atividade e sumiriam da tela se virassem barra cinza. */
export const CollaboratorActivitySkeleton = () => (
  <Box
    as="section"
    direction="column"
    grow
    shrink
    aria-label="Atividade recente"
    className={activity.activity}
  >
    <Box
      direction="row"
      align="baseline"
      justify="between"
      wrap
      className={activity.activityHead}
    >
      <Header
        level={2}
        size="sm"
        title="Atividade recente"
        actions={
          <Text as="p" size="xs" color="faint">
            Últimas 30 mudanças
          </Text>
        }
      />
    </Box>

    <Box className={activity.listShell}>
      <Table>
        <colgroup>
          <col className={activity.colTicket} />
          <col className={activity.colConsumer} />
          <col className={activity.colChannel} />
          <col className={activity.colStatus} />
          <col className={activity.colWhen} />
          <col className={activity.colAmount} />
        </colgroup>
        <TableHeader>
          <TableRow className={activity.headRow}>
            {COLLABORATOR_DETAIL_COLUMNS.map((label, index) => (
              <TableHead
                key={label}
                className={index > 1 ? activity.colRight : undefined}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {GHOST_ENTRIES.map((entry) => (
            <TableRow key={entry}>
              <TableCell>
                <Skeleton className={ghost.ticket} />
              </TableCell>
              <TableCell>
                <Skeleton className={ghost.consumer} />
              </TableCell>
              <TableCell className={activity.colRight}>
                <Skeleton className={ghost.channel} />
              </TableCell>
              <TableCell className={activity.colRight}>
                <Skeleton
                  className={ghost.collaboratorActivitySkeletonStatus}
                />
              </TableCell>
              <TableCell className={activity.colRight}>
                <Skeleton className={ghost.stamp} />
              </TableCell>
              <TableCell className={activity.colRight}>
                <Skeleton className={ghost.collaboratorActivitySkeletonTotal} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </Box>
)
