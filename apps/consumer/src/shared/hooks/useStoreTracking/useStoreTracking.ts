import { useParams } from 'react-router'

import { STATUS_LABEL } from '@constants/order.constants'
import { useStore } from '@hooks/useStore/useStore'
import type { OrderStatus } from '@custom_types/order/order-status'
import { resolveSlug } from '@utils/resolve-slug'

/**
 * O acompanhamento na voz da loja.
 *
 * O tema publicado pode renomear cada etapa e trocar a mensagem de espera.
 * Etapa sem rótulo próprio continua com o texto padrão do nino — a loja
 * escolhe o que quer dizer, não é obrigada a reescrever tudo.
 */
export const useStoreTracking = () => {
  const { slug: pathSlug } = useParams()
  const { store } = useStore(resolveSlug(pathSlug) ?? undefined)
  const tracking = store?.theme?.config.tracking

  const stageLabel = (status: OrderStatus): string =>
    tracking?.stageLabels?.[status] ?? STATUS_LABEL[status]

  return { stageLabel, waitingMessage: tracking?.waitingMessage ?? null }
}
