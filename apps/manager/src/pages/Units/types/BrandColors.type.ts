import type { UnitDraft } from '@shared/types/store/unit-draft'

export type BrandColors = Pick<
  UnitDraft,
  | 'primaryColor'
  | 'secondaryColor'
  | 'tertiaryColor'
  | 'backgroundColor'
  | 'textColor'
  | 'cardColor'
  | 'borderColor'
  | 'mutedTextColor'
>
