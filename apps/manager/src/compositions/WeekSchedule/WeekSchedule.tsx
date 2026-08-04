import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import { TimePicker } from '@nino/ds/components/TimePicker'
import type { OpeningHours } from '@custom_types/settings'
import type { HoursDraft } from '@custom_types/settings/hours-draft'
import { riseDelay } from '@utils/rise-delay'

import local from './WeekSchedule.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

export type WeekScheduleProps = {
  hours: OpeningHours[]
  isPending: boolean
  isSaving: boolean
  /**
   * The whole week at once — the store decides the schedule as one block.
   * Returns a promise: the button needs to know the instant it saved,
   * without waiting for the refetch, or it becomes clickable again
   * mid-flight.
   */
  onSave: (week: HoursDraft[]) => Promise<unknown>
}

const DAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
]

const blank = (dayOfWeek: number): HoursDraft => ({
  dayOfWeek,
  openTime: '18:00',
  closeTime: '23:00',
  isOpen: false,
})

const toWeek = (hours: OpeningHours[]): HoursDraft[] =>
  DAYS.map((_, day) => {
    const saved = hours.find(({ dayOfWeek }) => dayOfWeek === day)
    if (!saved) return blank(day)
    return {
      id: saved.id,
      dayOfWeek: day,
      openTime: saved.openTime,
      closeTime: saved.closeTime,
      isOpen: saved.isOpen,
    }
  })

export const WeekSchedule = ({
  hours,
  isPending,
  isSaving,
  onSave,
}: WeekScheduleProps) => {
  const [week, setWeek] = useState<HoursDraft[]>(() =>
    DAYS.map((_, day) => blank(day))
  )
  const [saved, setSaved] = useState<HoursDraft[]>(() =>
    DAYS.map((_, day) => blank(day))
  )
  const [seed, setSeed] = useState<OpeningHours[] | null>(null)

  /** Re-seeds the week when the API sends a different snapshot. */
  if (hours !== seed) {
    setSeed(hours)
    setWeek(toWeek(hours))
    setSaved(toWeek(hours))
  }

  /**
   * Only the days that changed go to the API: a single button can't turn
   * into seven requests, or it blows past the API throttle.
   */
  const changed = week.filter((day, index) => {
    const before = saved[index]
    return (
      day.isOpen !== before.isOpen ||
      day.openTime !== before.openTime ||
      day.closeTime !== before.closeTime
    )
  })

  const change = (day: number, patch: Partial<HoursDraft>) => {
    setWeek((current) =>
      current.map((entry) =>
        entry.dayOfWeek === day ? { ...entry, ...patch } : entry
      )
    )
  }

  /**
   * The baseline advances the instant the API confirms, not when the
   * refetch lands: in the gap between the two, the button stops being
   * `loading` and would accept another click, saving the same thing again.
   * A failure keeps the form dirty on purpose — the schedule wasn't saved.
   */
  const handleSave = async () => {
    const sent = week
    try {
      await onSave(changed)
      setSaved(sent)
    } catch {
      /* stays dirty: can be retried */
    }
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <section className={styles.panel}>
      <header className={`${motion.unroll} ${styles.head}`}>
        <h2 className={styles.title}>Quando a loja abre</h2>
        <p className={styles.hint}>
          Fora do horário, o cliente vê a loja fechada e não consegue pedir.
        </p>
      </header>

      <ul className={local.week}>
        {week.map((entry, index) => (
          <li
            key={entry.dayOfWeek}
            className={`${motion.deal} ${local.day} ${
              entry.isOpen ? '' : local.closed
            }`}
            style={riseDelay(index * 45 + 60)}
          >
            <Switch
              checked={entry.isOpen}
              onCheckedChange={(checked) =>
                change(entry.dayOfWeek, { isOpen: checked })
              }
              aria-label={DAYS[entry.dayOfWeek]}
            />

            <span className={local.dayName}>{DAYS[entry.dayOfWeek]}</span>

            <div className={local.times}>
              <TimePicker
                size="sm"
                ariaLabel={`Abre ${DAYS[entry.dayOfWeek]}`}
                value={entry.openTime}
                onValueChange={(openTime) =>
                  change(entry.dayOfWeek, { openTime })
                }
              />
              <span className={local.until}>às</span>
              <TimePicker
                size="sm"
                ariaLabel={`Fecha ${DAYS[entry.dayOfWeek]}`}
                value={entry.closeTime}
                onValueChange={(closeTime) =>
                  change(entry.dayOfWeek, { closeTime })
                }
              />
            </div>

          </li>
        ))}
      </ul>

      <Button
        loading={isSaving}
        disabled={changed.length === 0}
        className={`${motion.press} ${styles.save}`}
        onClick={() => void handleSave()}
      >
        Salvar horários
      </Button>
    </section>
  )
}
