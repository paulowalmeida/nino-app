import type { TenantDetail, UpdateTenantRequest } from '@custom_types/store'

export type UnitCardProps = {
  unit: TenantDetail | undefined
  isPending: boolean
  isSaving: boolean
  /** Matriz da empresa — o posto aparece no cabeçalho da ficha. */
  isMain: boolean
  isPromoting: boolean
  onSetMain: () => void
  onSave: (data: UpdateTenantRequest) => void
}

export type UnitDraft = {
  customName: string
  timezone: string
  primaryColor: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}
