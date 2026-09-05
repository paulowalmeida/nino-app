import { Box } from '@nino/ds/components/Box'
import { Label } from '@nino/ds/components/Label'
import { Text } from '@nino/ds/components/Text'
import { Textarea } from '@nino/ds/components/Textarea'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { PRODUCT_NOTES_LIMIT } from '@pages/Storefront/ProductDetail/constants/product-notes'

import styles from './ProductNotes.module.css'

export const ProductNotes = () => {
  const { notes, setNotes } = useProductDetailFacade()

  return (
    <Box className={styles.notes}>
      <Box direction="row" className={styles.head}>
        <Label htmlFor="product-notes" className={styles.label}>
          Algum comentário?
        </Label>
        <Text as="span" className={styles.counter}>
          {notes.length}/{PRODUCT_NOTES_LIMIT}
        </Text>
      </Box>
      <Textarea
        id="product-notes"
        rows={3}
        maxLength={PRODUCT_NOTES_LIMIT}
        placeholder="Ex: tirar a cebola, maionese à parte"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
    </Box>
  )
}
