import type { Order } from '@shared/types/order/order'

type SearchableTableTab = Pick<
  Order,
  'guestName' | 'tableNumber' | 'orderNumber'
>

const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase('pt-BR')

export const filterTableTabs = <T extends SearchableTableTab>(
  orders: T[],
  term: string
): T[] => {
  const search = normalize(term)

  if (!search) return orders

  return orders.filter(({ guestName, tableNumber, orderNumber }) =>
    [guestName, tableNumber, String(orderNumber)].some((value) =>
      value ? normalize(value).includes(search) : false
    )
  )
}
