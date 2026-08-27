import type { StoreTypeOption } from '@shared/types/store/store-type-option'

export const toNewUnitTypeOptions = (types: StoreTypeOption[]) =>
  types.map(({ id, name, description }) => ({
    value: id,
    label: description ?? name,
  }))
