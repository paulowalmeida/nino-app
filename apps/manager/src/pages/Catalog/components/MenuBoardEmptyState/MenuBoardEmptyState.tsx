import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'
import { CATALOG_CAPABILITIES } from '@pages/Catalog/constants/catalog.constants'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

import motion from '@styles/motion.module.css'
import styles from './MenuBoardEmptyState.module.css'

export const MenuBoardEmptyState = () => {
  const { search } = useCatalogFacade()

  if (search) {
    return (
      <EmptyState size="md" className={motion.unroll}>
        {`Nenhum item com "${search}". Tente outro nome.`}
      </EmptyState>
    )
  }

  return (
    <Box className={styles.menuBoardEmptyState}>
      <EmptyState
        size="md"
        illustration={<NinoMascot />}
        title="Seu cardápio ainda está vazio"
        className={motion.unroll}
        action={
          <Button asChild>
            <Link to="novo">Cadastrar primeiro item</Link>
          </Button>
        }
      >
        Cadastre o primeiro item para ele aparecer no balcão e no app do
        cliente.
      </EmptyState>

      <Box as="section" aria-label="O que dá para fazer no cardápio">
        <Text size="sm" weight="semibold" color="strong">
          O que dá para fazer aqui
        </Text>
        <Box as="ul" className={styles.capabilities}>
          {CATALOG_CAPABILITIES.map(({ icon, title, description }) => (
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
