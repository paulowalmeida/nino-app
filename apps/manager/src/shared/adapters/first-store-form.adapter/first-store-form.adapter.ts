import { onlyDigits } from '@nino/lib/services/zip-code.service'
import { toStoreSlug } from '@shared/adapters/store-slug.adapter/store-slug.adapter'
import type { CreateStoreRequest } from '@shared/types/store/create-store-request'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

export const toCreateStoreRequest = (
  data: FirstStoreFormValues
): CreateStoreRequest => ({
  ...data,
    slug: toStoreSlug(data.slug),
  zipCode: onlyDigits(data.zipCode),
})
