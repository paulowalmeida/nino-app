import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { toUnitDraft } from '@pages/Units/adapters/toUnitDraft/toUnitDraft'
import { EMPTY_UNIT_DRAFT } from '@pages/Units/constants/unit.constants'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import type { PreviewDevice } from '@pages/Units/types/PreviewDevice.type'
import type { TenantDetail } from '@shared/types/store/tenant-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import { BrandAssets } from './BrandAssets/BrandAssets'
import { BrandLoading } from './BrandLoading/BrandLoading'
import { BrandPalette } from './BrandPalette/BrandPalette'
import { BrandThemes } from './BrandThemes/BrandThemes'
import { StorefrontPreview } from './StorefrontPreview/StorefrontPreview'

import motion from '@styles/motion.module.css'
import styles from './PersonalizeStudio.module.css'

export const PersonalizeStudio = () => {
  const { units } = useUnitsFacade()
  const unit = units.detail.data
  const { mutate: save, isPending: isSaving } = units.save

  const [device, setDevice] = useState<PreviewDevice>('mobile')
  const [draft, setDraft] = useState<UnitDraft>(EMPTY_UNIT_DRAFT)
  const [seed, setSeed] = useState<TenantDetail | undefined>(undefined)
  const [isDirty, setDirty] = useState(false)

  if (unit && unit !== seed) {
    setSeed(unit)
    setDraft(toUnitDraft(unit))
    setDirty(false)
  }

  const change = (patch: Partial<UnitDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const discard = () => {
    setDraft(seed ? toUnitDraft(seed) : EMPTY_UNIT_DRAFT)
    setDirty(false)
  }

  return (
    <Box className={`${styles.studio} ${styles[device]}`}>
      <Box className={styles.dock}>
        <StorefrontPreview
          storeName={draft.customName || unit?.customName || ''}
          colors={draft}
          device={device}
          onDeviceChange={setDevice}
          logoUrl={unit?.logoUrl}
          bannerUrl={unit?.bannerUrl}
          logoFile={draft.logoFile}
          bannerFile={draft.bannerFile}
        />
      </Box>

      <Box className={styles.controls}>
        <BrandThemes colors={draft} onApply={change} />
        <BrandPalette colors={draft} onChange={change} />
        <BrandAssets
          hasLogo={!!(unit?.logoUrl || draft.logoFile)}
          hasBanner={!!(unit?.bannerUrl || draft.bannerFile)}
          onChange={change}
        />
        <BrandLoading
          value={draft.loadingType}
          colors={draft}
          onValueChange={(loadingType) => change({ loadingType })}
        />
      </Box>

      {isDirty && (
        <Box
          direction="row"
          align="center"
          justify="between"
          gap={3}
          wrap
          className={`${styles.actions} ${motion.settle}`}
        >
          <Text size="sm" weight="semibold" aria-live="polite">
            Alterações ainda não publicadas
          </Text>
          <Box direction="row" gap={2} className={styles.buttons}>
            <Button
              variant="ghost"
              disabled={isSaving}
              className={motion.press}
              onClick={discard}
            >
              Descartar
            </Button>
            <Button
              loading={isSaving}
              className={motion.press}
              onClick={() => save(draft)}
            >
              Publicar na loja
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
