import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import { maskMoney } from '@shared/utils/money/money'

import styles from './FreeDeliveryControl.module.css'

type FreeDeliveryControlProps = {
  enabled: boolean
  minOrder: string
  onEnabledChange: (enabled: boolean) => void
  onMinOrderChange: (minOrder: string) => void
}

/* WHY: o mínimo fica sempre na mesma linha do switch, só desabilitado —
 * ligar o frete não muda a altura do card nem do modal. */
export const FreeDeliveryControl = ({
  enabled,
  minOrder,
  onEnabledChange,
  onMinOrderChange,
}: FreeDeliveryControlProps) => (
  <Box className={styles.freeDeliveryControl}>
    <Box direction="row" className={styles.freeDeliveryLine}>
      <FormField label="Frete grátis" orientation="horizontal">
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </FormField>
      <Box direction="row" className={styles.freeDeliveryMinimum}>
        <Text as="span" className={styles.freeDeliveryAbove}>
          acima de
        </Text>
        <Input
          inputMode="decimal"
          placeholder="Qualquer valor"
          aria-label="Grátis acima de (R$)"
          disabled={!enabled}
          className={styles.freeDeliveryInput}
          value={minOrder}
          onChange={(event) => onMinOrderChange(maskMoney(event.target.value))}
        />
      </Box>
    </Box>
    <Text className={styles.freeDeliveryHint}>
      Zera a taxa quando o pedido atinge o mínimo.
    </Text>
  </Box>
)
