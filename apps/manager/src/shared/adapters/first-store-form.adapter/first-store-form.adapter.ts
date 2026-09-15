import { onlyDigits } from '@nino/lib/services/zip-code.service'
import { toStoreSlug } from '@shared/adapters/store-slug.adapter/store-slug.adapter'
import type { CreateStoreRequest } from '@shared/types/store/create-store-request'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

export const toCreateStoreRequest = (
  data: FirstStoreFormValues
): CreateStoreRequest => ({
  customName: data.customName,
  slug: toStoreSlug(data.slug),
  typeId: data.typeId,
  zipCode: onlyDigits(data.zipCode),
  street: data.street,
  number: data.number,
  complement: data.complement,
  neighborhood: data.neighborhood,
  city: data.city,
  state: data.state,
})
