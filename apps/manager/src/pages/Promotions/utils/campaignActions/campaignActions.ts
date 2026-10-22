import type { CampaignAction } from '@pages/Promotions/types/CampaignAction.type'
import type { Promotion } from '@shared/types/marketing/promotion.type'

// WHY: editar só antes do primeiro uso (decisão de produto); encerrada só duplica.
export const campaignActions = ({
  state,
  usageCount,
}: Pick<Promotion, 'state' | 'usageCount'>): CampaignAction[] => {
  if (state === 'ENDED') return ['duplicate']
  const toggle: CampaignAction[] =
    state === 'PAUSED' ? ['resume'] : state === 'EXHAUSTED' ? [] : ['pause']
  const edit: CampaignAction[] = usageCount === 0 ? ['edit'] : []
  return [...toggle, ...edit, 'duplicate', 'end']
}
