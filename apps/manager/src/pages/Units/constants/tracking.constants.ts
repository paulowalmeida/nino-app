import type { TrackingDraft } from '@pages/Units/types/TrackingDraft.type'

export const EMPTY_TRACKING_DRAFT: TrackingDraft = {
  stageLabels: {
    PENDING: '',
    PREPARING: '',
    OUT_FOR_DELIVERY: '',
    READY_FOR_PICKUP: '',
    DELIVERED: '',
  },
  waitingMessage: '',
}

export const TRACKING_STAGE_FIELDS = [
  { stage: 'PENDING', label: 'Pedido recebido', placeholder: 'Pedido na casa' },
  { stage: 'PREPARING', label: 'Em preparo', placeholder: 'Tá na chapa' },
  {
    stage: 'OUT_FOR_DELIVERY',
    label: 'Saiu para entrega',
    placeholder: 'Na rua, quentinho',
  },
  {
    stage: 'READY_FOR_PICKUP',
    label: 'Pronto para retirada',
    placeholder: 'Pode vir buscar',
  },
  { stage: 'DELIVERED', label: 'Entregue', placeholder: 'Bom apetite!' },
] as const
