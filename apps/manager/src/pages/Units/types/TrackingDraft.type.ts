/** Os textos do acompanhamento enquanto o lojista os edita. */
export type TrackingDraft = {
  stageLabels: {
    PENDING: string
    PREPARING: string
    OUT_FOR_DELIVERY: string
    READY_FOR_PICKUP: string
    DELIVERED: string
  }
  waitingMessage: string
}
