import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'
import { NewOrderMenuSkeleton } from '@pages/NewOrder/skeletons/NewOrderMenuSkeleton/NewOrderMenuSkeleton'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import { brl } from '@shared/utils/money/money'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './NewOrderMenu.module.css'

export const NewOrderMenu = () => {
  const { sections, isMenuPending, draft } = useNewOrderFacade()

  if (isMenuPending) return <NewOrderMenuSkeleton />

  return (
    <Box as="section" className={styles.menu} aria-label="Cardápio">
      {sections.length === 0 && (
        <EmptyState>
          O cardápio está vazio. Cadastre um item antes de abrir pedido.
        </EmptyState>
      )}

      {sections.map(({ id, name, items }, sectionIndex) => (
        <Box as="section" key={id}>
          <Heading
            level={2}
            className={`${motion.unroll} ${styles.sectionName}`}
            style={riseDelay(sectionIndex * 70)}
          >
            {name}
          </Heading>

          <Box as="ul" className={styles.items} direction="column">
            {items
              .filter(({ isActive }) => isActive)
              .map((item, index) => (
                <ListRow
                  key={item.id}
                  className={`${motion.deal} ${styles.item}`}
                  divider="bottom"
                  gap={3}
                  padding={2.5}
                  style={riseDelay(sectionIndex * 70 + index * 40 + 50)}
                >
                  <ItemThumb
                    name={item.name}
                    imageUrl={item.images?.[0]?.url}
                    fallbackUrl={item.fallbackUrl}
                  />
                  <Text as="span" className={styles.itemName}>
                    {item.name}
                  </Text>
                  <Text as="span" className={styles.itemPrice}>
                    {brl(item.price)}
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label={`Adicionar ${item.name}`}
                    className={motion.press}
                    onClick={() =>
                      draft.add({
                        productId: item.id,
                        name: item.name,
                        unitPrice: item.price,
                      })
                    }
                  >
                    Adicionar
                  </Button>
                </ListRow>
              ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
