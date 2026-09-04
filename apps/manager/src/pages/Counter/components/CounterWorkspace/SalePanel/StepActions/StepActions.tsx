import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './StepActions.module.css'

type StepActionsProps = {
  subtotal: number
  deliveryFee: number
  total: number
  canContinue: boolean
  continueLabel?: string
  onBack?: () => void
  onContinue: () => void
}

export const StepActions = ({
  subtotal,
  deliveryFee,
  total,
  canContinue,
  continueLabel = 'Continuar',
  onBack,
  onContinue,
}: StepActionsProps) => (
  <Box className={styles.footer}>
    <Box direction="column" className={styles.totals}>
      {deliveryFee > 0 && (
        <>
          <Box direction="row" justify="between" align="baseline">
            <Text size="sm" color="muted">
              Itens
            </Text>
            <Text size="sm" color="muted" className={styles.tabular}>
              {brl(subtotal)}
            </Text>
          </Box>
          <Box direction="row" justify="between" align="baseline">
            <Text size="sm" color="muted">
              Entrega
            </Text>
            <Text size="sm" color="muted" className={styles.tabular}>
              {brl(deliveryFee)}
            </Text>
          </Box>
        </>
      )}
      <Box direction="row" justify="between" align="baseline">
        <Text size="sm" color="muted">
          Total
        </Text>
        <Text size="xl" weight="extrabold" font="display">
          {brl(total)}
        </Text>
      </Box>
    </Box>
    <Box direction="row" align="center" gap={2} className={styles.actions}>
      <Text as="span" size="xs" color="faint" className={styles.keys}>
        <Box className={styles.key}>
          <kbd>Enter</kbd> continuar
        </Box>
        <Box className={styles.key}>
          <kbd>Esc</kbd> fechar
        </Box>
      </Text>
      {onBack && (
        <Button
          type="button"
          variant="outline"
          className={styles.back}
          onClick={onBack}
        >
          Voltar
        </Button>
      )}
      <Button
        type="button"
        disabled={!canContinue}
        className={mergeClasses(motion.press, styles.continue)}
        onClick={onContinue}
      >
        {continueLabel}
      </Button>
    </Box>
  </Box>
)
