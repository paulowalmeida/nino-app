import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { highlightMatch } from '@pages/Storefront/utils/menu-search/menu-search'
import { minimumProductPrice } from '@pages/Storefront/utils/minimum-product-price/minimum-product-price'
import { primaryImage } from '@utils/menu-image'
import { brl } from '@utils/money'

import styles from './MenuSearchResult.module.css'

type MenuSearchResultProps = {
  item: MenuItem
  categoryName: string
  query: string
  /** Quantas unidades já estão na sacola — 0 não marca nada. */
  quantity?: number
  /** Loja fechada: mostra o item mas não deixa pedir. */
  disabled?: boolean
  onSelect: (item: MenuItem) => void
  onAdd: (item: MenuItem) => void
}

const Highlighted = ({ text, query }: { text: string; query: string }) => (
  <>
    {highlightMatch(text, query).map((segment, index) =>
      segment.isMatch ? (
        <mark key={index} className={styles.menuSearchResultMark}>
          {segment.text}
        </mark>
      ) : (
        segment.text
      )
    )}
  </>
)

/**
 * Uma linha de resultado: foto pequena, nome com o trecho que casou, uma
 * linha de descrição e o preço ao lado da categoria. O "+" é o mesmo atalho
 * do card da vitrine.
 */
export const MenuSearchResult = ({
  item,
  categoryName,
  query,
  quantity = 0,
  disabled = false,
  onSelect,
  onAdd,
}: MenuSearchResultProps) => {
  const image = primaryImage(item)

  return (
    <ListRow gap={2} padding={2} className={styles.menuSearchResult}>
      <Button
        variant="ghost"
        className={styles.menuSearchResultOpen}
        data-search-result=""
        aria-label={`Ver detalhes de ${item.name}`}
        onClick={() => onSelect(item)}
      >
        <Box className={styles.menuSearchResultMedia}>
          <Image
            src={image}
            alt=""
            className={styles.menuSearchResultPhoto}
            wrapperClassName={styles.menuSearchResultPhotoWrap}
          />
        </Box>
        <Box className={styles.menuSearchResultBody}>
          <Text as="span" className={styles.menuSearchResultName}>
            <Highlighted text={item.name} query={query} />
          </Text>
          {item.description && (
            <Text as="span" className={styles.menuSearchResultDescription}>
              <Highlighted text={item.description} query={query} />
            </Text>
          )}
          <Text as="span" className={styles.menuSearchResultMeta}>
            <Text as="span" className={styles.menuSearchResultPrice}>
              {item.pricingType === 'COMPOSED' ? 'A partir de ' : ''}
              {brl(minimumProductPrice(item))}
            </Text>
            <Text as="span" className={styles.menuSearchResultCategory}>
              {categoryName}
              {quantity > 0 ? ` · ${quantity} na sacola` : ''}
            </Text>
          </Text>
        </Box>
      </Button>
      <Button
        variant="primary"
        size="icon"
        className={styles.menuSearchResultAdd}
        aria-label={`Adicionar ${item.name}`}
        disabled={disabled}
        onClick={() => onAdd(item)}
      >
        <Icon name="plus" />
      </Button>
    </ListRow>
  )
}
