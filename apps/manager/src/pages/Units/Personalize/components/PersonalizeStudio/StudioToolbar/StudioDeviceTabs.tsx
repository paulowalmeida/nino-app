import { Box } from '@nino/ds/components/Box'
import { Chip } from '@nino/ds/components/Chip'
import { Icon } from '@nino/ds/components/Icon'
import type { PreviewDevice } from '@pages/Units/types/PreviewDevice.type'

import styles from './StudioToolbar.module.css'

const DEVICE_TABS = [
  { value: 'mobile', label: 'Celular', icon: 'smartphone' },
  { value: 'desktop', label: 'Computador', icon: 'monitor' },
] as const

export type StudioDeviceTabsProps = {
  device: PreviewDevice
  onChange: (device: PreviewDevice) => void
}

export const StudioDeviceTabs = ({
  device,
  onChange,
}: StudioDeviceTabsProps) => (
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
        onClick={() => onChange(value)}
      >
        {label}
      </Chip>
    ))}
  </Box>
)
