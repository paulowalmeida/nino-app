import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Grid } from '@nino/ds/components/Grid'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { Stamp } from '@nino/ds/components/Stamp'
import { Text } from '@nino/ds/components/Text'
import { PAUSE_DURATION_OPTIONS } from '@pages/Overview/constants/overview.constants'

import motion from '@styles/motion.module.css'
import styles from './PauseDurationModal.module.css'

export type PauseDurationModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  openedAt: number | null
  timezone: string | null
  reason: string
  onReasonChange: (reason: string) => void
  onSelectDuration: (minutes: number | undefined) => void
  onCancel: () => void
  isPending: boolean
  pendingMinutes?: number
}

export const PauseDurationModal = ({
  open,
  onOpenChange,
  openedAt,
  timezone,
  reason,
  onReasonChange,
  onSelectDuration,
  onCancel,
  isPending,
  pendingMinutes,
}: PauseDurationModalProps) => {
  const clock = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone ?? undefined,
  })

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      header={
        <Box align="center" gap={3}>
          <Stamp tone="warning" size="lg">
            <Icon name="pause" size="sm" />
          </Stamp>
          <Heading level={2} size="lg">
            Fechar por quanto tempo?
          </Heading>
        </Box>
      }
      body={
        <Box direction="column" gap={5}>
          <Text size="sm" color="muted">
            O cliente vê a loja fechada nesse período e não consegue pedir.
          </Text>

          <FormField label="Motivo">
            <Input
              placeholder="Chuva forte, sem entregador..."
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
            />
          </FormField>

          <Grid columns={2} gap={2}>
            {PAUSE_DURATION_OPTIONS.map(({ minutes, label }) => {
              const reopensAt =
                minutes && openedAt
                  ? clock.format(new Date(openedAt + minutes * 60_000))
                  : null

              return (
                <Button
                  key={label}
                  variant="outline"
                  loading={isPending && pendingMinutes === minutes}
                  className={`${motion.press} ${styles.durationCard}`}
                  onClick={() => onSelectDuration(minutes)}
                >
                  <Text as="span" className={styles.durationLabel}>
                    {label}
                  </Text>
                  <Text as="span" className={styles.durationHint}>
                    {reopensAt ? `reabre ${reopensAt}` : 'sem hora marcada'}
                  </Text>
                </Button>
              )
            })}
          </Grid>
        </Box>
      }
      footer={
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      }
    />
  )
}
