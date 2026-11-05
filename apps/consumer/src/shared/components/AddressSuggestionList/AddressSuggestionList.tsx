import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import type { AddressPrediction } from '@nino/lib/types/address/address-lookup'
import { ADDRESS_LOOKUP_SKELETON_ROWS } from '@constants/addressLookupSkeletonRows.constants'

import styles from './AddressSuggestionList.module.css'

type AddressSuggestionListProps = {
  searchedText: string
  suggestions: AddressPrediction[]
  isLoading: boolean
  isError?: boolean
  onRetry?: () => void
  onSelect: (placeId: string) => void
}

export const AddressSuggestionList = ({
  searchedText,
  suggestions,
  isLoading,
  isError = false,
  onRetry,
  onSelect,
}: AddressSuggestionListProps) => {
  if (isLoading) {
    return (
      <Box direction="column" gap={1.5} aria-live="polite">
        <Text size="sm" color="muted">
          Procurando {searchedText}…
        </Text>
        {ADDRESS_LOOKUP_SKELETON_ROWS.map((row) => (
          <Skeleton key={row} className={styles.optionPlaceholder} />
        ))}
      </Box>
    )
  }

  if (isError) {
    return (
      <Box direction="column" gap={1.5} role="alert">
        <Text color="danger">
          Não foi possível buscar este endereço. Você pode tentar novamente ou
          editar os dados informados.
        </Text>
        {onRetry && (
          <Button type="button" variant="secondary" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
      </Box>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Text color="muted">
        Nenhum endereço encontrado. Confira o logradouro e o número.
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
            <Text as="span" size="xs" color="muted">
              {suggestion.secondaryText}
            </Text>
          </Box>
        </Button>
      ))}
    </Box>
  )
}
