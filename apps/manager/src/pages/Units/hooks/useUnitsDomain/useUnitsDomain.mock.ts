import { EMPTY_UNIT_DRAFT } from '@pages/Units/constants/unit.constants'
import type { TenantDetail } from '@shared/types/store/tenant-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

export const unitsDomainMock = {
  groups: [],
  detail: { data: undefined, isPending: false },
  save: { mutate: () => undefined, isPending: false },
  setMain: { mutate: () => undefined, isPending: false },
  remove: { mutate: () => undefined, isPending: false },
  limit: { limit: 3, planName: 'Pro', isFull: false, isPending: false },
}

export const unitDraftMock: UnitDraft = EMPTY_UNIT_DRAFT

export const savedUnitMock = {
  id: 'tenant-1',
  slug: 'loja-principal',
  customName: 'Loja principal',
  timezone: 'America/Sao_Paulo',
  loadingType: 'MASCOT',
  zipCode: '66000000',
  street: 'Av. Nazaré',
  number: '100',
  neighborhood: 'Nazaré',
  city: 'Belém',
  state: 'PA',
} as TenantDetail
