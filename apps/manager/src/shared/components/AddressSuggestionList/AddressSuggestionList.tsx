import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import type { AddressPrediction } from '@nino/lib/types/address/address-lookup'

import styles from './AddressSuggestionList.module.css'

const PLACEHOLDER_ROWS = ['first', 'second', 'third']

type AddressSuggestionListProps = {
  searchedText: string
  suggestions: AddressPrediction[]
  isLoading: boolean
  onSelect: (placeId: string) => void
}

export const AddressSuggestionList = ({
  searchedText,
  suggestions,
  isLoading,
  onSelect,
}: AddressSuggestionListProps) => {
  if (isLoading) {
    return (
      <Box direction="column" gap={1.5} aria-live="polite">
        <Text size="sm" color="subtle">
          Procurando {searchedText}…
        </Text>
        {PLACEHOLDER_ROWS.map((row) => (
          <Skeleton key={row} className={styles.optionPlaceholder} />
        ))}
      </Box>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Text color="subtle">
        Nenhum endereço encontrado. Confira o endereço e o número.
      </Text>
    )
  }

  return (
    <Box direction="column" gap={1.5}>
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.placeId}
          type="button"
          variant="ghost"
          onClick={() => onSelect(suggestion.placeId)}
          className={styles.option}
        >
          <Icon name="map-pin" size="sm" className={styles.pin} />
          <Box direction="column" gap={0.5} className={styles.text}>
            <Text as="span" size="sm" weight="semibold">
              {suggestion.mainText}
            </Text>
            <Text as="span" size="xs" color="subtle">
              {suggestion.secondaryText}
            </Text>
          </Box>
        </Button>
      ))}
    </Box>
  )
}
