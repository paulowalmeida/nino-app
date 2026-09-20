import type { JSX } from 'react'
import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { toThemeColors } from '@pages/Units/adapters/toThemeColors/toThemeColors'
import { toTrackingDraft } from '@pages/Units/adapters/toTrackingDraft/toTrackingDraft'
import { toUnitDraft } from '@pages/Units/adapters/toUnitDraft/toUnitDraft'
import { STUDIO_GROUPS } from '@pages/Units/constants/studio.constants'
import { EMPTY_TRACKING_DRAFT } from '@pages/Units/constants/tracking.constants'
import { EMPTY_UNIT_DRAFT } from '@pages/Units/constants/unit.constants'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import type { PreviewDevice } from '@pages/Units/types/PreviewDevice.type'
import type { StudioGroup } from '@pages/Units/types/StudioGroup.type'
import type { TrackingDraft } from '@pages/Units/types/TrackingDraft.type'
import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import { BrandAssets } from './BrandAssets/BrandAssets'
import { BrandHistory } from './BrandHistory/BrandHistory'
import { BrandLoading } from './BrandLoading/BrandLoading'
import { BrandPalette } from './BrandPalette/BrandPalette'
import { BrandThemes } from './BrandThemes/BrandThemes'
import { BrandTracking } from './BrandTracking/BrandTracking'
import { StorefrontPreview } from './StorefrontPreview/StorefrontPreview'
import { StudioNav } from './StudioNav/StudioNav'
import { StudioToolbar } from './StudioToolbar/StudioToolbar'

import styles from './PersonalizeStudio.module.css'

export const PersonalizeStudio = () => {
  const { units, theme } = useUnitsFacade()
  const unit = units.detail.data
  const editor = theme.editor.data
  const { mutate: saveDraft, isPending: isSaving } = theme.saveDraft
  const { mutate: publish, isPending: isPublishing } = theme.publish

  const [device, setDevice] = useState<PreviewDevice>('mobile')
  const [group, setGroup] = useState<StudioGroup['id']>('themes')
  const [draft, setDraft] = useState<UnitDraft>(EMPTY_UNIT_DRAFT)
  const [tracking, setTracking] = useState<TrackingDraft>(EMPTY_TRACKING_DRAFT)
  const [seed, setSeed] = useState<UnitDetail | undefined>(undefined)
  const [isDirty, setDirty] = useState(false)

  const storedConfig = editor?.draft?.config ?? editor?.published?.config

  const seedDraft = (detail: UnitDetail) =>
    storedConfig
      ? { ...toUnitDraft(detail), ...toThemeColors(storedConfig) }
      : toUnitDraft(detail)

  const seedTracking = () =>
    storedConfig ? toTrackingDraft(storedConfig) : EMPTY_TRACKING_DRAFT

  if (unit && unit !== seed) {
    setSeed(unit)
    setDraft(seedDraft(unit))
    setTracking(seedTracking())
    setDirty(false)
  }

  const change = (patch: Partial<UnitDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const changeTracking = (patch: Partial<TrackingDraft>) => {
    setTracking((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const discard = () => {
    setDraft(seed ? seedDraft(seed) : EMPTY_UNIT_DRAFT)
    setTracking(seedTracking())
    setDirty(false)
  }

  const panels: Record<StudioGroup['id'], JSX.Element> = {
    themes: <BrandThemes colors={draft} onApply={change} />,
    colors: <BrandPalette colors={draft} onChange={change} />,
    assets: (
      <BrandAssets
        hasLogo={!!(unit?.logoUrl || draft.logoFile)}
        hasBanner={!!(unit?.bannerUrl || draft.bannerFile)}
        onChange={change}
      />
    ),
    loading: (
      <BrandLoading
        value={draft.loadingType}
        colors={draft}
        onValueChange={(loadingType) => change({ loadingType })}
      />
    ),
    tracking: <BrandTracking tracking={tracking} onChange={changeTracking} />,
    versions: <BrandHistory />,
  }

  return (
    <Box className={`${styles.studio} ${styles[device]}`}>
      <StudioToolbar
        device={device}
        onDeviceChange={setDevice}
        publishedVersion={editor?.published?.version ?? null}
        isDirty={isDirty}
        hasUnpublishedDraft={!!editor?.draft}
        isSaving={isSaving}
        isPublishing={isPublishing}
        onSave={() => saveDraft({ draft, unit, tracking })}
        onPublish={() => publish({ draft, unit, tracking })}
        onDiscard={discard}
      />

      <Box className={styles.nav}>
        <StudioNav groups={STUDIO_GROUPS} selected={group} onSelect={setGroup} />
      </Box>

      <Box className={styles.dock}>
        <StorefrontPreview
          storeName={draft.customName || unit?.customName || ''}
          colors={draft}
          device={device}
          logoUrl={unit?.logoUrl}
          bannerUrl={unit?.bannerUrl}
          logoFile={draft.logoFile}
          bannerFile={draft.bannerFile}
        />
      </Box>

      <Box
        role="tabpanel"
        id={`studio-panel-${group}`}
        aria-labelledby={`studio-tab-${group}`}
        className={styles.panel}
      >
        {panels[group]}
      </Box>
    </Box>
  )
}
