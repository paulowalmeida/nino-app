import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'
import { CATEGORIES_CAPABILITIES } from '@pages/CatalogCategories/constants/catalog-categories.constants'

import motion from '@styles/motion.module.css'
import styles from './CategoriesEmptyState.module.css'

export const CategoriesEmptyState = () => {
  return (
    <Box className={styles.categoriesEmptyState}>
      <EmptyState
        size="md"
        illustration={<NinoMascot />}
        title="Nenhuma categoria ainda"
        className={motion.unroll}
      >
        Crie a primeira no campo acima e depois cadastre os itens dentro dela.
      </EmptyState>

      <Box as="section" aria-label="O que dá para fazer nas categorias">
        <Text size="sm" weight="semibold" color="strong">
          O que dá para fazer aqui
        </Text>
        <Box as="ul" className={styles.capabilities}>
          {CATEGORIES_CAPABILITIES.map(({ icon, title, description }) => (
            <Box as="li" key={title} direction="row" gap={3} align="start">
              <Icon name={icon} size="md" />
              <Box direction="column" gap={0.5}>
                <Text size="sm" weight="semibold" color="strong">
                  {title}
                </Text>
                <Text size="sm" color="muted">
                  {description}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
