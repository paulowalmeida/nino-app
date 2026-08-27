import { useCustomersList } from '@pages/Customers/hooks/useCustomersList/useCustomersList'
import { useCustomersStore } from '@pages/Customers/states/customers/customers.store'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useCustomersFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const search = useCustomersStore((state) => state.search)
  const setSearch = useCustomersStore((state) => state.setSearch)
  const list = useCustomersList(tenantId, search)

  return {
    search,
    setSearch,
    rows: list.rows,
    total: list.total,
    isPending: list.isPending,
    isError: list.isError,
    hasNextPage: list.hasNextPage,
    loadMoreCustomers: list.loadMoreCustomers,
  }
}
