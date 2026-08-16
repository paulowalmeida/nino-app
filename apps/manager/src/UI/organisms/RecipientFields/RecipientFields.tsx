import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import type { Recipient } from '@custom_types/order/recipient'
import styles from './RecipientFields.module.css'
import motion from '@styles/motion.module.css'

export type RecipientFieldsProps = {
  value: Recipient
  zones: { value: string; label: string }[]
  /** Delivery needs address and zone; counter and pickup only need contact. */
  hasAddress: boolean
  onChange: (patch: Partial<Recipient>) => void
}

/**
 * Who ordered. At the counter it is the name called out when the order is
 * ready; over the phone it is also where the order goes — and the zone drives
 * the fee, calculated server-side.
 */
export const RecipientFields = ({
  value,
  zones,
  hasAddress,
  onChange,
}: RecipientFieldsProps) => (
  <div className={`${motion.unroll} ${styles.block}`}>
    <p className={styles.title}>{hasAddress ? 'Quem recebe' : 'Quem pediu'}</p>

    <div className={styles.pair}>
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
    </div>

    {!hasAddress && (
      <p className={styles.hint}>
        Opcional — serve para chamar o cliente quando o pedido ficar pronto.
      </p>
    )}

    {hasAddress && (
      <>
        <div className={styles.pair}>
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
        </div>

        <div className={styles.pair}>
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
        </div>

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
  </div>
)
