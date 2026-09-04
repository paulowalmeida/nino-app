import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import type { CounterStep } from '@pages/Counter/types/CounterStep.type'

import styles from './CheckoutRail.module.css'

const steps: { key: CounterStep; label: string }[] = [
  { key: 'items', label: 'Itens' },
  { key: 'destination', label: 'Destino' },
  { key: 'payment', label: 'Pagamento' },
  { key: 'review', label: 'Revisão' },
]

type CheckoutRailProps = {
  current: CounterStep
  onStep: (step: CounterStep) => void
}

export const CheckoutRail = ({ current, onStep }: CheckoutRailProps) => {
  const currentIndex = steps.findIndex(({ key }) => key === current)

  return (
    <Box
      as="nav"
      direction="row"
      aria-label="Etapas do pedido"
      className={styles.rail}
    >
      {steps.map((step, index) => {
        const done = index < currentIndex
        const active = index === currentIndex

        return (
          <Box
            key={step.key}
            direction="row"
            align="center"
            className={styles.item}
          >
            <Button
              type="button"
              variant="ghost"
              disabled={!done}
              aria-current={active ? 'step' : undefined}
              aria-label={done ? `Voltar para ${step.label}` : step.label}
              onClick={() => done && onStep(step.key)}
              className={
                active ? styles.active : done ? styles.done : styles.todo
              }
            >
              {done ? '✓' : index + 1}
            </Button>
            {index < steps.length - 1 && (
              <span
                className={done ? styles.barDone : styles.bar}
                aria-hidden="true"
              />
            )}
          </Box>
        )
      })}
    </Box>
  )
}
