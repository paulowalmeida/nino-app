import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Select } from '@nino/ds/components/Select'
import type { StudioGroup } from '@pages/Units/types/StudioGroup.type'

import styles from './StudioNav.module.css'

export type StudioNavProps = {
  groups: readonly StudioGroup[]
  selected: StudioGroup['id']
  onSelect: (group: StudioGroup['id']) => void
}

export const StudioNav = ({ groups, selected, onSelect }: StudioNavProps) => (
  <Box as="nav" className={styles.studioNav} aria-label="Estrutura da loja">
    <FormField label="Estrutura" labelVariant="compact">
      <Select
        options={groups.map(({ id, label }) => ({ value: id, label }))}
        value={selected}
        onValueChange={(value) => onSelect(value as StudioGroup['id'])}
        className={styles.select}
      />
    </FormField>
  </Box>
)
