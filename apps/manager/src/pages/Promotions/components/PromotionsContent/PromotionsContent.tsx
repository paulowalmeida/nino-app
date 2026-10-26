import { Box } from '@nino/ds/components/Box'
import { Input } from '@nino/ds/components/Input'
import { Pagination } from '@nino/ds/components/Pagination'
import { Tabs } from '@nino/ds/components/Tabs'
import { CampaignTable } from '@pages/Promotions/components/PromotionsContent/CampaignTable/CampaignTable'
import {
  PROMOTION_TAB_EMPTY,
  PROMOTION_TAB_LABELS,
  PROMOTION_TABS,
} from '@pages/Promotions/constants/promotions.constants'
import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'
import type { PromotionListQuery } from '@shared/types/marketing/promotion-list-query.type'

import styles from './PromotionsContent.module.css'

export const PromotionsContent = () => {
  const {
    promotions,
    tabCounts,
    total,
    query,
    term,
    changeTab,
    changeTerm,
    changePage,
  } = usePromotionsFacade()

  return (
    <Box direction="column" className={styles.promotionsContent}>
      <Box direction="row" className={styles.promotionsToolbar}>
        <Input
          type="search"
          value={term}
          placeholder="Nome, código, autor ou data"
          aria-label="Buscar campanha por nome, código, autor ou data de criação"
          className={styles.promotionsSearch}
          onChange={(event) => changeTerm(event.target.value)}
        />
        <Tabs
          label="Situação das campanhas"
          className={styles.promotionsTabs}
          fullWidth={{ mobile: true, tablet: false }}
          value={query.tab}
          onValueChange={(value) =>
            changeTab(value as PromotionListQuery['tab'])
          }
          tabs={PROMOTION_TABS.map((tab) => ({
            value: tab,
            label: `${PROMOTION_TAB_LABELS[tab]} · ${tabCounts?.[tab] ?? 0}`,
            content: null,
          }))}
        />
      </Box>

      <CampaignTable
        promotions={promotions}
        emptyMessage={
          query.search
            ? `Nenhuma campanha com "${query.search}" nesta aba.`
            : PROMOTION_TAB_EMPTY[query.tab]
        }
      />

      {total > query.size && (
        <Pagination
          className={styles.promotionsPagination}
          count={total}
          pageSize={query.size}
          page={query.page}
          onPageChange={changePage}
        />
      )}
    </Box>
  )
}
