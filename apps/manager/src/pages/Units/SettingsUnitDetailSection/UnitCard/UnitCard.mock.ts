import type { UnitDetail } from '@shared/types/store/unit-detail'

export const unitCardMock = {
  unit: undefined,
  isPending: true,
  isSaving: false,
  isMain: false,
  isPromoting: false,
  onSetMain: () => undefined,
  onSave: () => undefined,
}

export const unitCardDetailMock = {
  id: 'unit-1',
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
} as UnitDetail
