import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'
import type { UnitMapLocation } from '@shared/types/store/unit-map-location'

import styles from './AddressConfirmMap.module.css'

type AddressConfirmMapProps = {
  address: AddressSearchResult
  isUpdatingAddress: boolean
  onPinMove: (location: UnitMapLocation) => void
  onConfirm: () => void
  onPickAnother: () => void
}

const STREET_LEVEL_ZOOM = 17

export const AddressConfirmMap = ({
  address,
  isUpdatingAddress,
  onPinMove,
  onConfirm,
  onPickAnother,
}: AddressConfirmMapProps) => {
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
    | string
    | undefined
  const pinPosition = { lat: address.latitude, lng: address.longitude }

  const movePin = (
    position: google.maps.LatLng | google.maps.LatLngLiteral
  ) => {
    const { lat, lng } = 'toJSON' in position ? position.toJSON() : position
    onPinMove({ latitude: lat, longitude: lng })
  }

  return (
    <Box direction="column" gap={3} className={styles.addressConfirm}>
      {mapsApiKey && (
        <Box
          direction="column"
          gap={1.5}
          role="group"
          aria-label={`Mapa de ${address.street}, ${address.number}`}
        >
          <Box className={styles.frame}>
            <APIProvider apiKey={mapsApiKey}>
              <Map
                className={styles.map}
                defaultCenter={pinPosition}
                defaultZoom={STREET_LEVEL_ZOOM}
                disableDefaultUI
                zoomControl
                gestureHandling="greedy"
                onClick={(event) => {
                  if (event.detail.latLng) movePin(event.detail.latLng)
                }}
              >
                <Marker
                  position={pinPosition}
                  title="Ponto de entrega"
                  draggable
                  onDragEnd={(event) => {
                    if (event.latLng) movePin(event.latLng)
                  }}
                />
              </Map>
            </APIProvider>
          </Box>
          <Text as="span" size="xs" color="muted">
            {isUpdatingAddress
              ? 'Atualizando o endereço do ponto…'
              : 'Arraste o pino ou toque no mapa para ajustar o ponto de entrega.'}
          </Text>
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
        <Button type="button" disabled={isUpdatingAddress} onClick={onConfirm}>
          Confirmar endereço
        </Button>
      </Box>
    </Box>
  )
}
