import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Chip } from '@nino/ds/components/Chip'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { PreviewDevice } from '@pages/Units/types/PreviewDevice.type'

import motion from '@styles/motion.module.css'
import styles from './StudioToolbar.module.css'

const DEVICE_TABS = [
  { value: 'mobile', label: 'Celular', icon: 'smartphone' },
  { value: 'desktop', label: 'Computador', icon: 'monitor' },
] as const

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
  <Box
    direction="row"
    align="center"
    justify="between"
    gap={3}
    wrap
    className={styles.toolbar}
  >
    <Box
      direction="row"
      gap={1}
      role="tablist"
      aria-label="Formato da prévia"
      className={styles.devices}
    >
      {DEVICE_TABS.map(({ value, label, icon }) => (
        <Chip
          key={value}
          variant="tab"
          selected={device === value}
          leadingIcon={<Icon name={icon} size="sm" />}
          onClick={() => onDeviceChange(value)}
        >
          {label}
        </Chip>
      ))}
    </Box>

    <Box direction="row" align="center" gap={2} wrap className={styles.right}>
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
)
