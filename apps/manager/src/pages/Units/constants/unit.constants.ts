import type { BrandTheme } from '@pages/Units/types/BrandTheme.type'
import type { CashbackDraft } from '@shared/types/settings/cashback-draft'
import type { UnitDraft } from '@shared/types/store/unit-draft'

export const UNIT_TIMEZONES = [
  { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
  { value: 'America/Belem', label: 'Belém (GMT-3)' },
  { value: 'America/Fortaleza', label: 'Fortaleza (GMT-3)' },
  { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
  { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
  { value: 'America/Porto_Velho', label: 'Porto Velho (GMT-4)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
]

export const EMPTY_UNIT_DRAFT: UnitDraft = {
  customName: '',
  timezone: 'America/Sao_Paulo',
  primaryColor: '#FF6B00',
  secondaryColor: '#1F2937',
  tertiaryColor: '#FFF7ED',
  backgroundColor: '#FFFFFF',
  textColor: '#333333',
  cardColor: '#FAFAFA',
  borderColor: '#E5E5E5',
  mutedTextColor: '#666666',
  loadingType: 'MASCOT',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  deliveryCities: [],
}

export const BRAND_THEMES: BrandTheme[] = [
  {
    id: 'brasa',
    label: 'Brasa',
    colors: {
      primaryColor: '#FF6B00',
      secondaryColor: '#2D1B0E',
      tertiaryColor: '#FFF3E8',
      backgroundColor: '#FFFFFF',
      textColor: '#241A12',
      cardColor: '#FFF9F4',
      borderColor: '#E7D8C7',
      mutedTextColor: '#7A6A5B',
    },
  },
  {
    id: 'meia-noite',
    label: 'Meia-noite',
    colors: {
      primaryColor: '#FFB020',
      secondaryColor: '#F5F3EF',
      tertiaryColor: '#1C1C22',
      backgroundColor: '#121218',
      textColor: '#F5F3EF',
      cardColor: '#1C1C22',
      borderColor: '#2E2E38',
      mutedTextColor: '#9A98A6',
    },
  },
  {
    id: 'horta',
    label: 'Horta',
    colors: {
      primaryColor: '#2F8F4E',
      secondaryColor: '#123421',
      tertiaryColor: '#EAF6EC',
      backgroundColor: '#FFFFFF',
      textColor: '#16281C',
      cardColor: '#F6FBF6',
      borderColor: '#D5E7D9',
      mutedTextColor: '#5E7566',
    },
  },
  {
    id: 'mare',
    label: 'Maré',
    colors: {
      primaryColor: '#1E6FD9',
      secondaryColor: '#0B2545',
      tertiaryColor: '#EAF2FC',
      backgroundColor: '#FFFFFF',
      textColor: '#10233B',
      cardColor: '#F6F9FE',
      borderColor: '#D6E3F4',
      mutedTextColor: '#5A7188',
    },
  },
  {
    id: 'confeito',
    label: 'Confeito',
    colors: {
      primaryColor: '#E0568A',
      secondaryColor: '#3A1526',
      tertiaryColor: '#FDEEF4',
      backgroundColor: '#FFFDFE',
      textColor: '#3A1526',
      cardColor: '#FEF6F9',
      borderColor: '#F1D9E3',
      mutedTextColor: '#8A6C78',
    },
  },
]

export const EMPTY_CASHBACK_DRAFT: CashbackDraft = {
  cashbackEnabled: false,
  cashbackPercent: '0',
  cashbackMinRedeem: '0,00',
}

export const UNIT_DETAIL_TABS = [
  { value: 'info', label: 'Informações', segment: '' },
  { value: 'hours', label: 'Horários', segment: 'horarios' },
  { value: 'cashback', label: 'Cashback', segment: 'cashback' },
] as const

export const WEEK_SCHEDULE_DAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
]
