import { useState } from 'react'

import { Button, Input, Skeleton, Switch } from '@nino/ds'

import type { OpeningHours } from '@custom_types/settings'
import { riseDelay } from '@utils/rise-delay'

import type { HoursDraft, WeekScheduleProps } from './WeekSchedule.types'

import local from './WeekSchedule.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

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
  savingDay,
  onSave,
}: WeekScheduleProps) => {
  const [week, setWeek] = useState<HoursDraft[]>(() =>
    DAYS.map((_, day) => blank(day))
  )
  const [dirtyDay, setDirtyDay] = useState<number | null>(null)
  const [seed, setSeed] = useState<OpeningHours[] | null>(null)

  /** Re-seeds the week when the API sends a different snapshot. */
  if (hours !== seed) {
    setSeed(hours)
    setWeek(toWeek(hours))
    setDirtyDay(null)
  }

  const change = (day: number, patch: Partial<HoursDraft>) => {
    setWeek((current) =>
      current.map((entry) =>
        entry.dayOfWeek === day ? { ...entry, ...patch } : entry
      )
    )
    setDirtyDay(day)
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <section className={styles.card}>
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
              <Input
                type="time"
                size="sm"
                aria-label={`Abre ${DAYS[entry.dayOfWeek]}`}
                value={entry.openTime}
                onChange={(event) =>
                  change(entry.dayOfWeek, { openTime: event.target.value })
                }
              />
              <span className={local.until}>às</span>
              <Input
                type="time"
                size="sm"
                aria-label={`Fecha ${DAYS[entry.dayOfWeek]}`}
                value={entry.closeTime}
                onChange={(event) =>
                  change(entry.dayOfWeek, { closeTime: event.target.value })
                }
              />
            </div>

            {dirtyDay === entry.dayOfWeek && (
              <Button
                size="sm"
                loading={savingDay === entry.dayOfWeek}
                className={`${motion.press} ${local.save}`}
                onClick={() => onSave(entry)}
              >
                Salvar
              </Button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
