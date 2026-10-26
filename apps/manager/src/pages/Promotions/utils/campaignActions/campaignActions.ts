import type { CampaignAction } from '@pages/Promotions/types/CampaignAction.type'
import type { Promotion } from '@shared/types/marketing/promotion.type'

// WHY: editar só antes do primeiro uso (decisão de produto); encerrada só duplica.
// Frete grátis virou configuração da faixa de entrega: a campanha antiga não duplica.
export const campaignActions = ({
  type,
  state,
  usageCount,
}: Pick<Promotion, 'type' | 'state' | 'usageCount'>): CampaignAction[] => {
  if (type === 'FREE_DELIVERY') return state === 'ENDED' ? [] : ['end']
  if (state === 'ENDED') return ['duplicate']
  const toggle: CampaignAction[] =
    state === 'PAUSED' ? ['resume'] : state === 'EXHAUSTED' ? [] : ['pause']
  const edit: CampaignAction[] = usageCount === 0 ? ['edit'] : []
  return [...toggle, ...edit, 'duplicate', 'end']
}
