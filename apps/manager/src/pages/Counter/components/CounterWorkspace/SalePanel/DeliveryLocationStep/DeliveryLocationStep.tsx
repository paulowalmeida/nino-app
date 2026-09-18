import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import type { Recipient } from '@shared/types/order/recipient'

import styles from './DeliveryLocationStep.module.css'

type DeliveryLocationStepProps = {
  recipient: Recipient
}

export const DeliveryLocationStep = ({
  recipient,
}: DeliveryLocationStepProps) => {
  const { latitude, longitude } = recipient

  if (latitude === undefined || longitude === undefined) return null

  const coordinates = `${latitude},${longitude}`
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(coordinates)}&z=19&output=embed`
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`
  const address = [
    `${recipient.street}, ${recipient.number}`,
    recipient.neighborhood,
    recipient.city,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <Box direction="column" gap={3} className={styles.content}>
      <Box direction="column" gap={1}>
        <Text weight="semibold">{address}</Text>
        <Text size="sm" color="muted">
          Confira se o pin está no local informado. A taxa usa este ponto, não
          o CEP.
        </Text>
      </Box>

      <Box className={styles.mapFrame}>
        <iframe
          title={`Localização de entrega: ${address}`}
          src={mapUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={styles.map}
        />
      </Box>

      <a
        href={externalMapUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.externalLink}
      >
        Abrir no Google Maps
      </a>
    </Box>
  )
}
