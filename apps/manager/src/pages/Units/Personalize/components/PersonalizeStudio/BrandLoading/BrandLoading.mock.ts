import type { BrandColors } from '@pages/Units/types/BrandColors.type'
import type { UnitDraft } from '@shared/types/store/unit-draft'

export const brandLoadingMock: {
  value: UnitDraft['loadingType']
  colors: Pick<BrandColors, 'backgroundColor' | 'primaryColor'>
} = {
  value: 'MASCOT',
  colors: { backgroundColor: '#FFFFFF', primaryColor: '#FF6B00' },
}
