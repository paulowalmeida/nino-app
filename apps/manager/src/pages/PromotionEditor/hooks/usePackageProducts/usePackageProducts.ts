import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { ProductService } from '@shared/services/product/product.service'

export type PackageProductOrder = {
  sortBy: 'name' | 'category'
  direction: 'asc' | 'desc'
}

type PackageProductParams = PackageProductOrder & {
  page: number
  size: number
  search: string
}

export const usePackageProducts = (
  unitId: string | null,
  params: PackageProductParams
) =>
  useQuery({
    queryKey: queryKeys.products.packagePicker(unitId ?? '', params),
    queryFn: () =>
      ProductService.listProducts(unitId as string, {
        ...params,
        packageEligible: true,
      }),
    enabled: !!unitId,
    placeholderData: keepPreviousData,
  })
