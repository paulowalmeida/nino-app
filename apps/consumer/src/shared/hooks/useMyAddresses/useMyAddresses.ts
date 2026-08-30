import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Address } from '@custom_types/address/address'
import { addressService } from '@shared/services/address/address.service'

/**
 * O principal sobe para o topo: é o endereço que o checkout vai propor, e
 * quem abre a lista está procurando ele antes de qualquer outro.
 */
const primaryFirst = (addresses: Address[]): Address[] =>
  [...addresses].sort(
    (a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary))
  )

export const useMyAddresses = (enabled: boolean) =>
  useQuery<Address[]>({
    queryKey: queryKeys.myAddresses.all,
    queryFn: addressService.listMine,
    select: primaryFirst,
    enabled,
  })
