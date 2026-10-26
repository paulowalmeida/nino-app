import { useConsumersList } from '@pages/Consumers/hooks/useConsumersList/useConsumersList'
import { useConsumersStore } from '@pages/Consumers/states/consumers/consumers.store'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useConsumersFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const search = useConsumersStore((state) => state.search)
  const setSearch = useConsumersStore((state) => state.setSearch)
  const list = useConsumersList(unitId, search)

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
