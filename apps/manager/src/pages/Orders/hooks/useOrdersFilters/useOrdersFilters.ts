import { useSearchParams } from 'react-router'

import { ORDERS_STAGES } from '@pages/Orders/constants/orders.constants'
import { useDebouncedValue } from '@shared/hooks/ui/useDebouncedValue/useDebouncedValue'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { OrderStage } from '@shared/types/order/order-stage'
import { statusesForStage } from '@shared/utils/order-stage/order-stage'

export const useOrdersFilters = () => {
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('etapa') as OrderStage | null
  const stage: OrderStage =
    fromUrl && ORDERS_STAGES.some(({ id }) => id === fromUrl)
      ? fromUrl
      : 'incoming'
  const urlSearch = params.get('busca') ?? ''
  const term = urlSearch
  const search = useDebouncedValue(term.trim())
  const isSearching = search.length > 0

  const setStage = (nextStage: OrderStage) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (nextStage === 'incoming') next.delete('etapa')
        else next.set('etapa', nextStage)
        return next
      },
      { replace: true }
    )

  const setTerm = (nextTerm: string) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (nextTerm) next.set('busca', nextTerm)
        else next.delete('busca')
        return next
      },
      { replace: true }
    )

  return {
    isSearching,
    search,
    stage,
    statuses: isSearching
      ? undefined
      : stage === 'table'
        ? [
            ...statusesForStage('incoming'),
            ...statusesForStage('confirmed'),
            ...statusesForStage('kitchen'),
            ...statusesForStage('street'),
            ...statusesForStage('counter'),
          ]
        : statusesForStage(stage),
    channel: (isSearching
      ? undefined
      : stage === 'table'
        ? 'TABLE_TAB'
        : stage === 'closed'
          ? undefined
          : (['DELIVERY', 'PICKUP', 'COUNTER'] as OrderChannel[])) as
      | OrderChannel
      | OrderChannel[]
      | undefined,
    term,
    setStage,
    setTerm,
  }
}
