import type { CampaignAction } from '@pages/Promotions/types/CampaignAction.type'
import type { Promotion } from '@shared/types/marketing/promotion.type'

// WHY: editar só antes do primeiro uso; campanhas inativas só podem ser duplicadas.
// Frete grátis virou configuração da faixa de entrega e não pode ser duplicado.
export const campaignActions = ({
  type,
  state,
  usageCount,
}: Pick<Promotion, 'type' | 'state' | 'usageCount'>): CampaignAction[] => {
  if (type === 'FREE_DELIVERY') return state === 'ENDED' ? [] : ['end']
  if (state === 'PAUSED' || state === 'ENDED' || state === 'EXHAUSTED') {
    return ['duplicate']
  }
  const toggle: CampaignAction[] = ['pause']
  const edit: CampaignAction[] = usageCount === 0 ? ['edit'] : []
  return [...toggle, ...edit, 'duplicate', 'end']
}
