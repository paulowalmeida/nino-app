import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'
import type { TrackingDraft } from '@pages/Units/types/TrackingDraft.type'

/**
 * O documento vira os campos do editor. Rótulo ausente no tema é campo vazio
 * na tela, que por sua vez mostra o texto padrão do nino como placeholder.
 */
export const toTrackingDraft = (config: ThemeConfig): TrackingDraft => {
  const labels = config.tracking?.stageLabels ?? {}

  return {
    stageLabels: {
      PENDING: labels.PENDING ?? '',
      PREPARING: labels.PREPARING ?? '',
      OUT_FOR_DELIVERY: labels.OUT_FOR_DELIVERY ?? '',
      READY_FOR_PICKUP: labels.READY_FOR_PICKUP ?? '',
      DELIVERED: labels.DELIVERED ?? '',
    },
    waitingMessage: config.tracking?.waitingMessage ?? '',
  }
}
