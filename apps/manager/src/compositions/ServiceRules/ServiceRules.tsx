import { useState } from 'react'

import { Button, Input, Skeleton, Switch } from '@nino/ds'

import type { PaymentMethod } from '@custom_types/order'
import type { TenantSettings } from '@custom_types/settings'
import { PAYMENT_METHOD_LABEL } from '@utils/order-flow'
import { riseDelay } from '@utils/rise-delay'

import type { ServiceRulesDraft, ServiceRulesProps } from './ServiceRules.types'

import local from './ServiceRules.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

const CHANNELS: {
  key: 'isDeliveryEnabled' | 'isPickupEnabled' | 'isCounterEnabled'
  label: string
  hint: string
}[] = [
  {
    key: 'isDeliveryEnabled',
    label: 'Entrega',
    hint: 'A loja leva o pedido até o cliente.',
  },
  {
    key: 'isPickupEnabled',
    label: 'Retirada',
    hint: 'O cliente pede pelo app e busca na loja.',
  },
  {
    key: 'isCounterEnabled',
    label: 'Balcão',
    hint: 'Alguém da equipe registra o pedido no painel.',
  },
]

const METHODS: PaymentMethod[] = [
  'CASH',
  'CARD_ON_DELIVERY',
  'PIX_ONLINE',
  'CARD_ONLINE',
]

const toDraft = (settings: TenantSettings): ServiceRulesDraft => ({
  isDeliveryEnabled: settings.isDeliveryEnabled,
  isPickupEnabled: settings.isPickupEnabled,
  isCounterEnabled: settings.isCounterEnabled,
  allowGuestOrder: settings.allowGuestOrder,
  requireCpf: settings.requireCpf,
  minOrderAmount: Number(settings.minOrderAmount).toFixed(2).replace('.', ','),
  estimatedMinutes: String(settings.estimatedMinutes),
  acceptedPaymentMethods: settings.acceptedPaymentMethods,
})

const EMPTY: ServiceRulesDraft = {
  isDeliveryEnabled: true,
  isPickupEnabled: false,
  isCounterEnabled: false,
  allowGuestOrder: true,
  requireCpf: false,
  minOrderAmount: '0',
  estimatedMinutes: '30',
  acceptedPaymentMethods: [],
}

export const ServiceRules = ({
  settings,
  isPending,
  isSaving,
  onSave,
}: ServiceRulesProps) => {
  const [draft, setDraft] = useState<ServiceRulesDraft>(EMPTY)
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<TenantSettings | undefined>(undefined)

  /** Re-seeds the draft when the API sends a different snapshot. */
  if (settings && settings !== seed) {
    setSeed(settings)
    setDraft(toDraft(settings))
    setDirty(false)
  }

  const change = (patch: Partial<ServiceRulesDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const toggleMethod = (method: PaymentMethod) =>
    change({
      acceptedPaymentMethods: draft.acceptedPaymentMethods.includes(method)
        ? draft.acceptedPaymentMethods.filter((item) => item !== method)
        : [...draft.acceptedPaymentMethods, method],
    })

  const handleSave = () => {
    onSave({
      isDeliveryEnabled: draft.isDeliveryEnabled,
      isPickupEnabled: draft.isPickupEnabled,
      isCounterEnabled: draft.isCounterEnabled,
      allowGuestOrder: draft.allowGuestOrder,
      requireCpf: draft.requireCpf,
      minOrderAmount: Number(draft.minOrderAmount.replace(',', '.')) || 0,
      estimatedMinutes: Number(draft.estimatedMinutes) || 1,
      acceptedPaymentMethods: draft.acceptedPaymentMethods,
    })
    setDirty(false)
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <section className={styles.card}>
      <header className={`${motion.unroll} ${styles.head}`}>
        <h2 className={styles.title}>Como a loja atende</h2>
        <p className={styles.hint}>
          Vale para o app do cliente e para o pedido aberto no painel.
        </p>
      </header>

      <div className={styles.group}>
        {CHANNELS.map(({ key, label, hint }, index) => (
          <div
            key={key}
            className={`${motion.deal} ${styles.row}`}
            style={riseDelay(index * 50 + 60)}
          >
            <Switch
              checked={draft[key]}
              onCheckedChange={(checked) => change({ [key]: checked })}
              aria-label={label}
            />
            <div className={styles.rowText}>
              <p className={styles.rowLabel}>{label}</p>
              <p className={styles.rowHint}>{hint}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.group}>
        <p className={styles.groupTitle}>Formas de pagamento aceitas</p>
        <div className={local.chips}>
          {METHODS.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => toggleMethod(method)}
              aria-pressed={draft.acceptedPaymentMethods.includes(method)}
              style={{ cursor: 'pointer' }}
              className={`${motion.press} ${local.chip} ${
                draft.acceptedPaymentMethods.includes(method)
                  ? local.chipOn
                  : ''
              }`}
            >
              {PAYMENT_METHOD_LABEL[method]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.row}>
          <Switch
            checked={draft.allowGuestOrder}
            onCheckedChange={(checked) => change({ allowGuestOrder: checked })}
            aria-label="Pedido sem cadastro"
          />
          <div className={styles.rowText}>
            <p className={styles.rowLabel}>Pedido sem cadastro</p>
            <p className={styles.rowHint}>
              O cliente pede informando só nome, telefone e endereço.
            </p>
          </div>
        </div>

        <div className={styles.row}>
          <Switch
            checked={draft.requireCpf}
            onCheckedChange={(checked) => change({ requireCpf: checked })}
            aria-label="Pedir CPF na nota"
          />
          <div className={styles.rowText}>
            <p className={styles.rowLabel}>Pedir CPF na nota</p>
            <p className={styles.rowHint}>Some do checkout quando desligado.</p>
          </div>
        </div>
      </div>

      <div className={local.minimum}>
        <label className={styles.rowLabel} htmlFor="min-order">
          Pedido mínimo
        </label>
        <Input
          id="min-order"
          inputMode="decimal"
          className={local.minimumInput}
          value={draft.minOrderAmount}
          onChange={(event) => change({ minOrderAmount: event.target.value })}
        />
        <p className={styles.rowHint}>Deixe em 0 para não exigir mínimo.</p>
      </div>

      <div className={local.minimum}>
        <label className={styles.rowLabel} htmlFor="estimated-minutes">
          Tempo estimado (min)
        </label>
        <Input
          id="estimated-minutes"
          inputMode="numeric"
          className={local.minimumInput}
          value={draft.estimatedMinutes}
          onChange={(event) =>
            change({ estimatedMinutes: event.target.value })
          }
        />
        <p className={styles.rowHint}>
          Preparo + entrega. Aparece pro cliente na vitrine.
        </p>
      </div>

      <Button
        loading={isSaving}
        disabled={!isDirty}
        className={`${motion.press} ${styles.save}`}
        onClick={handleSave}
      >
        Salvar atendimento
      </Button>
    </section>
  )
}
