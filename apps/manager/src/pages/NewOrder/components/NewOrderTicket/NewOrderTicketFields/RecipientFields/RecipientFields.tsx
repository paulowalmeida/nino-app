import { Box } from '@nino/ds/components/Box'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import type { Recipient } from '@shared/types/order/recipient'

import motion from '@styles/motion.module.css'
import styles from './RecipientFields.module.css'

type RecipientFieldsProps = {
  value: Recipient
  zones: { value: string; label: string }[]
  hasAddress: boolean
  onChange: (patch: Partial<Recipient>) => void
}

export const RecipientFields = ({
  value,
  zones,
  hasAddress,
  onChange,
}: RecipientFieldsProps) => (
  <Box className={`${motion.unroll} ${styles.block}`}>
    <Text as="p" className={styles.title}>
      {hasAddress ? 'Quem recebe' : 'Quem pediu'}
    </Text>

    <Box className={styles.pair}>
      <Input
        placeholder="Nome"
        aria-label="Nome de quem pediu"
        value={value.name}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <Input
        inputMode="tel"
        placeholder="Telefone"
        aria-label="Telefone de quem pediu"
        value={value.phone}
        onChange={(event) => onChange({ phone: event.target.value })}
      />
    </Box>

    {!hasAddress && (
      <Text as="p" className={styles.hint}>
        Opcional — serve para chamar o cliente quando o pedido ficar pronto.
      </Text>
    )}

    {hasAddress && (
      <>
        <Box className={styles.pair}>
          <Input
            placeholder="Rua"
            aria-label="Rua"
            className={styles.street}
            value={value.street}
            onChange={(event) => onChange({ street: event.target.value })}
          />
          <Input
            placeholder="Número"
            aria-label="Número"
            value={value.number}
            onChange={(event) => onChange({ number: event.target.value })}
          />
        </Box>

        <Box className={styles.pair}>
          <Input
            placeholder="Complemento"
            aria-label="Complemento"
            value={value.complement}
            onChange={(event) => onChange({ complement: event.target.value })}
          />
          <Input
            placeholder="Bairro"
            aria-label="Bairro"
            value={value.neighborhood}
            onChange={(event) => onChange({ neighborhood: event.target.value })}
          />
        </Box>

        <Select
          options={zones}
          placeholder={
            zones.length > 0 ? 'Região da entrega' : 'Nenhuma região cadastrada'
          }
          value={value.zoneId}
          aria-label="Região da entrega"
          onValueChange={(zoneId) => onChange({ zoneId })}
        />
      </>
    )}
  </Box>
)
