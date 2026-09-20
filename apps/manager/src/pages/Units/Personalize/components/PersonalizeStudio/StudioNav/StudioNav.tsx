import { Box } from '@nino/ds/components/Box'
import { Chip } from '@nino/ds/components/Chip'
import { Text } from '@nino/ds/components/Text'
import type { StudioGroup } from '@pages/Units/types/StudioGroup.type'

import styles from './StudioNav.module.css'

export type StudioNavProps = {
  groups: readonly StudioGroup[]
  selected: StudioGroup['id']
  onSelect: (group: StudioGroup['id']) => void
}

export const StudioNav = ({ groups, selected, onSelect }: StudioNavProps) => (
  <Box as="nav" className={styles.nav}>
    <Text size="xs" weight="bold" className={styles.title}>
      Estrutura
    </Text>

    <Box
      direction="row"
      gap={1}
      role="tablist"
      aria-orientation="vertical"
      aria-label="Partes da loja"
      className={styles.list}
    >
      {groups.map(({ id, label }) => (
        <Chip
          key={id}
          variant="tab"
          selected={selected === id}
          id={`studio-tab-${id}`}
          aria-controls={`studio-panel-${id}`}
          className={styles.item}
          onClick={() => onSelect(id)}
        >
          {label}
        </Chip>
      ))}
    </Box>
  </Box>
)
