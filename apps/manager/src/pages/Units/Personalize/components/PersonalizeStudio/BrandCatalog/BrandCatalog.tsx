import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Select } from '@nino/ds/components/Select'
import { Switch } from '@nino/ds/components/Switch'
import {
  CATALOG_DENSITY_OPTIONS,
  CATALOG_IMAGE_RATIO_OPTIONS,
  CATALOG_ITEM_STYLE_OPTIONS,
} from '@pages/Units/constants/catalog.constants'
import type { CatalogDraft } from '@pages/Units/types/CatalogDraft.type'

import { StudioSection } from '../StudioSection/StudioSection'

import styles from './BrandCatalog.module.css'

const SECTION_DESCRIPTION =
  'Como os produtos aparecem para o cliente: foto, densidade e descrição.'

export type BrandCatalogProps = {
  catalog: CatalogDraft
  onChange: (patch: Partial<CatalogDraft>) => void
}

export const BrandCatalog = ({ catalog, onChange }: BrandCatalogProps) => (
  <StudioSection title="Cardápio" description={SECTION_DESCRIPTION}>
    <Box className={styles.brandCatalogFields}>
      <FormField label="Estilo do item">
        <Select
          options={CATALOG_ITEM_STYLE_OPTIONS}
          value={catalog.itemStyle}
          onValueChange={(itemStyle) =>
            onChange({ itemStyle: itemStyle as CatalogDraft['itemStyle'] })
          }
        />
      </FormField>

      <FormField label="Proporção da foto">
        <Select
          options={CATALOG_IMAGE_RATIO_OPTIONS}
          value={catalog.imageRatio}
          onValueChange={(imageRatio) =>
            onChange({ imageRatio: imageRatio as CatalogDraft['imageRatio'] })
          }
        />
      </FormField>

      <FormField label="Densidade">
        <Select
          options={CATALOG_DENSITY_OPTIONS}
          value={catalog.density}
          onValueChange={(density) =>
            onChange({ density: density as CatalogDraft['density'] })
          }
        />
      </FormField>

      <FormField label="Mostrar descrição" orientation="horizontal">
        <Switch
          checked={catalog.showDescription}
          onCheckedChange={(showDescription) => onChange({ showDescription })}
        />
      </FormField>
    </Box>
  </StudioSection>
)
