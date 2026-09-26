import { Box } from '@nino/ds/components/Box'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import { StudioSection } from '../StudioSection/StudioSection'
import { BrandAssetSlot } from './BrandAssetSlot/BrandAssetSlot'

import styles from './BrandAssets.module.css'

const STORE_BANNER_ASPECT_RATIO = 900 / 250

export type BrandAssetsProps = {
  hasLogo: boolean
  hasBanner: boolean
  onChange: (files: Pick<UnitDraft, 'logoFile' | 'bannerFile'>) => void
}

export const BrandAssets = ({
  hasLogo,
  hasBanner,
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
      />

      <BrandAssetSlot
        label="Banner"
        helperText="Horizontal · evite texto, ele some no celular"
        triggerLabel={hasBanner ? 'Trocar banner' : 'Escolher banner'}
        framingTitle="Enquadrar o banner"
        framingHint="Arraste para escolher a faixa que aparece no topo da loja."
        confirmLabel="Usar este banner"
        aspectRatio={STORE_BANNER_ASPECT_RATIO}
        onCropped={(bannerFile) => onChange({ bannerFile })}
      />
    </Box>
  </StudioSection>
)
