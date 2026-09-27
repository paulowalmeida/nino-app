import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Switch } from '@nino/ds/components/Switch'
import { HOME_BLOCK_FIELDS } from '@pages/Units/constants/home.constants'
import type { HomeDraft } from '@pages/Units/types/HomeDraft.type'

import { StudioSection } from '../StudioSection/StudioSection'

import styles from './BrandHome.module.css'

const SECTION_DESCRIPTION =
  'O que aparece na home além da identidade e do cardápio, que são fixos.'

export type BrandHomeProps = {
  home: HomeDraft
  onChange: (patch: Partial<HomeDraft>) => void
  onResetLayout?: () => void
}

export const BrandHome = ({
  home,
  onChange,
  onResetLayout,
}: BrandHomeProps) => (
  <StudioSection title="Blocos da home" description={SECTION_DESCRIPTION}>
    <Box className={styles.blocks}>
      {HOME_BLOCK_FIELDS.map(({ field, label, helperText }) => (
        <FormField
          key={field}
          label={label}
          helperText={helperText}
          orientation="horizontal"
        >
          <Switch
            checked={home[field]}
            onCheckedChange={(checked) => onChange({ [field]: checked })}
          />
        </FormField>
      ))}
      {onResetLayout && (
        <Button variant="outline" size="sm" onClick={onResetLayout}>
          Restaurar layout padrão do Nino
        </Button>
      )}
    </Box>
  </StudioSection>
)
