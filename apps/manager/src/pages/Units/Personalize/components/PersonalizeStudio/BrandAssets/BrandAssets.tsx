import { Box } from '@nino/ds/components/Box'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import { StudioSection } from '../StudioSection/StudioSection'
import { BrandAssetSlot } from './BrandAssetSlot/BrandAssetSlot'
import { ResponsiveBannerAsset } from './ResponsiveBannerAsset'

import styles from './BrandAssets.module.css'

export type BrandAssetsProps = {
  hasLogo: boolean
  hasBanner: boolean
  bannerCrops?: UnitDraft['bannerCrops']
  bannerVariants?: UnitDraft['bannerVariants']
  onChange: (
    files: Pick<
      UnitDraft,
      | 'logoFile'
      | 'bannerFile'
      | 'bannerVariantFiles'
      | 'logoUrl'
      | 'bannerUrl'
      | 'bannerCrops'
      | 'bannerVariants'
    >
  ) => void
}

export const BrandAssets = ({
  hasLogo,
  hasBanner,
  bannerCrops,
  bannerVariants,
  onChange,
}: BrandAssetsProps) => (
  <StudioSection
    title="Logo e banner"
    description="A logo abre o cardápio. O banner é a faixa atrás dela."
  >
    <Box className={styles.slots}>
      <BrandAssetSlot
        label="Logo"
        helperText="Quadrada · PNG, JPG, WebP ou AVIF até 4 MB"
        triggerLabel={hasLogo ? 'Trocar logo' : 'Escolher logo'}
        framingTitle="Enquadrar a logo"
        framingHint="Escolha o quadrado onde a marca aparece inteira."
        confirmLabel="Usar esta logo"
        aspectRatio={1}
        onCropped={(logoFile) => onChange({ logoFile })}
        hasAsset={hasLogo}
        onRemove={() => onChange({ logoFile: undefined, logoUrl: null })}
      />

      <ResponsiveBannerAsset
        hasAsset={hasBanner}
        crops={bannerCrops}
        variants={bannerVariants}
        onChange={onChange}
        onRemove={() =>
          onChange({
            bannerFile: undefined,
            bannerUrl: null,
            bannerCrops: undefined,
            bannerVariants: undefined,
            bannerVariantFiles: undefined,
          })
        }
      />
    </Box>
  </StudioSection>
)
