import { useState } from 'react'
import { useSearchParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Input } from '@nino/ds/components/Input'
import { Tabs } from '@nino/ds/components/Tabs'
import { toPromotionTabs } from '@pages/Promotions/adapters/promotionTabs.adapter/promotionTabs.adapter'
import { CampaignTable } from '@pages/Promotions/components/PromotionsContent/CampaignTable/CampaignTable'
import {
  PROMOTION_TAB_EMPTY,
  PROMOTION_TAB_LABELS,
  PROMOTION_TABS,
} from '@pages/Promotions/constants/promotions.constants'
import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'
import type { PromotionTab } from '@pages/Promotions/types/PromotionTab.type'

import styles from './PromotionsContent.module.css'

const isPromotionTab = (value: string | null): value is PromotionTab =>
  PROMOTION_TABS.some((tab) => tab === value)

export const PromotionsContent = () => {
  const { promotions } = usePromotionsFacade()
  const [searchParams, setSearchParams] = useSearchParams()
  const [term, setTerm] = useState('')
  const requestedTab = searchParams.get('aba')
  const activeTab: PromotionTab = isPromotionTab(requestedTab)
    ? requestedTab
    : 'active'
  const tabs = toPromotionTabs(promotions, term)

  const changeTab = (value: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'active') nextParams.delete('aba')
    else nextParams.set('aba', value)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <Box direction="column" className={styles.promotionsContent}>
      <Box direction="row" className={styles.promotionsToolbar}>
        <Input
          type="search"
          value={term}
          placeholder="Condição ou código"
          aria-label="Buscar campanha por condição ou código"
          className={styles.promotionsSearch}
          onChange={(event) => setTerm(event.target.value)}
        />
        <Tabs
          label="Situação das campanhas"
          className={styles.promotionsTabs}
          fullWidth={{ mobile: true, tablet: false }}
          value={activeTab}
          onValueChange={changeTab}
          tabs={PROMOTION_TABS.map((tab) => ({
            value: tab,
            label: `${PROMOTION_TAB_LABELS[tab]} · ${tabs[tab].length}`,
            content: null,
          }))}
        />
      </Box>

      <CampaignTable
        promotions={tabs[activeTab]}
        emptyMessage={
          term.trim()
            ? `Nenhuma campanha com "${term.trim()}" nesta aba.`
            : PROMOTION_TAB_EMPTY[activeTab]
        }
      />
    </Box>
  )
}
