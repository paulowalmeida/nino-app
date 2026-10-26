import { useSearchParams } from 'react-router'

import {
  PROMOTION_ORDER_TARGETS,
  PROMOTION_PAGE_SIZE,
  PROMOTION_TABS,
} from '@pages/Promotions/constants/promotions.constants'
import { useDebouncedValue } from '@shared/hooks/ui/useDebouncedValue/useDebouncedValue'
import type { PromotionListQuery } from '@shared/types/marketing/promotion-list-query.type'

const isTab = (value: string | null): value is PromotionListQuery['tab'] =>
  PROMOTION_TABS.some((tab) => tab === value)

const isTarget = (
  value: string | null
): value is PromotionListQuery['target'] =>
  PROMOTION_ORDER_TARGETS.some((target) => target === value)

/* WHY: aba, busca, ordem e página moram na URL para o link e o voltar do
 * navegador reabrirem a mesma lista; a API é quem filtra, ordena e pagina. */
export const usePromotionListQuery = () => {
  const [params, setParams] = useSearchParams()
  const requestedTab = params.get('aba')
  const requestedTarget = params.get('ordem')
  const term = params.get('busca') ?? ''
  const tab = isTab(requestedTab) ? requestedTab : 'active'
  const target = isTarget(requestedTarget) ? requestedTarget : 'createdAt'
  const direction = params.get('sentido') === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, Number(params.get('pagina')) || 1)
  const search = useDebouncedValue(term.trim())

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) next.delete(key)
      else next.set(key, value)
    }
    setParams(next, { replace: true })
  }

  return {
    query: {
      tab,
      search,
      target,
      direction,
      page,
      size: PROMOTION_PAGE_SIZE,
    } satisfies PromotionListQuery,
    term,
    changeTab: (value: PromotionListQuery['tab']) =>
      update({ aba: value === 'active' ? null : value, pagina: null }),
    changeTerm: (value: string) =>
      update({ busca: value || null, pagina: null }),
    changeSort: (value: PromotionListQuery['target']) =>
      update({
        ordem: value,
        sentido: target === value && direction === 'asc' ? 'desc' : 'asc',
        pagina: null,
      }),
    changePage: (value: number) =>
      update({ pagina: value > 1 ? String(value) : null }),
  }
}
