import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'

import styles from './AddressConfirmMap.module.css'

type AddressConfirmMapProps = {
  address: AddressSearchResult
  onConfirm: () => void
  onPickAnother: () => void
}

const STREET_LEVEL_ZOOM = '17'
const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed/v1/place'

export const AddressConfirmMap = ({
  address,
  onConfirm,
  onPickAnother,
}: AddressConfirmMapProps) => {
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
    | string
    | undefined
  const mapUrl = mapsApiKey
    ? `${GOOGLE_MAPS_EMBED_URL}?${new URLSearchParams({
        key: mapsApiKey,
        q: `${address.latitude},${address.longitude}`,
        zoom: STREET_LEVEL_ZOOM,
      })}`
    : null

  return (
    <Box direction="column" gap={3} className={styles.addressConfirm}>
      {mapUrl && (
        <Box className={styles.frame}>
          <iframe
            title={`Mapa de ${address.street}, ${address.number}`}
            src={mapUrl}
            className={styles.map}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </Box>
      )}

      <Box direction="row" gap={3} className={styles.addressSummary}>
        <Icon name="map-pin" size="sm" className={styles.addressPin} />
        <Box direction="column" gap={0.5} className={styles.addressText}>
          <Text as="span" size="sm" weight="semibold">
            {address.street}, {address.number}
          </Text>
          <Text as="span" size="xs" color="muted">
            {address.neighborhood}, {address.city} - {address.state}
          </Text>
        </Box>
      </Box>

      <Box direction="row" gap={2} className={styles.actions}>
        <Button type="button" variant="outline" onClick={onPickAnother}>
          Escolher outro
        </Button>
        <Button type="button" onClick={onConfirm}>
          Confirmar endereço
        </Button>
      </Box>
    </Box>
  )
}
