import { useConsumersList } from '@pages/Consumers/hooks/useConsumersList/useConsumersList'
import { useConsumersStore } from '@pages/Consumers/states/consumers/consumers.store'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useConsumersFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const search = useConsumersStore((state) => state.search)
  const setSearch = useConsumersStore((state) => state.setSearch)
  const list = useConsumersList(tenantId, search)

  return {
    search,
    setSearch,
    rows: list.rows,
    total: list.total,
    isPending: list.isPending,
    isError: list.isError,
    hasNextPage: list.hasNextPage,
    loadMoreConsumers: list.loadMoreConsumers,
  }
}
