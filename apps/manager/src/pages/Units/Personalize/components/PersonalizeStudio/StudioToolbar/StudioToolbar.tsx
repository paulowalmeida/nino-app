import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import type { PreviewDevice } from '@pages/Units/types/PreviewDevice.type'

import motion from '@styles/motion.module.css'
import { StudioDeviceTabs } from './StudioDeviceTabs'
import styles from './StudioToolbar.module.css'

export type StudioToolbarProps = {
  device: PreviewDevice
  onDeviceChange: (device: PreviewDevice) => void
  publishedVersion: number | null
  isDirty: boolean
  hasUnpublishedDraft: boolean
  isSaving: boolean
  isPublishing: boolean
  onSave: () => void
  onPublish: () => void
  onDiscard: () => void
}

const statusFor = (
  isDirty: boolean,
  hasUnpublishedDraft: boolean,
  publishedVersion: number | null
): string => {
  if (isDirty) return 'Alterações ainda não salvas'
  if (hasUnpublishedDraft) return 'Rascunho salvo, ainda não publicado'
  if (publishedVersion !== null) return `No ar: versão ${publishedVersion}`

  return 'Nada publicado ainda'
}

export const StudioToolbar = ({
  device,
  onDeviceChange,
  publishedVersion,
  isDirty,
  hasUnpublishedDraft,
  isSaving,
  isPublishing,
  onSave,
  onPublish,
  onDiscard,
}: StudioToolbarProps) => (
  <Box className={styles.studioToolbar}>
    <Box
      direction="row"
      align="center"
      justify="end"
      gap={3}
      wrap
      className={styles.studioToolbarControls}
    >
      <StudioDeviceTabs device={device} onChange={onDeviceChange} />

      <Box direction="row" align="center" gap={2} wrap className={styles.studioToolbarRight}>
        <Text size="sm" weight="semibold" aria-live="polite">
          {statusFor(isDirty, hasUnpublishedDraft, publishedVersion)}
        </Text>

        {isDirty && (
          <Button
            variant="ghost"
            disabled={isSaving || isPublishing}
            className={motion.press}
            onClick={onDiscard}
          >
            Descartar
          </Button>
        )}

        <Button
          variant="secondary"
          loading={isSaving}
          disabled={!isDirty || isPublishing}
          className={motion.press}
          onClick={onSave}
        >
          Salvar rascunho
        </Button>

        <Button
          loading={isPublishing}
          disabled={isSaving || (!isDirty && !hasUnpublishedDraft)}
          className={motion.press}
          onClick={onPublish}
        >
          Publicar na loja
        </Button>
      </Box>
    </Box>
  </Box>
)
