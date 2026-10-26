import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { CAMPAIGN_TABLE_GHOST_ROWS } from '@pages/Promotions/constants/promotions.constants'

import styles from '@pages/Promotions/components/PromotionsContent/CampaignTable/CampaignTable.module.css'

export const CampaignTableSkeleton = () => (
  <Box className={styles.campaignTable} aria-busy="true" aria-label="Carregando campanhas">
    <Box className={styles.tableShell}>
      <Table>
        <colgroup>
          <col className={styles.colCampaign} />
          <col className={styles.colUsage} />
          <col className={styles.colPeriod} />
          <col className={styles.colActions} />
        </colgroup>
        <TableHeader>
          <TableRow className={styles.headRow}>
            <TableHead>Campanha</TableHead>
            <TableHead className={styles.colRight}>Usos</TableHead>
            <TableHead>Período</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {CAMPAIGN_TABLE_GHOST_ROWS.map((row) => (
            <TableRow key={row} className={styles.row}>
              <TableCell className={styles.campaignCol}>
                <Skeleton className={styles.ghostHeadline} />
                <Skeleton className={styles.ghostConditions} />
              </TableCell>
              <TableCell className={styles.usageCol}>
                <Skeleton className={styles.ghostUsage} />
              </TableCell>
              <TableCell className={styles.periodCol}>
                <Skeleton className={styles.ghostPeriod} />
              </TableCell>
              <TableCell className={styles.actionsCol} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </Box>
)
