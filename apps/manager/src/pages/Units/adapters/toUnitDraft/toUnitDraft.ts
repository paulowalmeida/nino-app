import type { TenantDetail } from '@shared/types/store/tenant-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

export const toUnitDraft = (unit: TenantDetail): UnitDraft => ({
  customName: unit.customName ?? '',
  timezone: unit.timezone,
  primaryColor: unit.primaryColor ?? '#FF6B00',
  secondaryColor: unit.secondaryColor ?? '#1F2937',
  tertiaryColor: unit.tertiaryColor ?? '#FFF7ED',
  backgroundColor: unit.backgroundColor ?? '#FFFFFF',
  textColor: unit.textColor ?? '#333333',
  cardColor: unit.cardColor ?? '#FAFAFA',
  borderColor: unit.borderColor ?? '#E5E5E5',
  mutedTextColor: unit.mutedTextColor ?? '#666666',
  loadingType: unit.loadingType,
  zipCode: unit.zipCode,
  street: unit.street,
  number: unit.number,
  complement: unit.complement ?? '',
  neighborhood: unit.neighborhood,
  city: unit.city,
  state: unit.state,
  deliveryCities: [
    { city: unit.city, state: unit.state },
    ...(unit.deliveryCities ?? []).filter(
      (item) => item.city !== unit.city || item.state !== unit.state
    ),
  ],
})
