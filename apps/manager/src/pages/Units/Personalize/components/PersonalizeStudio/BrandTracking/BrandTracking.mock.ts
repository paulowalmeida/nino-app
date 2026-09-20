import type { TrackingDraft } from '@pages/Units/types/TrackingDraft.type'

export const trackingDraftMock: TrackingDraft = {
  stageLabels: {
    PENDING: 'Pedido na casa',
    PREPARING: '',
    OUT_FOR_DELIVERY: '',
    READY_FOR_PICKUP: '',
    DELIVERED: '',
  },
  waitingMessage: '',
}
