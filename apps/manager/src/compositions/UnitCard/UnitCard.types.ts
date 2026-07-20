import type { TenantDetail, UpdateTenantRequest } from '@custom_types/store'

export type UnitCardProps = {
  unit: TenantDetail | undefined
  isPending: boolean
  isSaving: boolean
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
