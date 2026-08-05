import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { usePause } from '@hooks/store/usePause'
import { usePauseActions } from '@hooks/store/usePauseActions'
import { PAUSE_DURATION_OPTIONS } from '@constants/store.constants'

import styles from './PauseSwitch.module.css'
import motion from '@styles/motion.module.css'

export type PauseSwitchProps = {
  tenantId: string | null
  timezone: string | null
}

/**
 * The dining room's panic button: heavy rain, kitchen backed up, out of
 * dough. Closes before the scheduled time without touching the store's
 * fixed hours.
 */
export const PauseSwitch = ({ tenantId, timezone }: PauseSwitchProps) => {
  const { data: pause, isPending } = usePause(tenantId)
  const { pause: doPause, resume } = usePauseActions(tenantId)

  const [isOpen, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  if (isPending) {
    return <Skeleton className={styles.skeleton} />
  }

  if (!pause) return null

  const clock = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone ?? undefined,
  })

  const until = pause.pausedUntil
    ? clock.format(new Date(pause.pausedUntil))
    : null

  if (pause.isPaused) {
    return (
      <section className={`${motion.settle} ${styles.paused}`}>
        <div className={styles.text}>
          <p className={styles.title}>
            {until ? `Fechada até ${until}` : 'Fechada até você reabrir'}
          </p>
          <p className={styles.hint}>
            {pause.pauseReason ||
              'O cliente vê a loja fechada e não consegue pedir.'}
          </p>
        </div>
        <Button
          size="sm"
          loading={resume.isPending}
          className={motion.press}
          onClick={() => resume.mutate()}
        >
          Reabrir agora
        </Button>
      </section>
    )
  }

  return (
    <section className={styles.open}>
      {!isOpen ? (
        <Button
          variant="outline"
          size="sm"
          className={`${motion.press} ${styles.trigger}`}
          onClick={() => setOpen(true)}
        >
          Fechar a loja por um tempo
        </Button>
      ) : (
        <div className={`${motion.unroll} ${styles.form}`}>
          <p className={styles.formTitle}>Fechar por quanto tempo?</p>

          <Input
            placeholder="Motivo (o cliente vê)"
            value={reason}
            className={styles.reason}
            onChange={(event) => setReason(event.target.value)}
          />

          <div className={styles.options}>
            {PAUSE_DURATION_OPTIONS.map(({ minutes, label }) => (
              <Button
                key={label}
                size="sm"
                variant="outline"
                loading={
                  doPause.isPending && doPause.variables?.minutes === minutes
                }
                className={motion.press}
                onClick={() => {
                  doPause.mutate({ minutes, reason: reason || undefined })
                  setOpen(false)
                  setReason('')
                }}
              >
                {label}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Voltar
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
