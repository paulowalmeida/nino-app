import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import { PROMOTION_STATE_BADGES } from '@pages/Promotions/constants/promotions.constants'
import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'
import type { CampaignAction } from '@pages/Promotions/types/CampaignAction.type'
import { campaignActions } from '@pages/Promotions/utils/campaignActions/campaignActions'
import { campaignCreatedAt } from '@pages/Promotions/utils/campaignCreatedAt/campaignCreatedAt'
import type { Promotion } from '@shared/types/marketing/promotion.type'
import type { PromotionListQuery } from '@shared/types/marketing/promotion-list-query.type'
import { promotionSummaryParts } from '@shared/utils/promotion-summary/promotion-summary'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './CampaignTable.module.css'

type CampaignTableProps = {
  promotions: Promotion[]
  emptyMessage: string
}

const usageLabel = ({ usageCount, totalLimit }: Promotion): string =>
  totalLimit ? `${usageCount} de ${totalLimit}` : String(usageCount)

const conditionsLabel = (promotion: Promotion): string => {
  const { headline, schedule, zones } = promotionSummaryParts(promotion)
  return [
    // CONSTRAINT: nomes antigos são a própria headline, às vezes com espaço comum no lugar do NBSP do brl.
    promotion.name.replace(/\s/g, ' ') !== headline.replace(/\s/g, ' ') &&
      headline,
    schedule,
    zones,
    promotion.code && `código ${promotion.code}`,
    !promotion.showInMenu && 'fora do cardápio',
  ]
    .filter(Boolean)
    .join(' · ')
}

export const CampaignTable = ({
  promotions,
  emptyMessage,
}: CampaignTableProps) => {
  const navigate = useNavigate()
  const { pause, resume, end, isEnding, changingId, query, changeSort } =
    usePromotionsFacade()
  const [endingCampaign, setEndingCampaign] = useState<Promotion | null>(null)
  const sortableHead = (
    target: PromotionListQuery['target'],
    label: string,
    className?: string
  ) => {
    const direction = query.target === target ? query.direction : null
    return (
      <TableHead
        className={className}
        aria-sort={
          direction === 'asc'
            ? 'ascending'
            : direction === 'desc'
              ? 'descending'
              : 'none'
        }
      >
        <button
          type="button"
          className={styles.sortButton}
          onClick={() => changeSort(target)}
        >
          {label}
          {direction && (
            <Icon
              name={direction === 'asc' ? 'arrow-up' : 'arrow-down'}
              size="sm"
            />
          )}
        </button>
      </TableHead>
    )
  }

  const menuItemOf = (
    promotion: Promotion,
    action: CampaignAction
  ): MenuItem => {
    switch (action) {
      case 'pause':
        return { value: action, label: 'Pausar', onSelect: () => pause(promotion.id) }
      case 'resume':
        return { value: action, label: 'Retomar', onSelect: () => resume(promotion.id) }
      case 'edit':
        return {
          value: action,
          label: 'Editar',
          onSelect: () => void navigate(promotion.id),
        }
      case 'duplicate':
        return {
          value: action,
          label: 'Duplicar',
          onSelect: () => void navigate(`nova?duplicar=${promotion.id}`),
        }
      case 'end':
        return {
          value: action,
          label: 'Finalizar',
          destructive: true,
          onSelect: () => setEndingCampaign(promotion),
        }
    }
  }

  const confirmEnd = () => {
    if (!endingCampaign) return
    end(endingCampaign.id, { onSettled: () => setEndingCampaign(null) })
  }

  if (!promotions.length) {
    return <EmptyState className={styles.campaignEmpty}>{emptyMessage}</EmptyState>
  }

  return (
    <Box as="section" className={styles.campaignTable}>
      <h2 className="sr-only">Campanhas</h2>
      <Box className={styles.tableShell}>
        <Table>
          <colgroup>
            <col className={styles.colCampaign} />
            <col className={styles.colUsage} />
            <col className={styles.colCreatedAt} />
            <col className={styles.colCreatedBy} />
            <col className={styles.colPeriod} />
            <col className={styles.colActions} />
          </colgroup>
          <TableHeader>
            <TableRow className={styles.headRow}>
              <TableHead>Campanha</TableHead>
              {sortableHead('usageCount', 'Usos', styles.colRight)}
              {sortableHead('createdAt', 'Criada em')}
              {sortableHead('createdBy', 'Criada por')}
              <TableHead>Período</TableHead>
              <TableHead>
                <Text as="span" className="sr-only">
                  Ações
                </Text>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {promotions.map((promotion, index) => {
              const { headline, period } = promotionSummaryParts(promotion)
              const badge = PROMOTION_STATE_BADGES[promotion.state]
              const conditions = conditionsLabel(promotion)

              return (
                <TableRow
                  key={promotion.id}
                  className={`${motion.deal} ${styles.row}`}
                  style={riseDelay(index * 50 + 60)}
                >
                  <TableCell className={styles.campaignCol}>
                    <Box direction="row" className={styles.headlineLine}>
                      <Text className={styles.headline}>{promotion.name}</Text>
                      {promotion.giftProduct &&
                        !promotion.giftProduct.isAvailable && (
                          <Badge variant="warning" className={styles.stateBadge}>
                            Produto indisponível
                          </Badge>
                        )}
                      {badge && (
                        <Badge variant={badge.variant} className={styles.stateBadge}>
                          {badge.label}
                        </Badge>
                      )}
                    </Box>
                    {conditions && (
                      <Text className={styles.conditions}>{conditions}</Text>
                    )}
                  </TableCell>

                  <TableCell className={`${styles.colRight} ${styles.usageCol}`}>
                    <Text as="span" className={styles.usage}>
                      {usageLabel(promotion)}
                    </Text>
                  </TableCell>

                  <TableCell className={styles.createdAtCol}>
                    <Text as="span" className={styles.created}>
                      {campaignCreatedAt(promotion)}
                    </Text>
                  </TableCell>

                  <TableCell className={styles.createdByCol}>
                    <Text as="span" className={styles.created}>
                      {promotion.createdBy?.name ?? '—'}
                    </Text>
                  </TableCell>

                  <TableCell className={styles.periodCol}>
                    <Text as="span" className={styles.period}>
                      {period ?? 'Sem data de fim'}
                    </Text>
                  </TableCell>

                  <TableCell className={`${styles.colRight} ${styles.actionsCol}`}>
                    <Menu
                      contentClassName={styles.menuPanel}
                      placement="bottom-end"
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={changingId === promotion.id}
                          className={`${motion.press} ${styles.kebab}`}
                          aria-label={`Ações de ${headline}`}
                        >
                          <Icon name="more-horizontal" />
                        </Button>
                      }
                      items={campaignActions(promotion).map((action) =>
                        menuItemOf(promotion, action)
                      )}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>

      <Dialog
        open={!!endingCampaign}
        onOpenChange={(open) => !open && setEndingCampaign(null)}
        title="Finalizar campanha?"
        description="Ela para de valer agora e não pode ser retomada. Para repetir a campanha, use Duplicar."
        confirmLabel="Finalizar"
        loading={isEnding}
        onConfirm={confirmEnd}
        onCancel={() => setEndingCampaign(null)}
      />
    </Box>
  )
}
